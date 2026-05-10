import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";

// Đăng nhập vào Cloudinary bằng Key của bạn
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "bookstore", // Thư mục này sẽ tự tạo trên Cloudinary
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});

const uploadBookImage = multer({ storage });
export default uploadBookImage;
