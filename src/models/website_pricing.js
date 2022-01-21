import { Schema, model, Types } from 'mongoose';

const Website_PricingSchema = new Schema(
	{
		title: {
			type: String,
			trim: true,
			max: 250,
			required: true,
		},
		features: {
			type: [Types.ObjectId],
			trim: true,
			max: 2000,
			required: true,
			ref: 'Website_Features',
		},
		description: {
			type: String,
			trim: true,
			max: 2000,
			required: true,
		},
		price: {
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

module.exports = new model('Website_Pricing', Website_PricingSchema);
