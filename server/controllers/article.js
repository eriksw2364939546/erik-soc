import Article from "../models/article.js";
import multer from "multer";


async function getAllArticle(req, res) {
	try {
		const author = req.params.author;

		let articles;

		if (author) {
			articles = await Article.find({ author });
		} else {
			articles = await Article.find();
		}

		if (!articles.length) {
			return res.status(404).json({ status: false, message: "Постів на даний момент ще немає" });
		}

		return res.status(200).json({ status: true, articles, message: "Масив з постами!" });
	} catch (error) {
		return res.status(500).json({ status: false, message: error.message });
	}
}

async function createArticle(req, res) {
	try {
		let user = req.user
		let { title, text } = req.body
		let image = req.file;

		console.log(user)
		if (!title || !text || !image || !user) {
			return res.status(400).json({
				status: false,
				message: "Ви передали не всі поля!"
			})
		}

		let newArticle = new Article({
			author: user.login, title, text, image: image.path
		})

		await newArticle.save()

		return res.status(201).json({
			status: true,
			message: "Пост опубліковано!",
		})
	} catch (error) {
		return res.status(500).json({ status: false, message: error })
	}
}

async function createComment(req, res) {
	try {
		let user = req.user
		let { comment, articleId } = req.body

		if (!comment || !user || !articleId) {
			return res.status(400).json({
				status: false,
				message: "Ви передали не всі поля!"
			})
		}

		let currArticle = await Article.findById({ _id: articleId })

		if (!currArticle) return res.status(404).json({
			status: false,
			message: "Такого поста більше не існує!"
		})

		currArticle.comments.push({
			author: user.login,
			text: comment
		})

		await currArticle.save()

		return res.status(201).json({
			status: true,
			message: "Коментар додано!",
			currArticle
		})
	} catch (error) {
		return res.status(500).json({ status: false, message: error })
	}
}

async function controllLike(req, res) {
	try {
		let user = req.user
		let { articleId } = req.body

		if (!user || !articleId) {
			return res.status(400).json({
				status: false,
				message: "Вам потрібно авторизуватись!"
			})
		}

		let currArticle = await Article.findById({ _id: articleId })

		let isLiked = currArticle.likes.findIndex(el => el === user.login)

		if (isLiked >= 0) {
			currArticle.likes.splice(isLiked, 1)
		} else {
			currArticle.likes.push(user.login)
		}

		await currArticle.save()

		return res.status(200).json({
			status: true,
			message: "Лайк оброблено!",
			currArticle
		})
	} catch (error) {
		return res.status(500).json({ status: false, message: error })
	}
}

async function deleteArticle(req, res) {
	try {
		const { articleId } = req.params;
		const user = req.user;

		if (!articleId) {
			return res.status(400).json({
				status: false,
				message: "Вам потрібно вказати ID поста для видалення!"
			});
		}

		const currArticle = await Article.findById(articleId);

		if (!currArticle) {
			return res.status(404).json({
				status: false,
				message: "Такого поста більше не існує!"
			});
		}
		if (currArticle.author !== user.login) {
			return res.status(403).json({
				status: false,
				message: "Ви не маєте права видаляти цей пост!"
			});
		}
		await Article.findByIdAndDelete(articleId);

		return res.status(200).json({
			status: true,
			message: "Пост успішно видалено!"
		});
	} catch (error) {
		return res.status(500).json({ status: false, message: error.message });
	}
}

async function getArticle(req, res) {
	try {
		const articleId = req.params.id;
		const article = await Article.findById(articleId);

		console.log("Hello")

		if (!article) {
			return res.status(404).json({
				status: false,
				message: "Статья не найдена"
			});
		}

		return res.status(200).json({
			status: true,
			articles: article,
			message: "Статья найдена!"
		});
	} catch (error) {
		return res.status(500).json({
			status: false,
			message: error.message
		});
	}
}


export { createArticle, createComment, controllLike, getAllArticle, deleteArticle, getArticle }

