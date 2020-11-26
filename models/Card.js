import mongoose, { Schema } from "mongoose";

const cardSchema = new Schema({
	user: {
		type: mongoose.Types.ObjectId,
		ref: "user",
		required: true,
	},
	products: Array,
	totalQte: {
		type: Number,
		default: 0,
	},
	totalPrice: {
		type: Number,
		default: 0,
	},
});

const Card = mongoose.model("card", cardSchema);
export default Card;
