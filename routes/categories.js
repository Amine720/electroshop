import { Router } from "express";
import { searchProductByCategory } from "../controllers/products/products.js";
import User from "../models/User.js";

const router = Router();

router.get("/:category", async (req, res) => {
	const response = await searchProductByCategory(req.params.category);
	if (response.error) {
		return res.json({ error });
	}
	let user = "guest";
	let cart = 0;
	if (req.session.userId) {
		let currentUser = await User.findById(req.session.userId);
		user = currentUser.username;
		cart = currentUser.cart.length;
	}
	res.render("product-category", {
		products: response.message,
		user,
		cart,
		csrfToken: req.csrfToken(),
	});
});

export default router;
