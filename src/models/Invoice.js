import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    total_price: Number,
    status: {
      type: String,
      default: "pending",
    },
    payment_method: String,
    address: String,
  },
  { timestamps: true },
);

export default mongoose.models.Invoice || mongoose.model("Invoice", invoiceSchema);
