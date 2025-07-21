const { Model, DataTypes } = require("sequelize");

const { sequelize } = require("../util/db");

class Session extends Model {}

Session.init(
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
		modelName: "session",
		tableName: "server_side_sessions",
		timestamps: false,
	}
);

module.exports = Session;
