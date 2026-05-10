import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  category_name: {
    type: String,
    required: true,
    trim: true,
  },
});

export default mongoose.models.Category || mongoose.model("Category", categorySchema);
