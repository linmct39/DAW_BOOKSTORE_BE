import { transporter } from "./email.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"; // Đảm bảo bạn đã cài và import jwt
import db from "../config/db.js";

// 1. Lấy danh sách tất cả user
export const getAllUsers = async (req, res) => {
  try {
    // MySQL trả về 1 mảng [rows, fields], chúng ta chỉ lấy rows
    const [users] = await db.query("SELECT id, username, email FROM user");
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
    const { email, password } = req.body;
    const { id } = req.params;

    // Nếu có đổi password thì phải hash lại
    let sql = "UPDATE user SET email = ? WHERE id = ?";
    let params = [email, id];

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      sql = "UPDATE user SET email = ?, password = ? WHERE id = ?";
      params = [email, hashedPassword, id];
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

// 5. Kiểm tra Email tồn tại
export const authEmail = async (req, res) => {
  try {
    const [users] = await db.query("SELECT * FROM user WHERE email = ?", [
      req.params.Email,
    ]);
    if (users.length > 0) {
      return res.status(200).json({ message: "Email đã tồn tại", user: users[0] });
    }
    return res.status(404).json({ message: "Email chưa tồn tại" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
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

// 7. Gửi Email xác nhận (Đăng ký qua email)
export const sendEmail = async (req, res) => {
  try {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    // Lưu user với trạng thái verified = false (mặc định)
    const [result] = await db.query(
      "INSERT INTO user (email, password, verified) VALUES (?, ?, ?)",
      [email, hashedPassword, false],
    );

    const token = jwt.sign({ id: result.insertId }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    const verifyLink = `http://localhost:5000/api/verify/${token}`;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Xác nhận Email",
      html: `<h1>Chào bạn!</h1><p>Nhấn vào link để xác nhận:</p><a href="${verifyLink}">${verifyLink}</a>`,
    });

    res.json({ message: "Vui lòng kiểm tra Email để xác nhận." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Lỗi gửi email đăng ký" });
  }
};

// 8. Xác thực Email
export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const [result] = await db.query("UPDATE user SET verified = true WHERE id = ?", [
      decoded.id,
    ]);

    if (result.affectedRows === 0) return res.status(400).send("User không tồn tại.");
    res.send("Xác nhận Email thành công! Bạn có thể đăng nhập.");
  } catch (error) {
    res.status(400).send("Token không hợp lệ hoặc đã hết hạn.");
  }
};
