const isAdmin = () => {
	return (req, res, next) => {
		if (req.session.isAdmin) {
			next();
		} else {
			return res.status(401).json({ message: "Not Authorized" });
		}
	};
};

export default isAdmin;
