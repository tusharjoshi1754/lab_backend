import { appModel } from '../../models';
import { errorLogger } from '../../utils';
import { appService } from '../../mongoServices';
import { CONSTANTS } from '../../constants';
import { isValidObjectId } from 'mongoose';
const {
	STATUS_CODE: { SUCCESS, FAILED },
	RESPONSE_MESSAGE: { APP, INVALIDOBJECTID, FAILEDRESPONSE },
} = CONSTANTS;

const createApp = async (req, res) => {
	try {
		const {
			currentUser: { _id },
		} = req;
		const insertObj = {
			...req.body,
			createdBy: _id,
		};
		const saveAPP = new appModel(insertObj);
		const saveResponse = await saveAPP.save();
		if (saveResponse) {
			res.status(SUCCESS).send({
				success: true,
				msg: APP.CREATESUCCESS,
				data: [],
			});
		} else {
			throw new Error(APP.CREATEFAILED);
		}
	} catch (error) {
		if (error.code === 11000) {
			error.message = APP.ALREADYAVALIABLE;
		}
		errorLogger(error.message, req.originalUrl, req.ip);
		res.status(FAILED).json({
			success: false,
			error: error.message || FAILEDRESPONSE,
		});
	}
};
const getApp = async (req, res) => {
	try {
		const { currentUser } = req;
		const { data, totalCount } = await appService.findAllQuery(
			req.query,
			currentUser?.role?.name,
		);
		console.log(`data`, data);
		if (data) {
			res.status(SUCCESS).send({
				success: true,
				msg: APP.GETSUCCESS,
				total: totalCount,
				data,
			});
		} else {
			throw new Error(APP.GETFAILED);
		}
	} catch (error) {
		errorLogger(error.message, req.originalUrl, req.ip);
		res.status(FAILED).json({
			success: false,
			error: error.message || FAILEDRESPONSE,
		});
	}
};
const updateApp = async (req, res) => {
	try {
		const {
			params: { id },
		} = req;
		if (!isValidObjectId(id)) {
			throw new Error(INVALIDOBJECTID);
		}
		let filter = { _id: id };
		const { data } = await appService.findAllQuery(filter);
		if (data.length === 1) {
			let update = { ...req.body };
			const data = await appService.updateOneQuery(filter, update);
			res.status(SUCCESS).send({
				success: true,
				msg: APP.UPDATESUCCESS,
				data,
			});
		} else {
			throw new Error(APP.UPDATEFAILED);
		}
	} catch (error) {
		errorLogger(error.message, req.originalUrl, req.ip);
		res.status(FAILED).json({
			success: false,
			error: error.message || FAILEDRESPONSE,
		});
	}
};
const deleteApp = async (req, res) => {
	try {
		const {
			params: { id },
			currentUser: { _id: currentUserId },
		} = req;
		if (!isValidObjectId(id)) {
			throw new Error(INVALIDOBJECTID);
		}
		let filter = { _id: id };
		const { data } = await appService.findAllQuery(filter);
		if (data.length === 1) {
			let update = {
				deletedDate: Date.now(),
				deletedBy: currentUserId,
				is_deleted: true,
			};
			const data = await appService.updateOneQuery(filter, update);
			if (data) {
				res.status(SUCCESS).send({
					success: true,
					msg: APP.DELETESUCCESS,
					data: [],
				});
			} else {
				throw new Error(APP.DELETEFAILED);
			}
		} else {
			throw new Error(APP.NOTAVALIABLE);
		}
	} catch (error) {
		errorLogger(error.message, req.originalUrl, req.ip);
		res.status(FAILED).json({
			success: false,
			error: error.message || FAILEDRESPONSE,
		});
	}
};
const updateStatus = async (req, res) => {
	try {
		const {
			params: { id },
		} = req;
		if (!isValidObjectId(id)) {
			throw new Error(INVALIDOBJECTID);
		}
		let filter = { _id: id };
		const { data } = await appService.findAllQuery(filter);
		if (data.length != 1) throw new Error(APP.NOTAVALIABLE);

		let update = { status: data[0].status === true ? false : true };
		const updateApp = await appService.updateOneQuery(filter, update);
		if (!updateApp) throw new Error('status is not updated');
		res.status(SUCCESS).send({
			success: true,
			msg: 'status update successfully',
			data: [],
		});
	} catch (error) {
		errorLogger(error.message, req.originalUrl, req.ip);
		res.status(FAILED).json({
			success: false,
			error: error.message || FAILEDRESPONSE,
		});
	}
};
const restoreApp = async (req, res) => {
	try {
		const {
			params: { id },
			currentUser,
		} = req;
		if (!isValidObjectId(id)) {
			throw new Error(INVALIDOBJECTID);
		}
		let filter = { _id: id };
		const role = currentUser?.role?.name;
		const { data } = await appService.findAllQuery(filter, role);
		if (data.length === 1) {
			let update = {
				deletedDate: null,
				deletedBy: null,
				is_deleted: false,
			};
			const data = await appService.updateOneQuery(filter, update);
			if (data) {
				res.status(SUCCESS).send({
					success: true,
					msg: APP.RESTORESUCCESS,
					data: [],
				});
			} else {
				throw new Error(APP.RESTOREFAILED);
			}
		} else {
			throw new Error(APP.NOTAVALIABLE);
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
	createApp,
	getApp,
	updateApp,
	deleteApp,
	restoreApp,
	updateStatus,
};
