import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true,
	},
	price: {
		type: Number,
		required: true,
	},
	quantity: {
		type: Number,
		required: true,
	},
	description: {
		type: String,
		required: true,
	},
	photos: {
		type: Array,
		required: true,
	},
	category: {
		type: String,
		required: true,
	},
	featured: {
		type: Boolean,
		default: false,
	},
	new: {
		type: Boolean,
		default: false,
	},
	reviews: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "review",
		},
	],
});

const Product = mongoose.model("product", productSchema);
export default Product;
