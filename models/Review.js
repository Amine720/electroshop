import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
	username: {
		type: String,
		required: true,
	},
	rating: {
		type: Number,
		required: true,
	},
	feedback: {
		type: String,
		required: true,
	},
});

const Review = mongoose.model("review", reviewSchema);
export default Review;
