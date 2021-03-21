export default (req, res, next) => {
	if (req.session.isAdmin) {
		return res.redirect("/admin/products");
	}
	next();
};
