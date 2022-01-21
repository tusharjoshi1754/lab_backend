import { Schema, model, Types } from 'mongoose';

const PaymentSchema = new Schema(
	{
		orderId: {
			type: Types.ObjectId,
			required: true,
			ref: 'Order_details',
			unique: true,
		},
		amount: {
			type: String,
			required: true,
		},
		paymentId: {
			type: String,
			required: true,
		},
		customerId: {
			type: String,
			required: false,
		},

		status: {
			type: String,
			index: true,
			enum: ['PROCESSING', 'PENDING', 'REJECTED', 'SUCCESS'],
			default: 'SUCCESS',
		},
		type: {
			type: String,
			index: true,
			enum: ['STRIPE', 'PAYPAL'],
		},
		currency: {
			type: String,
		},
		response: {
			type: Object,
		},
	},
	{ timestamps: true },
);

module.exports = new model('payment_details', PaymentSchema);
