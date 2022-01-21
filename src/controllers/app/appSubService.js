import { SubServiceModel } from '../../models';
import { appSubService, appMainService } from '../../mongoServices';
import { errorLogger } from '../../utils';
import { CONSTANTS } from '../../constants';
import { isValidObjectId } from 'mongoose';
const {
	STATUS_CODE: { SUCCESS, FAILED },
	RESPONSE_MESSAGE: {
		SUBSERVICE,
		INVALIDOBJECTID,
		FAILEDRESPONSE,
		MAINSERVICE,
	},
} = CONSTANTS;

const create = async (req, res) => {
	try {
		const {
			body: { serviceId },
			currentUser,
		} = req;
		if (!isValidObjectId(serviceId)) {
			throw new Error(INVALIDOBJECTID);
		}
		const { data } = await appMainService.findAllQuery(
			{
				_id: serviceId,
			},
			currentUser?.role?.name,
		);
		if (data.length != 1) {
			throw new Error(MAINSERVICE.NOTAVALIABLE);
		}
		const saveSubService = new SubServiceModel(req.body);
		const saveResponse = await saveSubService.save();
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
const getAll = async (req, res) => {
	try {
		const { currentUser } = req;
		const role = currentUser?.role?.name;
		const { data, totalCount } = await appSubService.findAllQuery(
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

const update = async (req, res) => {
	try {
		const {
			body: { serviceId },
			currentUser,
			params: { id },
		} = req;

		if (!isValidObjectId(serviceId)) {
			throw new Error(INVALIDOBJECTID);
		}
		const { data } = await appMainService.findAllQuery(
			{
				_id: serviceId,
			},
			currentUser?.role?.name,
		);
		if (data.length != 1) {
			throw new Error(MAINSERVICE.NOTAVALIABLE);
		}

		let filter = { _id: id };
		const { data: subService } = await appSubService.findAllQuery(
			filter,
			currentUser?.role?.name,
		);
		if (subService.length === 1) {
			let update = { ...req.body };
			const data = await appSubService.updateOneQuery(filter, update);
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
const deletedata = async (req, res) => {
	try {
		const {
			params: { id },
			currentUser: {
				_id: { currentUserId },
				role,
			},
		} = req;
		const roleName = role?.name;
		if (!isValidObjectId(id)) {
			throw new Error(INVALIDOBJECTID);
		}
		let filter = { _id: id };
		const { data } = await appSubService.findAllQuery(filter, roleName);
		if (data.length === 1) {
			let update = {
				deletedDate: Date.now(),
				deletedBy: currentUserId,
				is_deleted: true,
			};
			const data = await appSubService.updateOneQuery(filter, update);
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
		const { data } = await appSubService.findAllQuery(filter, role);
		if (data.length != 1) throw new Error(SUBSERVICE.NOTAVALIABLE);

		let update = { isAvailable: data[0].isAvailable === true ? false : true };
		const updateApp = await appSubService.updateOneQuery(filter, update);
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
const restore = async (req, res) => {
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
		const { data } = await appSubService.findAllQuery(filter, role);
		if (data.length === 1) {
			let update = {
				deletedDate: null,
				deletedBy: null,
				is_deleted: false,
			};
			const data = await appSubService.updateOneQuery(filter, update);
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
	create,
	getAll,
	update,
	deletedata,
	updateStatus,
	restore,
};
