import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import menuRoutes from "./routes/menuRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import connectDB from "./config/db.js";
import { startScheduler } from "./utils/scheduler.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use("/api/menu", menuRoutes);
app.use("/api/orders", orderRoutes);

startScheduler();

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
	console.log(`🚀 Server running on port ${PORT}`);
	connectDB();
});
