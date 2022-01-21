const mongoose = require('mongoose');

const footerSchema = new mongoose.Schema(
	{
		content: {
			type: String,
			trim: true,
			required: true,
			max: 3000,
		},
	},
	{ timestamps: true },
);

module.exports = mongoose.model('footer', footerSchema);
