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

app.get("/", (req, res) => {
	if (req.session.userId) {
		res.render("home", {
			user: req.session.username,
			cart: req.session.cart,
		});
	} else {
		res.render("home", { user: "guest", cart: [] });
	}
});

// app.get("/seed", async (req, res) => {
// 	await addProducts();
// 	res.send("added-successfully");
// });

app.get("/login", (req, res) => {
	console.log(req.session);
	if (req.session.userId) {
		return res.redirect("/");
	}
	res.setHeader("Cache-Control", "no-cach, no-store, must-revalidate");
	res.render("login");
});

app.get("/register", (req, res) => {
	console.log(req.session);
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

app.get("/cart", (req, res) => {
	if (req.session.userId) {
		res.render("cart", {
			user: req.session.username,
			cart: req.session.cart,
		});
	} else {
		res.render("cart", { user: "guest", cart: [] });
	}
});

app.use("/api/users", users);
app.use("/api/products", products);

const PORT = 5000 || process.env.PORT;
app.listen(PORT, () => {
	console.log(`Running on port ${PORT}`);
});
