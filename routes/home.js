import { Router } from "express";
import { cartProducts } from "../controllers/card/card.js";
import { allCategories } from "../controllers/categories/categories.js";
const router = Router();

router.get("/", async (req, res) => {
	let categories = await allCategories();
	categories = categories.message;
	if (req.session.userId) {
		const cart = await cartProducts(req, res);
		res.render("home", {
			user: req.session.username,
			cart: cart.products.length,
			csrfToken: req.csrfToken(),
			categories: categories,
		});
	} else {
		res.render("home", {
			user: "guest",
			cart: 0,
			csrfToken: req.csrfToken(),
			categories: categories,
		});
	}
});

export default router;
