import Product from "../models/Product.js";

const addProducts = async () => {
	return Promise.all([
		await Product.create({
			title: "Beats by Dr.Dre",
			description:
				"Beats Solo3 Wireless On-Ear Headphones with Apple W1 Headphone Chip - Rose Gold",
			price: 1245.18,
			quantity: 14,
			photos: "head1.jpg",
			category: "Headphones",
		}),
		await Product.create({
			title: "Beats by Dr.Dre",
			description:
				"Powerbeats Pro Totally Wireless Earphones with Apple H1 Headphone Chip - Black",
			price: 1432.85,
			quantity: 10,
			photos: "head2.jpg",
			category: "Headphones",
		}),
		await Product.create({
			title: "Samsung",
			description:
				"Straight Talk SAMSUNG A51, 128 GB Prism Crush Black - Prepaid Smartphone",
			price: 1782.67,
			quantity: 13,
			photos: "samsung2.jpg",
			category: "Smartphones",
		}),
		await Product.create({
			title: "Novation",
			description:
				"Smart Watch for Android Phones, Smartwatch with Heart Rate and Blood Pressure Monitor for Women, Fitness Watch, Sport Smartwatch Touch Screen with Message Reminder Heart Rate Monitor Sleep",
			price: 252.17,
			quantity: 5,
			photos: "watch1.jpg",
			category: "Smart & Watches",
		}),

		await Product.create({
			title: "General",
			description:
				"Smart Wrist Watch A1 Bluetooth Waterproof GSM Phone for iphone Android Samsung - Black",
			price: 214.91,
			quantity: 5,
			photos: "watch2.jpg",
			category: "Smart & Watches",
		}),
	]);
};

export default addProducts;
