import { Router } from "express";
import {
	allCategories,
	deleteCategory,
	findCategory,
	updateCategory,
} from "../controllers/categories/categories.js";
import {
	findProdcutById,
	getAllProducts,
	removeProduct,
	updateProduct,
} from "../controllers/products/products.js";
import Category from "../models/Category.js";

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

router.get("/products/add", async (req, res) => {
	const categories = await Category.find({}).select("name");
	res.render("add-product", {
		product: false,
		csrfToken: req.csrfToken(),
		categories,
	});
});

router.get("/categories/add", (req, res) => {
	res.render("add-category", { category: false, csrfToken: req.csrfToken() });
});

router.get("/products/update/:id", async (req, res) => {
	const response = await findProdcutById(req.params.id);
	const categories = await allCategories();
	res.render("add-product", {
		product: response.message,
		categories: categories.message,
		csrfToken: req.csrfToken(),
	});
});

router.post("/products/update/:id", async (req, res) => {
	const { title, price, description, quantity, isNew, featured } = req.body;
	const id = req.params.id;
	const response = await updateProduct(
		id,
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
	res.render("add-category", {
		category: response.message,
		csrfToken: req.csrfToken(),
	});
});

router.post("/categories/update/:id", async (req, res) => {
	const { name } = req.body;
	const id = req.params.id;
	const response = updateCategory(id, name);
	if (response.error) {
		return res.send(response.error);
	}
	req.flash("success", response.message);
	res.redirect("/admin/categories/");
});

router.post("/categories/remove/:id", async (req, res) => {
	const id = req.params.id;
	const response = await deleteCategory(id);
	if (response.error) {
		return res.send(response.error);
	}
	req.flash("success", response.message);
	res.redirect("/admin/categories/");
});

export default router;
