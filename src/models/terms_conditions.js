const mongoose = require('mongoose');

const terms_conditionsSchema = new mongoose.Schema(
	{
		content: {
			type: String,
			trim: true,
			required: true,
		},
	},
	{ timestamps: true },
);

module.exports = mongoose.model('terms_conditions', terms_conditionsSchema);
