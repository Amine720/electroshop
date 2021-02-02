import express from "express";
import path from "path";
import helmet from "helmet";
import morgan from "morgan";
import connectDB from "./config/db.js";
import users from "./routes/users.js";
import products from "./routes/products.js";
import dotenv from "dotenv";
import addProducts from "./seeders/product-seeder.js";
import cors from "cors";
import session from "express-session";
import Product from "./models/Product.js";
import User from "./models/User.js";
import { cartProducts } from "./controllers/card/card.js";
dotenv.config();

const app = express();
app.use(cors());
app.use(
	session({
		secret: "mysecretkey",
		resave: false,
		saveUninitialized: true,
		cookie: {
			maxAge: 1000 * 60 * 60 * 5,
		},
	})
);
const __dirname = path.resolve();
app.use(
	helmet({
		contentSecurityPolicy: false,
	})
);
app.use(morgan("common"));
app.use(express.static(`${__dirname}/public`));
app.use("/public/uploads/", express.static(`${__dirname}/public/uploads/`));
app.use("/public/assets", express.static(`${__dirname}/public/assets/`));
app.use(
	"/api/products/public/uploads/",
	express.static(`${__dirname}/public/uploads/`)
);
app.use("/api/products/", express.static(`${__dirname}/public`));
app.use(express.urlencoded({ extended: false }));
app.use(express.json({ extended: false }));
app.set("view engine", "ejs");

// connect to db
connectDB();

app.get("/", async (req, res) => {
	if (req.session.userId) {
		const cart = await cartProducts(req, res);
		res.render("home", {
			user: req.session.username,
			cart: cart.products.length,
		});
	} else {
		res.render("home", { user: "guest", cart: 0 });
	}
});

// app.get("/seed", async (req, res) => {
// 	await addProducts();
// 	res.send("added-successfully");
// });

app.get("/login", (req, res) => {
	if (req.session.userId) {
		return res.redirect("/");
	}
	res.setHeader("Cache-Control", "no-cach, no-store, must-revalidate");
	res.render("login");
});

app.get("/register", (req, res) => {
	if (req.session.userId) {
		return res.send("already logged in");
	}
	res.render("register");
});

// app.get("/dashboard", (req, res) => {
// 	console.log(req.session);
// 	if (!req.session.userId) {
// 		return res.redirect("/login");
// 	}
// 	res.setHeader("Cache-Control", "no-cach, no-store, must-revalidate");
// 	res.send("dashboard");
// });

app.get("/add-product", (req, res) => {
	res.render("add-product");
});

app.get("/cart", async (req, res) => {
	if (req.session.userId) {
		const cart = await cartProducts(req, res);
		res.render("cart", {
			user: req.session.username,
			products: cart.products,
			total: cart.totalPrice,
			cart: cart.products.length,
		});
	} else {
		res.render("cart", {
			user: "guest",
			cart: [],
			total: 0,
			itemsNumber: 0,
		});
	}
});

app.use("/api/users", users);
app.use("/api/products", products);

const PORT = 5000 || process.env.PORT;
app.listen(PORT, () => {
	console.log(`Running on port ${PORT}`);
});
