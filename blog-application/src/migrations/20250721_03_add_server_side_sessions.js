const { DataTypes, Op } = require("sequelize");

module.exports = {
	up: async ({ context: queryInterface }) => {
		await queryInterface.addColumn("users", "disabled", {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false,
		});
		await queryInterface.addConstraint("users", {
			fields: ["disabled"],
			type: "check",
			name: "users_disabled_check",
			where: {
				disabled: {
					[Op.in]: [true, false],
				},
			},
		});
		await queryInterface.createTable("server_side_sessions", {
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
			sessionToken: {
				type: DataTypes.STRING,
				allowNull: false,
				field: "session_token",
				unique: true,
			},
			expiresAt: {
				type: DataTypes.DATE,
				allowNull: false,
				field: "expires_at",
			},
			createdAt: {
				type: DataTypes.DATE,
				allowNull: false,
				field: "created_at",
				defaultValue: DataTypes.NOW,
			},
			updatedAt: {
				type: DataTypes.DATE,
				allowNull: false,
				field: "updated_at",
				defaultValue: DataTypes.NOW,
			},
		});
	},
	down: async ({ context: queryInterface }) => {
		await queryInterface.dropTable("server_side_sessions");
		await queryInterface.removeConstraint("users", "users_disabled_check");
		await queryInterface.removeColumn("users", "disabled");
	},
};
