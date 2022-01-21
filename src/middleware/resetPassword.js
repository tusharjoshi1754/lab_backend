import { adminUserService } from '../mongoServices';
import { CONSTANTS } from '../constants';
import { errorLogger, jwtVerify } from '../utils';
const {
	RESPONSE_MESSAGE: { AUTHMIDDLEWARE },
	STATUS_CODE: { UNAUTHORIZED },
} = CONSTANTS;
const resetPassword = async (req, res, next) => {
	try {
		const { authorization } = req.headers;
		if (!authorization) throw new Error(AUTHMIDDLEWARE.TOKENNOTFOUND);
		const token =
			authorization && authorization.startsWith('Bearer ')
				? authorization.slice(7, authorization.length)
				: authorization;
		const verifyToken = jwtVerify(token);

		if (!verifyToken) throw new Error(AUTHMIDDLEWARE.TOKENINVALID);
		const currentDate = Math.floor(Date.now() / 1000);

		if (currentDate > verifyToken?.exp) {
			throw new Error(AUTHMIDDLEWARE.SESSIONEXPIRY);
		}
		const { data } = await adminUserService.findAllQuery({
			email: verifyToken.sub,
		});
		if (data.length == 1) {
			req.currentUser = data[0];
			next();
		} else {
			throw new Error(AUTHMIDDLEWARE.UNAUTHORIZED);
		}
	} catch (error) {
		errorLogger(error.message, req.originalUrl, req.ip);
		return res
			.status(UNAUTHORIZED)
			.send({ success: false, message: error.message });
	}
};

export default resetPassword;
