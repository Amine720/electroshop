const loginRegisterRoute = async (req, res) => {
	res.setHeader("Cache-Control", "no-cach, no-store, must-revalidate");
	const url = req.url.substring(1);
	res.render(url, {
		user: "guest",
		cart: 0,
		csrfToken: req.csrfToken(),
	});
};

export default loginRegisterRoute;
