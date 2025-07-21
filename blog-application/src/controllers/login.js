const loginRouter = require("express").Router();
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { User, Session } = require("../models");

loginRouter.post("/", async (req, res) => {
	const { username, password } = req.body;

	if (!username || !password) {
		return res
			.status(400)
			.json({ error: "Username and password are required" });
	}

	const user = await User.findOne({ where: { username } });
	console.log("User found:", user);
	if (!user) {
		return res.status(401).json({ error: "Invalid username or password" });
	}

	if (user.disabled) {
		return res.status(403).json({ error: "User is disabled" });
	}

	const passwordMatch = await bcrypt.compare(password, user.hashedPassword);
	if (!passwordMatch) {
		return res.status(401).json({ error: "Invalid username or password" });
	}

	const sessionToken = crypto.randomBytes(64).toString("hex");
	const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

	await Session.destroy({
		where: {
			userId: user.id,
		},
	});

	await Session.create({
		sessionToken,
		userId: user.id,
		expiresAt,
	});

	res.status(200).json({ sessionToken, expiresAt });
});

module.exports = loginRouter;
