const mongoose = require('mongoose');
const Website_FaqsSchema = new mongoose.Schema(
	{
		question: {
			type: String,
			trim: true,
			required: true,
		},
		answer: {
			type: String,
			trim: true,
			required: true,
		},
	},
	{ timestamps: true },
);

module.exports = mongoose.model('Website_Faqs', Website_FaqsSchema);
