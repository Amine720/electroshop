import { Router } from "express";
import Admin from "../models/Admin.js";
const router = Router();

router.get("/", (req, res) => {
	res.render("admin-login", {
		user: "guest",
		cart: 0,
		csrfToken: req.csrfToken(),
	});
});

router.post("/", async (req, res) => {
	const { email, password } = req.body;
	try {
		const admin = await Admin.findOne({ email, password });
		if (admin) {
			req.session.isAdmin = true;
			console.log("REQ.SESSION AFTER LOG IN", req.session);
			res.redirect("/admin/products");
		} else {
			res.redirect("/admin/login");
		}
	} catch (err) {
		res.json({ error: err });
	}
});

export default router;
