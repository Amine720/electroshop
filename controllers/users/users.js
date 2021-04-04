import bcrypt from "bcryptjs";
import User from "../../models/User.js";
import Card from "../../models/Card.js";
import log from "../../logs/logs.js";
import sendmail from "../../utils/mail.js";
import Product from "../../models/Product.js";

export const login = async (data) => {
	try {
		const { email, password } = data;
		const user = await User.findOne({ email });
		if (!user) {
			return { error: "user not found", status: 404 };
		}
		let isAuth = await bcrypt.compare(password, user.password);
		if (!isAuth) {
			return { error: "wrong credentials", status: 400 };
		} else {
			// const cart = await Product.find({ _id: { $in: user.card } });
			return {
				userId: user._id,
				username: user.username,
				email: user.email,
				cart: user.cart.length,
			};
		}
	} catch (err) {
		log(err.message);
		console.log(err.message);
		return { error: err.message };
	}
};

export const register = async ({
	username,
	email,
	password,
	phone,
	address,
	country,
}) => {
	try {
		let user = await User.findOne({ email });
		if (user) {
			return { error: "user already exists", status: 409 };
		}
		const salt = await bcrypt.genSalt(10);
		let hasedPassword = await bcrypt.hash(password, salt);
		user = new User({
			username,
			email,
			password: hasedPassword,
			phone,
			address,
			country,
		});

		let registeredUser = await user.save();
		let card = new Card({ user: registeredUser._id });
		await card.save();
		await sendmail(email, registeredUser._id);
		return {
			message:
				"User created successfully, please verify your account through the email we sent you",
			status: 201,
		};
	} catch (err) {
		log(err.message);
		console.log(err.message);
		return {
			error: err.message,
			status: 400,
		};
	}
};

export const verify = async (id) => {
	try {
		let user = await User.findById(id);
		if (user.verified !== true) {
			user.verified = true;
			await user.save();
			return { message: "User is now verified" };
		} else {
			return { message: "User is already verified" };
		}
	} catch (err) {
		log(err.message);
		console.log(err.message);
	}
};
