const router = require("express").Router();

const { ReadingList, User, Blog } = require("../models");
const { sessionExtractor } = require("../util/middleware");

router.post("/", async (req, res) => {
	const { blogId, userId } = req.body;

	if (!blogId || !userId) {
		return res
			.status(400)
			.json({ error: "Blog ID and User ID are required" });
	}

	const blog = await Blog.findByPk(blogId);
	if (!blog) {
		return res.status(404).json({ error: "Blog not found" });
	}

	const user = await User.findByPk(userId);
	if (!user) {
		return res.status(404).json({ error: "User not found" });
	}

	const existingEntry = await ReadingList.findOne({
		where: {
			blogId,
			userId,
		},
	});

	if (existingEntry) {
		return res
			.status(409)
			.json({ error: "Reading list entry already exists" });
	}

	const readingList = await ReadingList.create({
		blogId,
		userId,
	});
	res.status(201).json(readingList);
});

router.put("/:id", sessionExtractor, async (req, res) => {
	const { id } = req.params;
	const { read } = req.body;

	if (!req.session || !req.session.userId) {
		return res.status(401).json({ error: "session missing or invalid" });
	}

	if (read === undefined) {
		return res.status(400).json({ error: "Read status is required" });
	}

	if (typeof read !== "boolean") {
		return res.status(400).json({ error: "Read status must be a boolean" });
	}

	const readingListEntry = await ReadingList.findByPk(id);

	if (!readingListEntry) {
		return res.status(404).json({ error: "Reading list entry not found" });
	}

	if (readingListEntry.userId !== req.session.userId) {
		return res.status(403).json({ error: "Unauthorized action" });
	}

	if (readingListEntry.read === read) {
		return res.status(304).json(readingListEntry);
	}

	readingListEntry.read = read;
	await readingListEntry.save();

	res.json(readingListEntry);
});

module.exports = router;
