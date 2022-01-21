import { Schema, model, Types } from 'mongoose';
const sectiontypeSchema = new Schema(
	{
		ObjectField: {
			type: Array,
			trim: true,
			required: true,
			max: 255,
		},
		ObjectValue: {
			type: Array,
			required: true,
		},
		formId: {
			type: Types.ObjectId,
			trim: true,
			max: 2000,
			default: null,
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

module.exports = new model('AssayFinished_tabledata', sectiontypeSchema);
