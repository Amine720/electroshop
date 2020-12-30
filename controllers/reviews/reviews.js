import Product from "../../models/Product.js";
import Review from "../../models/Review.js";

// Add review to a product
export const addReview = async (productId, reviewInfo) => {
	try {
		const { username, rating, feedback } = reviewInfo;
		const product = await Product.findById(productId);
		const review = new Review({
			product: productId,
			username,
			rating,
			feedback,
		});
		let addedReview = await review.save();
		product.reviews.push(addedReview._id);
		await product.save();
		return { message: "Review has been added" };
	} catch (err) {
		return { error: err.message };
	}
};
