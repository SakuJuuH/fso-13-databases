const { Blog, Session, User } = require("../models");

const errorHandler = (error, request, response, next) => {
	console.error(error.message);

	if (error.name === "CastError") {
		return response.status(400).send({ error: "malformatted id" });
	}

	if (error.name === "ValidationError") {
		return response.status(400).json({ error: error.message });
	}

	if (error.name === "SequelizeValidationError") {
		return response.status(400).json({ error: error.message });
	}

	if (error.name === "SequelizeDatabaseError") {
		return response.status(400).json({ error: error.message });
	}

	next(error);
};

const blogFinder = async (req, res, next) => {
	const blogId = req.params.id;

	try {
		const blog = await Blog.findByPk(blogId);
		if (!blog) {
			return res.status(404).json({ error: "Blog not found" });
		}
		req.blog = blog;
		next();
	} catch (error) {
		console.error("Error finding blog:", error);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

const sessionExtractor = async (req, res, next) => {
	const sessionToken =
		req.get("Session-Token") ||
		(req.get("Authorization") &&
		req.get("Authorization").toLowerCase().startsWith("bearer ")
			? req.get("Authorization").substring(7)
			: null);

	if (!sessionToken) {
		return res.status(401).json({ error: "session token missing" });
	}

	try {
		const session = await Session.findOne({
			where: { sessionToken },
			include: [
				{
					model: User,
					as: "user",
					attributes: {
						exclude: [
							"hashedPassword",
							"salt",
							"createdAt",
							"updatedAt",
						],
					},
				},
			],
			attributes: {
				exclude: ["createdAt", "updatedAt"],
			},
		});

		if (!session) {
			return res
				.status(401)
				.json({ error: "invalid or expired session" });
		}

		if (session.user.disabled) {
			await session.destroy();
			return res.status(401).json({ error: "account disabled" });
		}

		req.session = session;
		req.user = session.User;
		next();
	} catch (error) {
		return res.status(401).json({ error: error.message });
	}
};

module.exports = {
	blogFinder,
	errorHandler,
	sessionExtractor,
};
