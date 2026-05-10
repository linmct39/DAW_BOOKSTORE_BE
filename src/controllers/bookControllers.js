/**
 * 🟢 CREATE - Thêm sách
 */
import Book from "../models/Book.js"; // Đảm bảo bạn đã import model Book

export const createBook = async (req, res) => {
  try {
    const { title, author, price, category_id, description, stock } = req.body;

    // Lấy đường dẫn ảnh
    const image = req.file?.path || req.file?.secure_url || null;

    const book = new Book({
      title,
      author,
      price,
      category_id,
      description,
      stock,
      thumbnail: image,
    });

    const newBook = await book.save();

    // ✅ Populate đúng cách
    const populateBook = await Book.findById(newBook._id).populate("category_id");

    res.status(201).json(populateBook);
  } catch (error) {
    console.error("Lỗi khi tạo sách:", error);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

/**
 * 🟡 READ - Lấy tất cả sách
 */
export const getAllBooks = async (req, res) => {
  try {
    const books = await Book.find().populate("category_id"); // lấy luôn thông tin category

    res.json({
      count: books.length,
      data: books,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * 🔵 READ - Lấy 1 sách theo ID
 */
export const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate("category_id");

    if (!book) {
      return res.status(404).json({ message: "Không tìm thấy sách" });
    }

    res.json(book);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * 🟠 UPDATE - Cập nhật sách
 */
export const updateBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }, // trả về dữ liệu mới
    );

    if (!book) {
      return res.status(404).json({ message: "Không tìm thấy sách" });
    }

    res.json({
      message: "Cập nhật thành công",
      data: book,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * 🔴 DELETE - Xóa sách
 */
export const deleteBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);

    if (!book) {
      return res.status(404).json({ message: "Không tìm thấy sách" });
    }

    res.json({
      message: "Xóa thành công",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
