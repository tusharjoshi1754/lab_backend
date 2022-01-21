const mongoose = require('mongoose');

const privacy_PolicySchema = new mongoose.Schema(
	{
		content: {
			type: String,
			trim: true,
			required: true,
		},
	},
	{ timestamps: true },
);

module.exports = mongoose.model('privacy_policy', privacy_PolicySchema);
