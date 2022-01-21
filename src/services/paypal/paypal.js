import { paymentModel } from '../../models';
import api from '../axios';
const addPaypalPayment = async (paymentId, order) => {
	const token = await api.getToken();
	if (!token) {
		throw new Error('token is not generate');
	}
	const payment = await api.getOrder(token.access_token, paymentId);
	const { intent, status, purchase_units, payer, create_time, update_time } =
		payment;
	const { reference_id, amount, soft_descriptor } = purchase_units[0];
	const { currency_code, value } = amount;
	const { email_address } = payer;

	if (status === 'COMPLETED') {
		if (parseFloat(order.total) === parseFloat(value)) {
			const paymentRes = {
				paymentId,
				amount,
				calculated_statement_descriptor: soft_descriptor,
				currency: currency_code,
				paid: true,
				status,
				object: intent,
				orderId: order._id,
				amount,
				type: 'PAYPAL',
				email: email_address,
				reference_id,
				create_time,
				update_time,
			};

			let paymentObj = {
				orderId: order._id,
				amount: value,
				paymentId,
				type: 'PAYPAL',
				currency: currency_code,
				response: paymentRes,
			};

			console.log(`1`, paymentObj);
			const paymentSave = new paymentModel(paymentObj);
			const saveResponse = await paymentSave.save();

			return saveResponse;
		} else {
			throw new Error('amount is not same');
		}
	}

	return payment;
};

export default { addPaypalPayment };
