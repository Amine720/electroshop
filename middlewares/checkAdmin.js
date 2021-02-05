const isAdmin = () => {
	return (req, res, next) => {
		console.log("ROUTE URL FROM MIDDLEWARE ========>", req.url);
		next();
	};
};

export default isAdmin;
