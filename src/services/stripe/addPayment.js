const stripe = require('stripe')(process.env.STRIPE_SECRATE_KEY);
const paymentModel = require('../../models/paymentModel');
const addPayment = async (paymentId, order) => {
	let stripeResponse = await stripe.paymentIntents.retrieve(paymentId);
	let {
		amount,
		amount_received,
		currency,
		customer,
		status,
		object,
		charges,
		source,
	} = stripeResponse;
	const { data } = charges;

	if (status === 'succeeded') {
		amount = amount / 100;
		amount_received = amount_received / 100;
		if (
			amount_received === amount &&
			parseFloat(order.total) === parseFloat(amount)
		) {
			const paymentRes = {
				chargeId: data[0].id,
				amount,
				balance_transaction: data[0].balance_transaction,
				calculated_statement_descriptor:
					data[0].calculated_statement_descriptor,
				currency: data[0].currency,
				customer: data[0].customer,
				paid: data[0].paid,
				payment_method_details: data[0].payment_method_details,
				receipt_url: data[0].receipt_url,
				status: data[0].status,
				object,
				source,
				orderId: order._id,
				amount,
				paymentId,
				type: 'STRIPE',
				currency,
			};
			let paymentObj = {
				orderId: order._id,
				amount,
				paymentId,
				customerId: customer,
				type: 'STRIPE',
				currency,
				response: paymentRes,
			};
			const paymentSave = new paymentModel(paymentObj);
			const saveResponse = await paymentSave.save();

			return saveResponse;
		} else {
			throw new Error('amount is not same');
		}
	}
};

export default { addPayment };
