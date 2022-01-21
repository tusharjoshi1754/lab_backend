const mongoose = require('mongoose');

const Website_headerSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			trim: true,
			max: 250,
			required: true,
		},
		subtitle: {
			type: String,
			trim: true,
			max: 2000,
			required: true,
		},
		description: {
			type: String,
			trim: true,
			max: 2000,
			required: true,
		},
		appStoreLink: {
			type: String,
			trim: true,
			required: true,
		},
		playStoreLink: {
			type: String,
			trim: true,
			required: true,
		},
	},
	{ timestamps: true },
);

module.exports = mongoose.model('Website_header', Website_headerSchema);
