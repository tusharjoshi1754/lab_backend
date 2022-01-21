import { notificationService } from '../../mongoServices';
import { errorLogger } from '../../utils';
import { CONSTANTS } from '../../constants';
import { isValidObjectId } from 'mongoose';
const {
	STATUS_CODE: { SUCCESS, FAILED },
	RESPONSE_MESSAGE: { NOTIFICATION, FAILEDRESPONSE },
} = CONSTANTS;
const getNotification = async (req, res) => {
	try {
		const { query } = req;
		const data = await notificationService.findAllQuery(query);
		if (data) {
			res.status(SUCCESS).json({
				success: true,
				msg: NOTIFICATION.GETSUCCESS,
				data,
			});
		} else {
			throw new Error(NOTIFICATION.GETFAILED);
		}
	} catch (error) {
		errorLogger(error.message, req.originalUrl, req.ip);
		res.status(FAILED).json({
			success: false,
			error: error.message || FAILEDRESPONSE,
		});
	}
};

const readNotification = async (req, res) => {
	try {
		const {
			body: { id },
		} = req;
		if (id != 'All') {
			if (!isValidObjectId(id)) {
				throw new Error(INVALIDOBJECTID);
			}
			let filter = { _id: id };
			let update = { is_read: true };
			const data = await notificationService.findOneUpdateQuery(filter, update);
			if (data) {
				res.status(SUCCESS).send({
					success: true,
					msg: NOTIFICATION.UPDATESUCCESS,
					data: [],
				});
			} else {
				throw new Error(NOTIFICATION.UPDATEFAILED);
			}
		} else {
			const data = await notificationService.findUpdateAllQuery();
			if (data) {
				res.status(SUCCESS).send({
					success: true,
					msg: NOTIFICATION.UPDATESUCCESS,
					data: [],
				});
			} else {
				throw new Error(NOTIFICATION.UPDATEFAILED);
			}
		}
	} catch (error) {
		errorLogger(error.message, req.originalUrl, req.ip);
		res.status(FAILED).json({
			success: false,
			error: error.message || FAILEDRESPONSE,
		});
	}
};
export default { getNotification, readNotification };
