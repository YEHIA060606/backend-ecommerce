import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ["unpaid", "paid", "cancelled"],
      default: "unpaid",
    },
    issuedAt: {
      type: Date,
      default: Date.now,
    },
    paidAt: {
      type: Date,
    },
    paymentMethod: {
      type: String,
      enum: ["card", "cash", "paypal", "bank_transfer", null],
      default: "card",
    },
  },
  { timestamps: true }
);

const Invoice = mongoose.model("Invoice", invoiceSchema);

export default Invoice;
