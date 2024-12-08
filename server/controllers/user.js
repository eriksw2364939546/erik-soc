import User from "../models/user.js"
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import multer from "multer";

async function createUser(req, res) {
	try {
		const { login, password, email, name } = req.body


		if (!login || !password || !email || !name) {
			return res.status(400).json({ status: false, message: "Ви передали не усі параметри!" })
		}

		const existingUserEmail = await User.findOne({ email })
		if (existingUserEmail) return res.status(404).json({ status: false, message: "Такий email уже існує" })

		const existingUserLogin = await User.findOne({ login })
		if (existingUserLogin) return res.status(404).json({ status: false, message: "Такий логін занятий" })


		const hashedPassword = await bcrypt.hash(password, 2);

		const token = jwt.sign({ login }, process.env.JWT_SECRET);

		const newUser = new User({ login, password: hashedPassword, email, name, token })

		await newUser.save()

		return res.status(201).json({
			status: true,
			message: "Користувача створено",
			user: {
				email,
				name,
				token,
				image: ""
			},
		})
	} catch (error) {
		return res.status(500).json({ status: false, message: error })
	}
}

async function loginUser(req, res) {
	try {
		const { login, password } = req.body;

		if (!login || !password) {
			return res.status(400).json({ status: false, message: "Ви передали не усі параметри!" });
		}

		const user = await User.findOne({ $or: [{ login }, { email: login }] });

		if (!user) {
			return res.status(404).json({ status: false, message: "Користувача не знайдено" });
		}

		const isPasswordValid = await bcrypt.compare(password, user.password);

		if (!isPasswordValid) {
			return res.status(401).json({ status: false, message: "Неправильний пароль" });
		}

		return res.status(200).json({
			status: true,
			message: "Авторизація успішна",
			user: {
				name: user.name,
				email: user.email,
				token: user.token,
				image: user.image
			}
		});
	} catch (error) {
		return res.status(500).json({ status: false, message: error.message });
	}
}

async function authUser(req, res) {
	try {
		const user = req.user

		if (!user) {
			return res.status(404).json({ status: false, message: "Потрібна авторизація для доступу!" })
		}

		return res.status(200).json({
			status: true,
			message: "Авторизація пройшла успішно",
			user: {
				name: user.name,
				email: user.email,
				login: user.login,
				token: user.token,
				image: user.image
			}
		})
	} catch (error) {
		return res.status(500).json({ status: false, message: error.message });
	}
}

async function addUserPhoto(req, res) {
	try {
		let user = req.user
		let image = req.file;

		if (!image || !user) {
			return res.status(400).json({
				status: false,
				message: "Ви передали не всі поля!"
			})
		}

		let exUser = await User.findById(user._id)

		if (!exUser) {
			return res.status(400).json({
				status: false,
				message: "Такого пользователя нету!"
			})
		}

		exUser.image = image.path

		await exUser.save()

		return res.status(201).json({
			status: true,
			message: "Фото опубликовано",
			user: exUser
		})
	} catch (error) {
		return res.status(500).json({ status: false, message: error })
	}
}



export { createUser, loginUser, authUser, addUserPhoto }