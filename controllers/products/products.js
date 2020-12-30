import Category from "../../models/Category.js";
import Product from "../../models/Product.js";

export const addProduct = async (data) => {
	try {
		const product = new Product({
			...data,
		});
		await product.save();
		return { message: "Product has been added succussfully" };
	} catch (err) {
		console.log(err.message);
		return { error: "Error while adding the product" };
	}
};

export const findProdcutById = async (productId) => {
	try {
		const product = await Product.findById(productId);
		return { message: product };
	} catch (err) {
		return { error: err.message };
	}
};

export const removeProduct = async (productId) => {
	try {
		await Product.findByIdAndDelete(productId);
		return { message: "Product has been removed" };
	} catch (err) {
		return { error: err.message };
	}
};

export const featuredProduct = async (productId) => {
	try {
		await Product.findByIdAndUpdate(
			productId,
			{ featured: true },
			{ new: true }
		);
		return { message: "Product has been featured" };
	} catch (err) {
		return { error: err.message };
	}
};

export const searchProductByPriceRange = async (min, max) => {
	try {
		const products = await Product.find({ price: { $in: [min, max] } });
		return { message: products };
	} catch (err) {
		return { error: err.message };
	}
};

export const searchProductByCategory = async (categoryName) => {
	try {
		const products = await Product.find({ category: categoryName });
		return { message: products };
	} catch (err) {
		return { error: err.message };
	}
};

export const getFeaturedProducts = async () => {
	try {
		const products = await Product.find({ featured: true }).populate(
			"reviews"
		);
		return { message: products };
	} catch (err) {
		return { error: err.message };
	}
};

export const getNewArrivalProducts = async () => {
	try {
		const products = await Product.find({ new: true });
		return { message: products };
	} catch (err) {
		return { error: err.message };
	}
};
