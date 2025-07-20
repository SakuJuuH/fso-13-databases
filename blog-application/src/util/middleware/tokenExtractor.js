const jwt = require("jsonwebtoken");
const { SECRET } = require("../config");

const tokenExtractor = (req, res, next) => {
	const authorization = req.get("authorization");
	console.log("Authorization header:", authorization);
	if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
		try {
			req.decodedToken = jwt.verify(authorization.substring(7), SECRET);
			console.log("Decoded token:", req.decodedToken);
		} catch {
			return res.status(401).json({ error: "token invalid" });
		}
	} else {
		return res.status(401).json({ error: "token missing" });
	}
	next();
};

module.exports = tokenExtractor;
