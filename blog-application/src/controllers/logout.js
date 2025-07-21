const router = require("express").Router();

const { sessionExtractor } = require("../util/middleware");
const { Session } = require("../models");
router.delete("/", sessionExtractor, async (req, res) => {
	if (!req.session || !req.session.userId) {
		return res.status(401).json({ error: "Session missing or invalid" });
	}

	const sessionToken = req.session.sessionToken;

	if (!sessionToken) {
		return res.status(400).json({ error: "Session token is required" });
	}

	await Session.destroy({
		where: { sessionToken },
	});

	res.status(204).send();
});

module.exports = router;
