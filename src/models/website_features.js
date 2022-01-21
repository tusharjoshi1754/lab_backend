const mongoose = require('mongoose');

const Website_FeaturesSchema = new mongoose.Schema(
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
		rank: {
			type: Number,
			trim: true,
			required: true,
		},
		image: {
			type: String,
			trim: true,
			required: true,
		},
	},
	{ timestamps: true },
);

module.exports = mongoose.model('Website_Features', Website_FeaturesSchema);
