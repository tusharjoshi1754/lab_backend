import { MainServiceModel } from '../../models';
import { appMainService } from '../../mongoServices';
import { errorLogger } from '../../utils';
import { CONSTANTS } from '../../constants';
import { isValidObjectId } from 'mongoose';
const {
	STATUS_CODE: { SUCCESS, FAILED },
	RESPONSE_MESSAGE: { SUBSERVICE, INVALIDOBJECTID, FAILEDRESPONSE },
} = CONSTANTS;

const createMainService = async (req, res) => {
	try {
		const saveMainService = new MainServiceModel(req.body);
		const saveResponse = await saveMainService.save();
		if (saveResponse) {
			res.status(SUCCESS).send({
				success: true,
				msg: SUBSERVICE.CREATESUCCESS,
				data: [],
			});
		} else {
			throw new Error(SUBSERVICE.CREATEFAILED);
		}
	} catch (error) {
		errorLogger(error.message, req.originalUrl, req.ip);
		res.status(FAILED).json({
			success: false,
			error: error.message || FAILEDRESPONSE,
		});
	}
};
const getAllMainService = async (req, res) => {
	try {
		const { currentUser } = req;
		const role = currentUser?.role?.name;
		const { data, totalCount } = await appMainService.findAllQuery(
			req.query,
			role,
		);
		if (data) {
			res.status(SUCCESS).send({
				success: true,
				msg: SUBSERVICE.GETSUCCESS,
				total: totalCount,
				data,
			});
		} else {
			throw new Error(SUBSERVICE.GETFAILED);
		}
	} catch (error) {
		errorLogger(error.message, req.originalUrl, req.ip);
		res.status(FAILED).json({
			success: false,
			error: error.message || FAILEDRESPONSE,
		});
	}
};

const updateMainService = async (req, res) => {
	try {
		const {
			params: { id },
			currentUser,
		} = req;
		const role = currentUser?.role?.name;
		if (!isValidObjectId(id)) {
			throw new Error(INVALIDOBJECTID);
		}
		let filter = { _id: id };
		const { data } = await appMainService.findAllQuery(filter, role);
		if (data.length === 1) {
			let update = { ...req.body };
			const data = await appMainService.updateOneQuery(filter, update);
			res.status(SUCCESS).send({
				success: true,
				msg: SUBSERVICE.UPDATESUCCESS,
				data,
			});
		} else {
			throw new Error(SUBSERVICE.UPDATEFAILED);
		}
	} catch (error) {
		errorLogger(error.message, req.originalUrl, req.ip);
		res.status(FAILED).json({
			success: false,
			error: error.message || FAILEDRESPONSE,
		});
	}
};
const deleteMainService = async (req, res) => {
	try {
		const {
			params: { id },
			currentUser: { _id: currentUserId },
		} = req;
		const role = currentUser?.role?.name;
		if (!isValidObjectId(id)) {
			throw new Error(INVALIDOBJECTID);
		}
		let filter = { _id: id };
		const { data } = await appMainService.findAllQuery(filter, role);
		if (data.length === 1) {
			let update = {
				deletedDate: Date.now(),
				deletedBy: currentUserId,
				is_deleted: true,
			};
			const data = await appMainService.updateOneQuery(filter, update);
			if (data) {
				res.status(SUCCESS).send({
					success: true,
					msg: SUBSERVICE.DELETESUCCESS,
					data: [],
				});
			} else {
				throw new Error(SUBSERVICE.DELETEFAILED);
			}
		} else {
			throw new Error(SUBSERVICE.NOTAVALIABLE);
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
			currentUser,
		} = req;
		if (!isValidObjectId(id)) {
			throw new Error(INVALIDOBJECTID);
		}
		let filter = { _id: id };
		const role = currentUser?.role?.name;
		const { data } = await appMainService.findAllQuery(filter, role);
		if (data.length != 1) throw new Error(SUBSERVICE.NOTAVALIABLE);

		let update = { isAvailable: data[0].isAvailable === true ? false : true };
		const updateApp = await appMainService.updateOneQuery(filter, update);
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
const restoreMainService = async (req, res) => {
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
		const { data } = await appMainService.findAllQuery(filter, role);
		if (data.length === 1) {
			let update = {
				deletedDate: null,
				deletedBy: null,
				is_deleted: false,
			};
			const data = await appMainService.updateOneQuery(filter, update);
			if (data) {
				res.status(SUCCESS).send({
					success: true,
					msg: SUBSERVICE.RESTORESUCCESS,
					data: [],
				});
			} else {
				throw new Error(SUBSERVICE.RESTOREFAILED);
			}
		} else {
			throw new Error(SUBSERVICE.NOTAVALIABLE);
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
	createMainService,
	getAllMainService,
	updateMainService,
	deleteMainService,
	updateStatus,
	restoreMainService,
};
