// import multer from "multer";
// import path from "path"

// const storage = multer.diskStorage({
// 	destination: function (req, file, cb) {
// 		cb(null, 'uploads/');
// 	},
// 	filename: function (req, file, cb) {
// 		const uniqueSuffix = req.user.login;
// 		const extension = path.extname(file.originalname);
// 		cb(null, file.fieldname + '-' + uniqueSuffix + extension);
// 	}
// });

// const uploadUserImage = multer({ storage: storage });

// export default uploadUserImage

import multer from "multer";
import path from "path";
import sharp from "sharp";
import fs from "fs";

// Настройка хранилища multer
const storage = multer.memoryStorage(); // Сохраняем изображение в памяти, а не на диске

const uploadUserImage = multer({ storage: storage });

// Мiddleware для преобразования изображения в PNG и сохранения
const processImage = async (req, res, next) => {
	if (!req.file) {
		return next();
	}

	const uniqueSuffix = req.user.login;
	const outputPath = `uploads/${req.file.fieldname}-${uniqueSuffix}.png`; // Указываем имя файла с .png

	try {
		await sharp(req.file.buffer)
			.png() // Преобразование в PNG
			.toFile(outputPath); // Сохраняем файл
		req.file.path = outputPath; // Добавляем путь к файлу в req.file для дальнейшего использования
		next();
	} catch (error) {
		return res.status(500).send({ error: "Error processing image." });
	}
};

export { uploadUserImage, processImage };
