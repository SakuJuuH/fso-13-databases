const usersRouter = require("express").Router();
const bcrypt = require("bcrypt");
const { User, Blog } = require("../models");

usersRouter.post("/", async (req, res) => {
	const { username, name, password } = req.body;

	const existingUser = await User.findOne({ where: { username } });
	if (existingUser) {
		return res.status(400).json({ error: "Username already exists" });
	}

	if (!username || !password) {
		return res
			.status(400)
			.json({ error: "Username and password are required" });
	}

	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(password, salt);

	if (!salt) {
		return res.status(500).json({ error: "Error generating salt" });
	}

	if (!hashedPassword) {
		return res.status(500).json({ error: "Error hashing password" });
	}
	const newUser = await User.create({
		username,
		name,
		hashedPassword,
		salt,
	});

	res.status(201).json(newUser);
});

usersRouter.get("/", async (req, res) => {
	const users = await User.findAll({
		include: [
			{
				model: Blog,
				as: "blogs",
				attributes: { exclude: ["userId"] },
			},
		],
		attributes: { exclude: ["hashedPassword", "salt"] },
	});
	res.json(users);
});

usersRouter.get("/:id", async (req, res) => {
	const where = {};
	if (req.query.read) {
		where.read = req.query.read === "true";
	}

	const user = await User.findByPk(req.params.id, {
		attributes: { exclude: ["hashedPassword", "salt"] },
		include: [
			{
				model: Blog,
				as: "readings",
				attributes: { exclude: ["userId", "createdAt", "updatedAt"] },
				through: {
					attributes: ["read", "id"],
					as: "readingList",
					where,
				},
			},
		],
	});

	if (!user) {
		return res.status(404).json({ error: "User not found" });
	}

	res.json(user);
});

usersRouter.put("/:username", async (req, res) => {
	const { username } = req.body;

	if (!username) {
		return res.status(400).json({ error: "Username is required" });
	}

	const user = await User.findOne({
		where: { username: req.params.username },
	});

	if (!user) {
		return res.status(404).json({ error: "User not found" });
	}

	user.username = username;

	await user.save();
	res.json(user);
});

module.exports = usersRouter;
