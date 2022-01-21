const mongoose = require('mongoose');

const Call_backSchema = new mongoose.Schema(
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

module.exports = mongoose.model('Call_back', Call_backSchema);
