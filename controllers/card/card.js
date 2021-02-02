import Card from "../../models/Card.js";
import Product from "../../models/Product.js";
import User from "../../models/User.js";

export const cardNumberOfItems = async () => {
	try {
		const itemsCount = await Card.countDocuments().exec();
		return { message: itemsCount };
	} catch (err) {
		return { error: err.message };
	}
};

// get cart's products
export const cartProducts = async (req, res) => {
	try {
		let user = await User.findById(req.session.userId);
		let producIds = user.cart.map((el) => el.productId);
		let products = await Product.find({ _id: { $in: producIds } });
		let totalPrice = 0;
		user.cart.forEach((el) => {
			let totalPriceForOnePoduct = el.price * el.quantity;
			totalPrice += totalPriceForOnePoduct;
		});
		return { products, totalPrice };
	} catch (error) {
		return { error };
	}
};

// Add product to card
export const addToCart = async (productId, quantity, userId) => {
	try {
		let user = await User.findById(userId);
		let product = await Product.findById(productId);

		if (product.quantity > quantity) {
			let item = await User.findOne({ "cart.productId": productId });
			if (item) {
				await User.findOneAndUpdate(
					{ "cart.productId": productId },
					{
						$inc: {
							"cart.$.quantity": quantity,
						},
					}
				);

				product.quantity -= quantity;
				await product.save();
			} else {
				user.cart.push({
					productId,
					quantity,
					price: product.price,
				});
				product.quantity -= quantity;
				await user.save();
				await product.save();
			}

			return { message: "Item added to the card successfully" };
		} else {
			return { failed: "Can't add item to the card" };
		}
	} catch (err) {
		return { error: err.message };
	}
};

// Remove an item from card
export const removeFromCard = async (productId, cardId) => {
	try {
		let card = await Card.findById(cardId);
		if (card.products.includes(productId)) {
			let newCard = card.products.filter(
				(product) => product != productId
			);
			card = newCard;
		}
		await card.save();
		return { message: "Item has been removed from the cards" };
	} catch (err) {
		return { error: err.message };
	}
};
