const { DataTypes, Op } = require("sequelize");

module.exports = {
	up: async ({ context: queryInterface }) => {
		await queryInterface.addColumn("blogs", "year", {
			type: DataTypes.INTEGER,
			validate: {
				isInt: {
					msg: "Year must be an integer",
				},
				min: {
					args: [1991],
					msg: "Year must be at least 1991",
				},
				max: {
					args: [new Date().getFullYear()],
					msg: "Year cannot be greater than the current year",
				},
			},
		});

		await queryInterface.addConstraint("blogs", {
			fields: ["year"],
			type: "check",
			name: "blogs_year_check",
			where: {
				year: {
					[Op.gte]: 1991,
					[Op.lte]: new Date().getFullYear(),
				},
			},
		});
	},
	down: async ({ context: queryInterface }) => {
		await queryInterface.removeConstraint("blogs", "blogs_year_check");
		await queryInterface.removeColumn("blogs", "year");
	},
};
