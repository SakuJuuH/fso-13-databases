const loginRouter = require("express").Router();
const bcrypt = require("bcrypt");
const { User } = require("../models");
const jwt = require("jsonwebtoken");
const { SECRET } = require("../util/config");

loginRouter.post("/", async (req, res) => {
	const { username, password } = req.body;

	if (!username || !password) {
		return res
			.status(400)
			.json({ error: "Username and password are required" });
	}

	const user = await User.findOne({ where: { username } });
	if (!user) {
		return res.status(401).json({ error: "Invalid username or password" });
	}

	const passwordMatch = await bcrypt.compare(password, user.hashedPassword);

	if (!passwordMatch) {
		return res.status(401).json({ error: "Invalid username or password" });
	}

	const userForToken = {
		username: user.username,
		id: user.id,
	};

	const token = jwt.sign(userForToken, SECRET, { expiresIn: "1h" });

	res.status(200).json({ token });
});

module.exports = loginRouter;
