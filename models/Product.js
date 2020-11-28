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
	reviews: {
		type: Array,
		default: [],
	},
});

const Product = mongoose.model("product", productSchema);
export default Product;
