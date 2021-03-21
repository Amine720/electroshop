import { Router } from "express";
import { searchProductByCategory } from "../controllers/products/products.js";
import User from "../models/User.js";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import { addCategory } from "../controllers/categories/categories.js";
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

router.post("/add", upload.array("photo", 1), async (req, res) => {
	const filePath = req.files[0].path;
	const { name } = req.body;
	console.log(filePath, name);
	const response = await addCategory(name, filePath);
	if (response.message) {
		req.flash("success", response.message);
		res.redirect("/admin/categories");
	} else {
		return res.json({ error: response.error });
	}
});

export default router;
