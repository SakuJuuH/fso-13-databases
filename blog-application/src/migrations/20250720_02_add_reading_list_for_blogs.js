const { DataTypes } = require("sequelize");

module.exports = {
	up: async ({ context: queryInterface }) => {
		await queryInterface.createTable("reading_lists", {
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
			},
			user_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: "users",
					key: "id",
				},
				onDelete: "CASCADE",
			},
			blog_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
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
			created_at: {
				type: DataTypes.DATE,
				allowNull: false,
				defaultValue: DataTypes.NOW,
			},
			updated_at: {
				type: DataTypes.DATE,
				allowNull: false,
				defaultValue: DataTypes.NOW,
			},
		});
		await queryInterface.addConstraint("reading_lists", {
			fields: ["user_id", "blog_id"],
			type: "unique",
			name: "unique_user_blog_reading_list",
		});
	},
	down: async ({ context: queryInterface }) => {
		await queryInterface.removeConstraint(
			"reading_lists",
			"unique_user_blog_reading_list"
		);
		await queryInterface.dropTable("reading_lists");
	},
};
