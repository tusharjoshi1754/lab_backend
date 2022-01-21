const mongoose = require('mongoose');

const Website_AboutSchema = new mongoose.Schema(
	{
		address: {
			type: String,
			trim: true,
			required: true,
			max: 2000,
		},
		contact: {
			type: String,
			trim: true,
			required: true,
			max: 20,
		},
		email: {
			type: String,
			trim: true,
			required: true,
			max: 100,
		},
		socialMediaLinks: {
			type: Object,
			trim: true,
			required: true,
		},
	},
	{ timestamps: true },
);

module.exports = mongoose.model('Website_About', Website_AboutSchema);
