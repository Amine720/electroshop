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
import { addToCart, removeFromCard } from "../controllers/card/card.js";
import User from "../models/User.js";

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
	req.flash("success", response.message);
	res.redirect("/admin/products/");
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
	// res.status(200).json({ message: response.message });
	res.redirect("/cart");
});

router.post("/checkout", async (req, res) => {
	if (!req.session.userId) {
		return res.redirect("/login");
	}

	const user = await User.findById(req.session.userId);
	let price = 0;
	user.cart.forEach((el) => {
		let pricePerItem = el.quantity * el.price;
		price += pricePerItem;
	});

	const { stripeEmail, stripeToken } = req.body;

	mStripe.customers
		.create({
			email: stripeEmail,
			source: stripeToken,
		})
		.then((customer) =>
			mStripe.charges.create({
				amount: Math.ceil(price * 100),
				description: "Buy items from electroshop",
				currency: "usd",
				customer: customer.id,
			})
		)
		.then((charge) => {
			user.cart = [];
			return user.save();
		})
		.then(() => res.send("success"));
});

router.get("/:id", async (req, res) => {
	const response = await findProdcutById(req.params.id);
	if (response.error) {
		return res.send(response.error);
	} else {
		if (req.session.userId) {
			const user = await User.findById(req.session.userId);
			res.render("product-details", {
				product: response.message,
				user: req.session.username,
				cart: user.cart.length,
				csrfToken: req.csrfToken(),
			});
		} else {
			res.render("product-details", {
				product: response.message,
				user: "guest",
				cart: [],
				csrfToken: req.csrfToken(),
			});
		}
	}
});

router.post("/remove/:productId", async (req, res) => {
	const response = await removeFromCard(
		req.params.productId,
		req.session.userId
	);
	if (response.error) {
		return res.send(response.error);
	} else {
		return res.redirect("/cart");
	}
});

// router.get("/cart/:id", async (req, res) => {
// 	try {
// 		const user = await User.findById(req.params.id);
// 		const products = await Product.find({ _id: { $in: user.card } });
// 		res.json({ user, products });
// 	} catch (err) {
// 		return res.json({ err: err });
// 	}
// });

export default router;
