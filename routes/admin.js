import { Router } from "express";
import {
	allCategories,
	findCategory,
} from "../controllers/categories/categories.js";
import {
	findProdcutById,
	getAllProducts,
	removeProduct,
	updateProduct,
} from "../controllers/products/products.js";

const router = Router();

router.get("/products", async (req, res) => {
	const response = await getAllProducts();
	res.render("admin-products", {
		products: response.message,
		csrfToken: req.csrfToken(),
	});
});

router.get("/categories", async (req, res) => {
	const response = await allCategories();
	res.render("admin-categories", {
		categories: response.message,
		csrfToken: req.csrfToken(),
	});
});

router.get("/products/add", (req, res) => {
	console.log(req.csrfToken());
	res.render("add-product", { product: false, csrfToken: req.csrfToken() });
});

router.get("/categories/add", (req, res) => {
	res.render("add-category", { category: false, csrfToken: req.csrfToken() });
});

router.get("/products/update/:id", async (req, res) => {
	const response = await findProdcutById(req.params.id);
	res.render("add-product", {
		product: response.message,
		csrfToken: req.csrfToken(),
	});
});

router.post("/products/update/:id", async (req, res) => {
	const { title, price, description, quantity, isNew, featured } = req.body;
	console.log("INSIDE UPDATE", req.body);
	const response = await updateProduct(
		req.params.id,
		title,
		description,
		price,
		isNew,
		featured,
		quantity
	);
	if (response.error) {
		return res.send(response.error);
	}
	req.flash("success", response.message);
	// res.render("admin-products");
	res.redirect("/admin/products/");
});

router.post("/products/remove/:id", async (req, res) => {
	const id = req.params.id;
	const response = await removeProduct(id);
	if (response.error) {
		return res.send(response.error);
	}
	req.flash("success", response.message);
	res.redirect("/admin/products/");
});

router.get("/categories/update/:name", async (req, res) => {
	const response = await findCategory(req.params.name);
	res.render("add-category", { category: response.message });
});

export default router;
