const blogFinder = async (req, res, next) => {
	const { Blog } = require("../../models");
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

module.exports = blogFinder;
