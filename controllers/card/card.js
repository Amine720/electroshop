import Card from "../../models/Card";
import Product from "../../models/Product";

export const cardNumberOfItems = async () => {
	try {
		const itemsCount = await Card.countDocuments().exec();
		return { message: itemsCount };
	} catch (err) {
		return { error: err.message };
	}
};

// Add product to card
export const addToCart = async (productId, cardId) => {
	try {
		let card = await Card.findById(cardId);
		let product = await Product.findById(productId);
		if (card && product.quantity > 1) {
			card.products.push(productId);
			card.totalQte += 1;
			card.totalPrice += product.price;
			product.quantity = -1;

			await card.save();
			await product.save();

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
