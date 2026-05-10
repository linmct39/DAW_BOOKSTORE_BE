import mysql from "mysql2";
import "dotenv/config";
// Tạo một pool kết nối (tối ưu hơn việc tạo 1 kết nối đơn lẻ)
const pool = mysql.createPool({
  host: process.env.MYSQL_CONNECTIONSTRING, // Ví dụ: mysql-bookstore-king.aivencloud.com
  user: process.env.USER, // User mặc định của Aiven
  password: process.env.PASSWORD, // Mật khẩu Aiven cấp
  database: process.env.DATABASE, // Tên DB trên Aiven (thường là defaultdb hoặc BookStore)
  port: process.env.PORT, // Port của Aiven (thường không phải 3306)
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: {
    rejectUnauthorized: false, // Bắt buộc phải có để kết nối vào Cloud Aiven
  },
});

// Chuyển pool sang dạng promise để dùng async/await cho hiện đại
const db = pool.promise();

export default db;
