import mongoose, { Schema } from "mongoose";

const productSchema = new Schema({
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
	photo: {
		type: String,
		required: true,
	},
	reviews: Array,
});

const Product = mongoose.model("product", productSchema);
export default Product;
