import { Schema, model } from 'mongoose';

const notificationTypeSchema = new Schema(
	{
		type: {
			type: String,
			required: true,
			unique: true,
		},
		key: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true },
);

module.exports = new model('notification_Type', notificationTypeSchema);
