import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  description: String,
  price: {
    type: Number,
    required: true,
  },
  stock: {
    type: Number,
    default: 0,
  },
  category_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  thumbnail: {
    type: String,
    required: true,
  },
});

export default mongoose.models.Book || mongoose.model("Book", bookSchema);
