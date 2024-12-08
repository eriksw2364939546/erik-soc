import jwt from 'jsonwebtoken';
import User from '../models/user.js';

const authMiddleware = async (req, res, next) => {
	const token = req.headers.authorization;

	if (!token) {
		return res.status(401).json({ status: false, message: "Токен не предоставлен" });
	}

	try {
		console.log(token)
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		const user = await User.findOne({ login: decoded.login });

		if (!user) {
			return res.status(404).json({ status: false, message: "Пользователь не найден!" });
		}

		req.user = user;
		next();
	} catch (error) {
		return res.status(401).json({ status: false, message: "Ошибка авторизации!" });
	}
};

export default authMiddleware;

