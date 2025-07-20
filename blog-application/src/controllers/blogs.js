const router = require("express").Router();
const { Op } = require("sequelize");

const blogFinder = require("../util/middleware/blogFinder");
const tokenExtractor = require("../util/middleware/tokenExtractor");
const { Blog, User } = require("../models");

router.get("/", async (req, res) => {
	const where = {};
	if (req.query.search) {
		where[Op.or] = [
			{ title: { [Op.iLike]: `%${req.query.search}%` } },
			{ author: { [Op.iLike]: `%${req.query.search}%` } },
		];
	}

	const blogs = await Blog.findAll({
		include: [
			{
				model: User,
				as: "user",
				attributes: { exclude: ["hashedPassword", "salt"] },
			},
		],
		attributes: { exclude: ["userId"] },
		where,
		order: [["likes", "DESC"]],
	});
	res.json(blogs);
});

router.post("/", tokenExtractor, async (req, res) => {
	if (!req.decodedToken || !req.decodedToken.id) {
		return res.status(401).json({ error: "token missing or invalid" });
	}

	const userId = req.decodedToken.id;

	if (!userId) {
		return res.status(401).json({ error: "User ID not found in token" });
	}

	const { author, title, url, likes = 0 } = req.body;
	const newBlog = await Blog.create({ author, title, url, likes, userId });
	res.status(201).json(newBlog);
});

router.delete("/:id", blogFinder, tokenExtractor, async (req, res) => {
	if (req.blog) {
		if (req.decodedToken.id !== req.blog.userId) {
			return res.status(403).json({ error: "Unauthorized action" });
		}
		await req.blog.destroy();
	}
	res.status(204).end();
});

router.put("/:id", blogFinder, async (req, res) => {
	if (req.blog) {
		const { author, title, url, likes } = req.body;
		req.blog.author = author || req.blog.author;
		req.blog.title = title || req.blog.title;
		req.blog.url = url || req.blog.url;
		req.blog.likes = likes || req.blog.likes;

		await req.blog.save();
		res.json(req.blog);
	} else {
		res.status(404).send("Blog not found");
	}
});

module.exports = router;
