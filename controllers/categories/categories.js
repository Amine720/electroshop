import Category from "../../models/Category.js";

export const findCategory = async (id) => {
	try {
		const response = await Category.findById(id);
		return { message: response };
	} catch (err) {
		return { error: err.message };
	}
};

export const addCategory = async (categoryName) => {
	try {
		await Category.insert({ name: categoryName });
		return { message: "Category added successfully" };
	} catch (err) {
		return { error: err.message };
	}
};

export const allCategories = async () => {
	try {
		let categories = await Category.find();
		return { message: categories };
	} catch (err) {
		return { error: err.message };
	}
};

export const updateCategory = async (id, name) => {
	try {
		await Category.findByIdAndUpdate(id, { name }, { new: true });
		return { message: "Category updated successfully" };
	} catch (err) {
		return { error: err.message };
	}
};

export const deleteCategory = async (id) => {
	try {
		await Category.findByIdAndDelete(id);
		return { message: "Category deleted successfully" };
	} catch (err) {
		return { error: err.message };
	}
};
