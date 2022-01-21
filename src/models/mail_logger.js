import { Schema, model } from 'mongoose';
import { CONSTANTS } from '../constants';
const {
	MAILSTATUS: { SUCCESS, FAILED },
} = CONSTANTS;

const MailLoggerSchema = new Schema(
	{
		from: {
			type: String,
			required: true,
		},
		to: {
			type: String,
			required: true,
		},
		subject: {
			type: String,
			required: true,
		},
		status: {
			type: String,
			index: true,
			enum: [SUCCESS, FAILED],
			default: SUCCESS,
		},
	},
	{ timestamps: true },
);

module.exports = new model('mail_Logger', MailLoggerSchema);
