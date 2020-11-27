import mongoose from "mongoose";
import log from "../logs/logs.js";

const connectDB = async () => {
	try {
		await mongoose.connect("mongodb://localhost:27017/electroshop", {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		console.log("Connected succussfully to db...");
	} catch (err) {
		log(err.message);
		console.log(err.message);
	}
};

export default connectDB;
