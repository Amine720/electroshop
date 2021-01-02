import { Router } from "express";
import { login } from "../controllers/users/users.js";
import { register } from "../controllers/users/users.js";
import { verify } from "../controllers/users/users.js";

const router = Router();

router.get("/login", (req, res) => {
	res.render("login");
});

router.post("/login", async (req, res) => {
	const response = await login(req.body);
	if (response.error) {
		return res.status(response.status).json({ message: response.error });
	}
	if (response) {
		req.session.userId = response.userId;
		req.session.cart = response.cart;
		req.session.username = response.username;
		// return res.status(200).json({ user: response });

		res.setHeader("Cache-Control", "no-cach, no-store, must-revalidate");
		res.redirect("/");
	}
});

router.post("/register", async (req, res) => {
	try {
		const registerResponse = await register(req.body);
		if (registerResponse.error) {
			return res
				.status(registerResponse.status)
				.json({ message: registerResponse.error });
		}
		return res
			.status(registerResponse.status)
			.json({ message: registerResponse.message });
	} catch (err) {
		console.log(err.message);
	}
});

router.get("/register/verify/:id", async (req, res) => {
	const response = await verify(req.params.id);
	return res.json(response);
});

export default router;
