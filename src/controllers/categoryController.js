import Category from "../models/Category.js";

/**
 * 🟢 CREATE - Thêm category
 */
export const createCategory = async (req, res) => {
  try {
    const category = await Category.create(req.body);

    res.status(201).json({
      message: "Tạo category thành công",
      data: category,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * 🟡 READ - Lấy tất cả category
 */
export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();

    res.json({
      count: categories.length,
      data: categories,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * 🔵 READ - Lấy 1 category theo ID
 */
export const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: "Không tìm thấy category" });
    }

    res.json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * 🟠 UPDATE - Cập nhật category
 */
export const updateCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!category) {
      return res.status(404).json({ message: "Không tìm thấy category" });
    }

    res.json({
      message: "Cập nhật thành công",
      data: category,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * 🔴 DELETE - Xóa category
 */
export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);

    if (!category) {
      return res.status(404).json({ message: "Không tìm thấy category" });
    }

    res.json({
      message: "Xóa thành công",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
