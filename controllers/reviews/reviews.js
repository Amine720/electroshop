import Product from "../../models/Product.js";
import Review from "../../models/Card.js";

// Add review to a product
export const addReview = async (productId, reviewInfo) => {
	try {
		const { username, rating, feedback } = reviewInfo;
		const product = await Product.findById(productId);
		const review = new Review({
			username,
			rating,
			feedback,
		});
		review = await review.save();
		product.reviews.push(review._id);
		await product.save();
	} catch (err) {
		return { error: err.message };
	}
};
