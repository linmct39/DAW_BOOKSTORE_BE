import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import path from "path";
import db from "./config/db.js";
import bookRoutes from "./routes/bookRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import session from "express-session";

dotenv.config();

const PORT = process.env.PORT || 5001;
const __dirname = path.resolve();
const app = express();

app.use(express.json());

app.listen(3000, () => {
  console.log("Server đang chạy tại http://localhost:3000");
});
app.use(
  session({
    secret: "my-secret-key",
    resave: false,
    saveUninitialized: false,

    cookie: {
      secure: false, // true nếu dùng https
      maxAge: 1000 * 60 * 60, // 1 giờ
    },
  }),
);
if (process.env.NODE_ENV === "development") {
  app.use(cors({ origin: "http://localhost:5173" }));
}

app.use("/api/users", userRoutes);
app.use("/uploads", express.static(path.join(process.cwd(), "src/uploads")));
app.use("/api/books", bookRoutes);
app.use("/api/categorys", categoryRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
  });
}

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

export default app;
