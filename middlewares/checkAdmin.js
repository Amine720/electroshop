export default (req, res, next) => {
	if (req.session.isAdmin) {
		next();
	} else {
		return res.render("403");
	}
};
