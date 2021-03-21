import express from "express";
import path from "path";
import helmet from "helmet";
import morgan from "morgan";
import connectDB from "./config/db.js";
import users from "./routes/users.js";
import products from "./routes/products.js";
import categories from "./routes/categories.js";
import admin from "./routes/admin.js";
import adminLogin from "./routes/adminLogin.js";
import cart from "./routes/cart.js";
import home from "./routes/home.js";
import dotenv from "dotenv";
import cors from "cors";
import session from "express-session";

import csrf from "csurf";
import flash from "express-flash";
import isAdmin from "./middlewares/checkAdmin.js";
import checkUserId from "./middlewares/checkUserId.js";
import loginRegisterRoute from "./utils/loginRegister.js";
import adminAuthStatus from "./middlewares/adminAuthStatus.js";
dotenv.config();

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json({ extended: false }));
app.use(cors());
app.use(flash());
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

app.use(csrf());
app.use(function (err, req, res, next) {
	if (err.code !== "EBADCSRFTOKEN") return next(err);
	console.log(err);
	res.status(403);
	req.flash("error", "Unauthorized");
	res.redirect("/login");
});

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
	"/admin/products/update/public/uploads/",
	express.static(`${__dirname}/public/uploads/`)
);
app.use(
	"/admin/public/uploads/",
	express.static(`${__dirname}/public/uploads/`)
);
app.use(
	"/admin/products/assets/",
	express.static(`${__dirname}/public/assets/`)
);
app.use(
	"/admin/products/update/assets",
	express.static(`${__dirname}/public/uploads/`)
);
app.use(
	"/admin/public/uploads/",
	express.static(`${__dirname}/public/assets/`)
);
app.use(
	"/admin/categories/assets",
	express.static(`${__dirname}/public/assets/`)
);
app.use("/admin/assets/", express.static(`${__dirname}/public/assets/`));
app.use(
	"/admin/products/public/uploads/",
	express.static(`${__dirname}/public/uploads/`)
);
app.use(
	"/api/products/public/uploads/",
	express.static(`${__dirname}/public/uploads/`)
);
app.use(
	"/api/categories/public/uploads/",
	express.static(`${__dirname}/public/uploads/`)
);

app.use("/api/products/", express.static(`${__dirname}/public`));
app.use("/api/categories/", express.static(`${__dirname}/public`));
app.set("view engine", "ejs");

// connect to db
connectDB();

app.use("/", home);

// app.get("/seed", async (req, res) => {
// 	await addProducts();
// 	res.send("added-successfully");
// });

app.get("/login", checkUserId, adminAuthStatus, loginRegisterRoute);
app.get("/register", checkUserId, adminAuthStatus, loginRegisterRoute);

app.post("/logout", (req, res) => {
	req.session.destroy((err) => {
		if (err) {
			return res.json("Error occured");
		}
	});
	res.setHeader("Cache-Control", "no-cach, no-store, must-revalidate");
	res.redirect("/");
});

app.get("/add-product", (req, res) => {
	res.render("add-product", { product: false, csrfToken: req.csrfToken() });
});
app.use("/cart", cart);
app.use("/admin/login", checkUserId, adminAuthStatus, adminLogin);
app.use("/api/users", users);
app.use("/api/products", products);
app.use("/api/categories", categories);
app.use("/admin", isAdmin, admin);
app.get("*", (req, res) => {
	res.send("404, NOT FOUND");
});

const PORT = 5000 || process.env.PORT;
app.listen(PORT, () => {
	console.log(`Running on port ${PORT}`);
});
