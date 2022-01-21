import { Schema, model, Types } from 'mongoose';
const datatypeSchema = new Schema(
	{
		datatype:{
            type:String,
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

module.exports = new model('Datatype', datatypeSchema);
