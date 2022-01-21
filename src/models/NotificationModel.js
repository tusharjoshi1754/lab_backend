import { Schema, model, Types } from 'mongoose';

const notificationSchema = new Schema(
	{
		type: {
			type: Types.ObjectId,
			required: true,
			ref: 'notification_Type',
		},
		is_read: {
			type: 'boolean',
			default: false,
		},
		details: {
			type: 'string',
		},
	},
	{ timestamps: true },
);

module.exports = new model('notification', notificationSchema);
