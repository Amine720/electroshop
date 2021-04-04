import User from "../models/User.js";

export default async (req, res, next) => {
	if (req.session.userId) {
		const user = await User.findById(req.session.userId);
		if (!user.verified) {
			return res.json("Please verify your account");
		}
		next();
	} else {
		res.redirect("/login");
	}
};
