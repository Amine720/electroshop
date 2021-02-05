import { Router } from "express";
import {
	allCategories,
	findCategory,
} from "../controllers/categories/categories.js";
import {
	findProdcutById,
	getAllProducts,
} from "../controllers/products/products.js";

const router = Router();

router.get("/products", async (req, res) => {
	const response = await getAllProducts();
	res.render("admin-products", { products: response.message });
});

router.get("/categories", async (req, res) => {
	const response = await allCategories();
	res.render("admin-categories", { categories: response.message });
});

router.get("/products/add", (req, res) => {
	res.render("add-product", { product: false });
});

router.get("/categories/add", (req, res) => {
	res.render("add-category", { category: false });
});

router.get("/products/update/:id", async (req, res) => {
	const response = await findProdcutById(req.params.id);
	res.render("add-product", { product: response.message });
});

router.get("/categories/update/:name", async (req, res) => {
	const response = await findCategory(req.params.name);
	console.log("CATEGORY =========>", response);
	res.render("add-category", { category: response.message });
});

export default router;
