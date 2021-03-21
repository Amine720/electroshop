import { Router } from "express";
import { cartProducts } from "../controllers/card/card.js";

const router = Router();

router.get("/", async (req, res) => {
	if (req.session.userId) {
		const cart = await cartProducts(req, res);
		res.render("cart", {
			user: req.session.username,
			products: cart.products,
			total: cart.totalPrice,
			cart: cart.products.length,
			csrfToken: req.csrfToken(),
		});
	} else {
		res.render("cart", {
			user: "guest",
			cart: [],
			total: 0,
			itemsNumber: 0,
			csrfToken: req.csrfToken(),
		});
	}
});

export default router;
