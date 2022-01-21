import { Schema, model, Types } from 'mongoose';

const OrderSchema = new Schema(
	{
		productId: {
			type: Types.ObjectId,
			required: true,
			ref: 'Product_Bac',
		},
		qty: {
			type: Number,
			required: true,
		},
		subTotal: {
			type: String,
			required: true,
		},
		total: {
			type: String,
			required: true,
		},
		tax: {
			type: String,
		},
		status: {
			type: String,
			index: true,
			enum: ['PROCESSING', 'PENDING', 'REJECTED', 'SUCCESS'],
			default: 'PROCESSING',
		},
		paymentId: {
			type: Types.ObjectId,
			required: false,
			default: null,
			unique: true,
			null: true,
		},
		createdBy: {
			type: Types.ObjectId,
			ref: 'admin_user',
		},
	},
	{ timestamps: true },
);

module.exports = new model('Order_details', OrderSchema);
