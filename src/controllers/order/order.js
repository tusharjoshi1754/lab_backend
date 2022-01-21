import { orderModel } from '../../models';
import { errorLogger } from '../../utils';
import { orderService, productBackService } from '../../mongoServices';
import { CONSTANTS } from '../../constants';
import { isValidObjectId } from 'mongoose';
const {
	STATUS_CODE: { SUCCESS, FAILED },
	RESPONSE_MESSAGE: { ORDER, INVALIDOBJECTID, FAILEDRESPONSE },
} = CONSTANTS;

const createOrder = async (req, res) => {
	try {
		console.log(`req.currentUser`, req.currentUser);
		const {
			body: { productId, qty },
			currentUser: { _id },
		} = req;
		let filter = { _id: productId };
		let { data } = await productBackService.findAllQuery(filter);
		if (data.length != 1) {
			throw new Error('product not found');
		} else {
			const productData = data[0];

			let createOrderPayload = {
				productId: productData._id,
				qty,
				subTotal: productData.price * qty,
				total: productData.price * qty,
				createdBy: _id,
			};
			let ordersave = new orderModel(createOrderPayload);
			let response = await ordersave.save();
			let { data: orderData } = await orderService.findAllQuery({
				_id: response._id,
			});

			res.status(SUCCESS).send({
				success: true,
				msg: ORDER.CREATESUCCESS,
				data: orderData[0],
			});
		}
	} catch (error) {
		console.log(error);
		errorLogger(error.message, req.originalUrl, req.ip);
		res.status(FAILED).json({
			success: false,
			error: error.message || FAILEDRESPONSE,
		});
	}
};
const getOrder = async (req, res) => {
	try {
		const { data, totalCount } = await orderService.findAllQuery(req.query);
		if (data) {
			res.status(SUCCESS).send({
				success: true,
				msg: ORDER.GETSUCCESS,
				total: totalCount,
				data,
			});
		} else {
			throw new Error(ORDER.GETFAILED);
		}
	} catch (error) {
		errorLogger(error.message, req.originalUrl, req.ip);
		res.status(FAILED).json({
			success: false,
			error: error.message || FAILEDRESPONSE,
		});
	}
};
const updateOrder = async (req, res) => {
	try {
		const {
			params: { id },
		} = req;
		if (!isValidObjectId(id)) {
			throw new Error(INVALIDOBJECTID);
		}
		let filter = { _id: id };
		const { data } = await orderService.findAllQuery(filter);
		if (data.length === 1) {
			let update = { ...req.body };
			const data = await orderService.updateOneQuery(filter, update);
			res.status(SUCCESS).send({
				success: true,
				msg: ORDER.UPDATESUCCESS,
				data,
			});
		} else {
			throw new Error(ORDER.UPDATEFAILED);
		}
	} catch (error) {
		errorLogger(error.message, req.originalUrl, req.ip);
		res.status(FAILED).json({
			success: false,
			error: error.message || FAILEDRESPONSE,
		});
	}
};
export default {
	createOrder,
	updateOrder,
	getOrder,
};
