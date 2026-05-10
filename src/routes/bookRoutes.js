import express from "express";
import {
  createBook,
  getAllBooks,
  getBookById,
  updateBook,
  deleteBook,
} from "../controllers/bookControllers.js";
import uploadBookImage from "../middleware/upload.js";

const router = express.Router();

router.post("/", uploadBookImage.single("thumbnail"), createBook);
router.get("/", getAllBooks);
router.get("/:id", getBookById);
router.put("/:id", updateBook);
router.delete("/:id", deleteBook);

export default router;
