import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  items: [
    {
      itemId: { type: mongoose.Schema.Types.ObjectId, ref: "MenuItem" },
      qty: Number,
      price: Number,
    },
  ],
  status: { type: String, enum: ["PENDING", "PAID", "CANCELLED"], default: "PENDING" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Order", orderSchema);
