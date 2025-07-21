const { Model, DataTypes } = require("sequelize");

const { sequelize } = require("../util/db");

class ReadingList extends Model {}

ReadingList.init(
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		userId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			field: "user_id",
			references: {
				model: "users",
				key: "id",
			},
			onDelete: "CASCADE",
		},
		blogId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			field: "blog_id",
			references: {
				model: "blogs",
				key: "id",
			},
			onDelete: "CASCADE",
		},
		read: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false,
		},
		createdAt: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: DataTypes.NOW,
			field: "created_at",
		},
		updatedAt: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: DataTypes.NOW,
			field: "updated_at",
		},
	},
	{
		sequelize,
		underscored: true,
		modelName: "readingList",
		tableName: "reading_lists",
		timestamps: false,
	}
);

module.exports = ReadingList;
