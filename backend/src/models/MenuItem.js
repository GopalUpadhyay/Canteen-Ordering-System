import mongoose from "mongoose";

const menuItemSchema = new mongoose.Schema({
	name: { type: String, required: true },
	price: { type: Number, required: true },
	stock: { type: Number, default: 0 },
});

export default mongoose.model("MenuItem", menuItemSchema);
