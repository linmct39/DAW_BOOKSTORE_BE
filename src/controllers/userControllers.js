import { transporter } from "./email.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"; // Đảm bảo bạn đã cài và import jwt
import db from "../config/db.js";

// 1. Lấy danh sách tất cả user
export const getAllUsers = async (req, res) => {
  try {
    // MySQL trả về 1 mảng [rows, fields], chúng ta chỉ lấy rows
    const [users] = await db.query("SELECT id, username FROM user");
    res.status(200).json(users);
  } catch (error) {
    console.error("lỗi khi gọi getAllUsers", error);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

// 2. Đăng ký (Register)
export const register = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: "Thiếu username hoặc password" });
    }

    const [existingUsers] = await db.query("SELECT * FROM user WHERE username = ?", [
      username,
    ]);
    if (existingUsers.length > 0) {
      return res.status(400).json({ message: "Tài khoản đã tồn tại" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await db.query(
      "INSERT INTO user (username, password) VALUES (?, ?)",
      [username, hashedPassword],
    );

    res.status(201).json({
      message: "Tạo user thành công",
      data: { id: result.insertId, username },
    });
  } catch (error) {
    console.error("Lỗi khi đăng ký user:", error);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

// 3. Đăng nhập (Login)
export const logIn = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: "Thiếu username hoặc password" });
    }

    // Tìm user bằng username
    const [users] = await db.query("SELECT * FROM user WHERE username = ?", [username]);
    const user = users[0];

    if (!user) {
      return res.status(401).json({ message: "Username hoặc password không chính xác" });
    }

    const passwordCorrect = await bcrypt.compare(password, user.password);
    if (!passwordCorrect) {
      return res.status(401).json({ message: "Username hoặc password không chính xác" });
    }

    return res.status(200).json({
      message: "Đăng nhập thành công",
      data: { id: user.id, username: user.username },
    });
  } catch (error) {
    console.error("Lỗi khi gọi logIn", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

// 4. Cập nhật User
export const updateUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const { id } = req.params;

    // Nếu có đổi password thì phải hash lại
    let sql = "UPDATE user SET username = ? WHERE id = ?";
    let params = [username, id];

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      sql = "UPDATE user SET username = ?, password = ? WHERE id = ?";
      params = [username, hashedPassword, id];
    }

    const [result] = await db.query(sql, params);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Không tìm thấy user" });
    }
    res.status(200).json({ message: "Cập nhật thành công" });
  } catch (error) {
    console.error("lỗi khi gọi updateUser", error);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

// 6. Xóa User
export const deleteUser = async (req, res) => {
  try {
    const [result] = await db.query("DELETE FROM user WHERE id = ?", [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Không tìm thấy user" });
    }
    res.status(200).json({ message: "Xóa user thành công" });
  } catch (error) {
    console.error("lỗi khi gọi deleteUser", error);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};
