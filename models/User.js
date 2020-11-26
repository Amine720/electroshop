import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
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
	card: Array,
});

const User = mongoose.model("user", userSchema);
export default User;
