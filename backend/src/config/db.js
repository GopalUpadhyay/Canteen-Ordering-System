import mongoose from "mongoose";

const ConnectDB = async () => {
	const mongoUrl = process.env.MONGODB_URL;
	if (!mongoUrl) {
		console.log("Error: MONGODB_URL is not defined in environment variables.");
		return;
	}
	try {
		const conn = await mongoose.connect(mongoUrl);
		console.log(`MongoDB is Connected On: ${conn.connection.host}`);
	} catch (error) {
		console.log("Error In Connecting To MongoDB:" + error);
	}
};

export default ConnectDB;
