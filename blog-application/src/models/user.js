const { Model, DataTypes } = require("sequelize");

const { sequelize } = require("../util/db");

class User extends Model {}

User.init(
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
			unique: true,
		},
		username: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
			validate: {
				isEmail: {
					msg: "Username must be a valid email address",
				},
			},
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		hashedPassword: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		salt: {
			type: DataTypes.STRING,
			allowNull: false,
		},
	},

	{
		sequelize,
		timestamps: true,
		modelName: "user",
	}
);

module.exports = User;
