import Product from "../../models/Product.js";

export const addProduct = async (data) => {
	try {
		const product = new Product({
			...data,
		});
		await product.save();
		return { message: "Product has been added succussfully" };
	} catch (err) {
		return { error: "Error while adding the product" };
	}
};
