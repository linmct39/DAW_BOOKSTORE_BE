import mongoose from "mongoose";

const invoiceDetailSchema = new mongoose.Schema({
  invoice_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Invoice",
    required: true,
  },
  book_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Book",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  unit_price: {
    type: Number,
    required: true,
  },
});

export default mongoose.models.InvoiceDetail ||
  mongoose.model("InvoiceDetail", invoiceDetailSchema);
