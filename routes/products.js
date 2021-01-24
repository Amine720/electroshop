import { Router } from "express";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import {
	addProduct,
	findProdcutById,
	getFeaturedProducts,
	getNewArrivalProducts,
} from "../controllers/products/products.js";
import stripe from "stripe";
import { addReview } from "../controllers/reviews/reviews.js";
import { addToCart } from "../controllers/card/card.js";
import Card from "../models/Card.js";
import User from "../models/User.js";
import Product from "../models/Product.js";

const mStripe = stripe(process.env.stripe_secret_key);

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "public/uploads/");
	},
	filename: (req, file, cb) => {
		const ext = file.originalname.split(".").reverse()[0];
		cb(null, uuidv4() + "." + ext);
	},
});
const upload = multer({ storage });
const router = Router();

router.post("/add", upload.array("photos", 10), async (req, res) => {
	let photos = req.files.map((file) => file.path);
	const response = await addProduct({ ...req.body, photos });
	if (response.error) {
		return res.send(response.error);
	}
	res.status(201).json({ message: response.message });
});

router.get("/featured", async (req, res) => {
	const response = await getFeaturedProducts();
	if (response.error) {
		return res.send(response.error);
	}
	res.status(200).json({ message: response.message });
});

router.get("/new", async (req, res) => {
	const response = await getNewArrivalProducts();
	if (response.error) {
		return res.send(response.error);
	}
	res.status(200).json({ message: response.message });
});

// add product review
router.post("/review/:id", async (req, res) => {
	if (!req.session.userId) {
		return res.render("login");
	}
	const response = await addReview(req.params.id, req.body);
	if (response.error) {
		return res.send(response.error);
	}
	res.status(200).json({ message: response.message });
});

// add product to cart
router.post("/product/:productId", async (req, res) => {
	const { productId } = req.params;
	const { quantity } = req.body;
	const userId = req.session.userId;

	const response = await addToCart(productId, +quantity, userId);
	if (response.failed) {
		return res.send(response.failed);
	}
	if (response.error) {
		return res.send(response.error);
	}
	res.status(200).json({ message: response.message });
	// res.redirect("/cart");
});

router.post("/checkout", (req, res) => {
	if (!req.session.id) {
		return res.redirect("/login");
	}

	const { amount, stripeEmail, stripeToken, description } = req.body;

	mStripe.customers
		.create({
			email: stripeEmail,
			source: stripeToken,
		})
		.then((customer) =>
			stripe.charges.create({
				amount,
				description: description,
				currency: "usd",
				customer: customer.id,
			})
		)
		.then((charge) => res.render("success"));
});

router.get("/:id", async (req, res) => {
	const response = await findProdcutById(req.params.id);
	if (response.error) {
		return res.send(response.error);
	} else {
		console.log(response.message);
		if (req.session.userId) {
			res.render("product-details", {
				product: response.message,
				user: req.session.username,
				cart: req.session.cart,
			});
		} else {
			res.render("product-details", {
				product: response.message,
				user: "guest",
				cart: [],
			});
		}
	}
});

router.get("/cart/:id", async (req, res) => {
	try {
		const user = await User.findById(req.params.id);
		const products = await Product.find({ _id: { $in: user.card } });
		res.json({ user, products });
	} catch (err) {
		return res.json({ err: err });
	}
});

export default router;
