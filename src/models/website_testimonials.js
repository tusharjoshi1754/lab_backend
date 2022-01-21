const mongoose = require('mongoose');

const Website_TestimonialsSchema = new mongoose.Schema(
	{
		videoLink: {
			type: String,
			trim: true,
			required: true,
		},
		content: {
			type: String,
			trim: true,
			required: true,
		},
	},
	{ timestamps: true },
);

module.exports = mongoose.model(
	'Website_Testimonials',
	Website_TestimonialsSchema,
);
