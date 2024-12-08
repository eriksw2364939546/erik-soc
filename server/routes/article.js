import express from "express";
import { createArticle, createComment, controllLike, getAllArticle, deleteArticle, getArticle } from "../controllers/article.js";
import uploadImage from "../middleware/uploadImage.js";
import authMiddleware from "../middleware/auth.js";

const articleRouter = express.Router();

articleRouter.get("/", getAllArticle);
articleRouter.get("/:id", getArticle);
articleRouter.get("/author/:author", getAllArticle);
articleRouter.post("/create", authMiddleware, uploadImage.single('image'), createArticle);
articleRouter.post("/add-comment", authMiddleware, createComment);
articleRouter.post("/like", authMiddleware, controllLike);
articleRouter.delete("/:articleId", authMiddleware, deleteArticle);

export default articleRouter;
