const Blog = require("./blog");
const User = require("./user");
const ReadingList = require("./readingList");
const Session = require("./session");

User.hasMany(Blog);
Blog.belongsTo(User);

User.belongsToMany(Blog, {
	through: ReadingList,
	as: "readings",
	foreignKey: "userId",
	otherKey: "blogId",
});

Blog.belongsToMany(User, {
	through: ReadingList,
	as: "readers",
	foreignKey: "blogId",
	otherKey: "userId",
});

User.hasMany(ReadingList, { foreignKey: "userId" });
Blog.hasMany(ReadingList, { foreignKey: "blogId" });

ReadingList.belongsTo(User, { foreignKey: "userId" });
ReadingList.belongsTo(Blog, { foreignKey: "blogId" });

User.hasMany(Session, { foreignKey: "userId" });
Session.belongsTo(User, { foreignKey: "userId" });

module.exports = {
	Blog,
	User,
	ReadingList,
	Session,
};
