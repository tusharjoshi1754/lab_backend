import axios from 'axios';
import qs from 'qs';
import { CONSTANTS } from '../constants';
const publicKey = process.env.PAYPAL_PUBLIC_KEY;
const secrateKey = process.env.PAYPAL_SECRATE_KEY;

const getToken = async () => {
	try {
		let headers = {
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
		};
		let data = qs.stringify({
			grant_type: 'client_credentials',
		});
		var config = {
			method: 'post',
			headers,
			auth: {
				username: publicKey,
				password: secrateKey,
			},

			url: CONSTANTS.PAYPAL.TOKEN_URL,
			data: data,
		};

		const response = await axios(config);
		return response.data;
	} catch (error) {
		console.error(error);
	}
};

const getOrder = async (token, paymentId) => {
	try {
		var config = {
			method: 'get',
			headers: {
				Authorization: `Bearer ${token}`,
			},
			url: CONSTANTS.PAYPAL.GET_ORDER + paymentId,
		};
		console.log(`config`, config);

		const response = await axios(config);
		return response.data;
	} catch (error) {
		console.error(error.message);
	}
};

export default { getToken, getOrder };
