const router = require("express").Router();
const { Op } = require("sequelize");

const { blogFinder, sessionExtractor } = require("../util/middleware");
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
		attributes: { exclude: ["userId"] },
		include: [
			{
				model: User,
				as: "user",
				attributes: {
					exclude: [
						"hashedPassword",
						"salt",
						"disabled",
						"createdAt",
						"updatedAt",
					],
				},
			},
		],
		where,
		order: [["likes", "DESC"]],
	});
	res.json(blogs);
});

router.post("/", sessionExtractor, async (req, res) => {
	if (!req.session || !req.session.userId) {
		return res.status(401).json({ error: "session missing or invalid" });
	}

	const userId = req.session.userId;

	if (!userId) {
		return res.status(401).json({ error: "User ID not found in session" });
	}

	const { author, title, url, likes = 0, year } = req.body;
	const newBlog = await Blog.create({
		author,
		title,
		url,
		likes,
		year,
		userId,
	});
	res.status(201).json(newBlog);
});

router.delete("/:id", blogFinder, sessionExtractor, async (req, res) => {
	if (req.blog) {
		if (req.session.userId !== req.blog.userId) {
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
