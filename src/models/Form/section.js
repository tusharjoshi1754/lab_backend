import { Schema, model, Types } from 'mongoose';
const sectiontypeSchema = new Schema(
	{
		fieldId: {
			type: Array,
			trim: true,
			required: true,
			max: 255,
		},
		title: {
			type: String,
			trim: true,
			max: 2000,
			default: null,
		},
		subtitle: {
			type: String,
			trim: true,
			required: true,
			max: 255,
		},
		description: {
			type: String,
			trim: true,
			required: true,
			max: 255,
		},
		content: {
			type: String,
			trim: true,
			required: true,
			max: 255,
		},
		formId: {
			type: Array,
			trim: true,
			max: 2000,
			default: null,
		},
		type: {
			type: String,
			trim: true,
			required: true,
			max: 255,
		},
		createdBy: {
			type: Types.ObjectId,
			trim: true,
			max: 2000,
			default: null,
		},
		isEnabled: {
			type: Boolean,
			required: true,
			default: true,
		},
		deletedAt: {
			type: Date,
			default: null,
		},
		deletedBy: {
			type: Types.ObjectId,
			default: null,
		},
	},
	{ timestamps: true },
);

module.exports = new model('Section', sectiontypeSchema);
