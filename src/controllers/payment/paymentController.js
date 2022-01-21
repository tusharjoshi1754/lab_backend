import { stripeService, paypalService } from '../../services';
import { orderService, paymentService } from '../../mongoServices';
import { errorLogger } from '../../utils';
import { CONSTANTS } from '../../constants';
import { Types } from 'mongoose';

const {
	STATUS_CODE: { SUCCESS, FAILED },
	RESPONSE_MESSAGE: { FAILEDRESPONSE, PAYMENT },
} = CONSTANTS;
const addPayment = async (req, res) => {
	try {
		const { paymentId, orderId, method } = req.body;
		let response;
		let { data } = await orderService.findAllQuery({ _id: orderId });
		if (method === 'paypal') {
			response = await paypalService.addPaypalPayment(paymentId, data[0]);
		} else {
			response = await stripeService.addPayment(paymentId, data[0]);
		}
		console.log(`response`, response);
		let filter = { _id: Types.ObjectId(orderId) };
		let update = { paymentId: response._id, status: 'SUCCESS' };

		await orderService.updateOneQuery(filter, update);
		let { data: orderDetails } = await orderService.findAllQuery({
			_id: orderId,
		});
		res.status(SUCCESS).send({
			success: true,
			message: PAYMENT.UPDATESUCCESS,
			data: orderDetails,
		});
	} catch (error) {
		if (error.code === 11000) {
			error.message = PAYMENT.ALREADYAVALIABLE;
		}
		console.log(`error`, error);
		errorLogger(error.message, req.originalUrl, req.ip);
		res.status(FAILED).json({
			success: false,
			error: error.message || FAILEDRESPONSE,
		});
	}
};
const getPayment = async (req, res) => {
	try {
		const { data, totalCount } = await paymentService.findAllQuery(req.query);
		if (data) {
			res.status(SUCCESS).send({
				success: true,
				msg: PAYMENT.GETSUCCESS,
				total: totalCount,
				data,
			});
		} else {
			throw new Error(PAYMENT.GETFAILED);
		}
	} catch (error) {
		console.log(`error`, error);
		errorLogger(error.message, req.originalUrl, req.ip);
		res.status(FAILED).json({
			success: false,
			error: error.message || FAILEDRESPONSE,
		});
	}
};
export default { addPayment, getPayment };
