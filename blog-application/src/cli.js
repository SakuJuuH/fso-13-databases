require("@dotenvx/dotenvx").config();
const { Sequelize, QueryTypes } = require("sequelize");

const sequelize = new Sequelize(process.env.DATABASE_URL);

const main = async () => {
	try {
		await sequelize.authenticate();
		const blogs = await sequelize.query("SELECT * FROM blogs", {
			type: QueryTypes.SELECT,
		});
		blogs.forEach((blog) => {
			console.log(
				`Author: ${blog.author}, Title: ${blog.title}, Likes: ${blog.likes}`
			);
		});
	} catch (error) {
		console.error("Unable to connect to the database:", error);
	} finally {
		await sequelize.close();
	}
};

main().catch((error) => {
	console.error("An error occurred:", error);
});
