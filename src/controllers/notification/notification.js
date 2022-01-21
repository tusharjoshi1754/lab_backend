import { notificationTypeModel } from '../../models';
import { errorLogger } from '../../utils';
import { CONSTANTS } from '../../constants';
import { isValidObjectId } from 'mongoose';
import { notificationTypeService } from '../../mongoServices';
const {
	STATUS_CODE: { SUCCESS, FAILED },
	RESPONSE_MESSAGE: { NOTIFICATIONTYPE, INVALIDOBJECTID, FAILEDRESPONSE },
} = CONSTANTS;

const createNotificationType = async (req, res) => {
	try {
		const savenotificationType = new notificationTypeModel(req.body);
		const saveResponse = await savenotificationType.save();
		if (saveResponse) {
			res.status(SUCCESS).send({
				success: true,
				msg: NOTIFICATIONTYPE.CREATESUCCESS,
				data: [],
			});
		} else {
			throw new Error(NOTIFICATIONTYPE.CREATEFAILED);
		}
	} catch (error) {
		if (error.code === 11000) {
			error.message = NOTIFICATIONTYPE.ALREADYAVALIABLE;
		}
		errorLogger(error.message, req.originalUrl, req.ip);
		res.status(FAILED).json({
			success: false,
			error: error.message || FAILEDRESPONSE,
		});
	}
};
const listNotificationType = async (req, res) => {
	try {
		const { query } = req;
		const data = await notificationTypeService.findAllQuery(query);
		if (data) {
			res.status(SUCCESS).json({
				success: true,
				msg: NOTIFICATIONTYPE.GETSUCCESS,
				data,
				totalCount,
			});
		} else {
			throw new Error(NOTIFICATIONTYPE.GETFAILED);
		}
	} catch (error) {
		errorLogger(error.message, req.originalUrl, req.ip);
		res.status(FAILED).json({
			success: false,
			error: error.message || FAILEDRESPONSE,
		});
	}
};
const updateNotificationType = async (req, res) => {
	try {
		const {
			params: { id },
		} = req;
		if (!isValidObjectId(id)) {
			throw new Error(INVALIDOBJECTID);
		}
		let filter = { _id: id };
		const { data } = await notificationTypeService.findAllQuery(filter);
		if (data.length === 1) {
			let update = {
				...req.body,
			};
			const data = await notificationTypeService.findOneUpdateQuery(
				filter,
				update,
			);
			if (data) {
				res.status(SUCCESS).send({
					success: true,
					msg: NOTIFICATIONTYPE.UPDATESUCCESS,
					data,
				});
			} else {
			}
		} else {
			throw new Error(NOTIFICATIONTYPE.UPDATEFAILED);
		}
	} catch (error) {
		errorLogger(error.message, req.originalUrl, req.ip);
		res.status(FAILED).json({
			success: false,
			error: error.message || FAILEDRESPONSE,
		});
	}
};
const deleteNotificationType = async (req, res) => {
	try {
		const {
			params: { id },
		} = req;
		if (!isValidObjectId(id)) {
			throw new Error(INVALIDOBJECTID);
		}
		const data = await notificationTypeService.deleteOneQuery(id);
		if (data) {
			res.status(SUCCESS).send({
				success: true,
				msg: NOTIFICATIONTYPE.DELETESUCCESS,
				data: [],
			});
		} else {
			throw new Error(NOTIFICATIONTYPE.DELETEFAILED);
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
	createNotificationType,
	updateNotificationType,
	deleteNotificationType,
	listNotificationType,
};
