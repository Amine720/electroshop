import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
	username: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
	phone: {
		type: String,
		required: true,
	},
	address: {
		type: String,
		required: true,
	},
	country: {
		type: String,
		required: true,
	},
	verified: {
		type: Boolean,
		default: false,
	},
	card: Array,
});

const User = mongoose.model("user", userSchema);
export default User;
