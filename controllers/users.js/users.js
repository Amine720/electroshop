import bcrypt from "bcryptjs";
import User from "../../models/User.js";
import log from "../../logs/logs.js";

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
			return {
				username: user.username,
				email: user.email,
				card: user.card,
			};
		}
	} catch (err) {
		log(err.message);
		console.log(err.message);
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
		await user.save();
		return { message: "User created successfully", status: 201 };
	} catch (err) {
		log(err.message);
		console.log(err.message);
	}
};
