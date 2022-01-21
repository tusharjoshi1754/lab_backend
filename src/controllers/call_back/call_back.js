import { callBackModel } from '../../models';
import { callBackService } from '../../mongoServices';
import { errorLogger } from '../../utils';
import { CONSTANTS } from '../../constants';
import { isValidObjectId } from 'mongoose';
const {
	STATUS_CODE: { SUCCESS, FAILED },
	RESPONSE_MESSAGE: { CALLBACK, INVALIDOBJECTID, FAILEDRESPONSE },
} = CONSTANTS;

const createCall_back = async (req, res) => {
	try {
		const saveCallBack = new callBackModel(req.body);
		const saveResponse = await saveCallBack.save();
		if (saveResponse) {
			res.status(SUCCESS).send({
				success: true,
				msg: CALLBACK.CREATESUCCESS,
				data: [],
			});
		} else {
			throw new Error(CALLBACK.CREATEFAILED);
		}
	} catch (error) {
		errorLogger(error.message, req.originalUrl, req.ip);
		res.status(FAILED).json({
			success: false,
			error: error.message || FAILEDRESPONSE,
		});
	}
};
const getAllCall_back = async (req, res) => {
	try {
		const { data, totalCount } = await callBackService.callbackfindAllQuery(
			req.query,
		);
		if (data) {
			res.status(SUCCESS).send({
				success: true,
				msg: CALLBACK.GETSUCCESS,
				total: totalCount,
				data,
			});
		} else {
			throw new Error(CALLBACK.GETFAILED);
		}
	} catch (error) {
		errorLogger(error.message, req.originalUrl, req.ip);
		res.status(FAILED).json({
			success: false,
			error: error.message || FAILEDRESPONSE,
		});
	}
};

const updateCall_back = async (req, res) => {
	try {
		const {
			params: { id },
		} = req;
		if (!isValidObjectId(id)) {
			throw new Error(INVALIDOBJECTID);
		}
		let filter = { _id: id };
		const { data } = await callBackService.callbackfindAllQuery(filter);
		if (data.length === 1) {
			let update = { ...req.body };
			const data = await callBackService.updateOneQuery(filter, update);
			res.status(SUCCESS).send({
				success: true,
				msg: CALLBACK.UPDATESUCCESS,
				data,
			});
		} else {
			throw new Error(CALLBACK.UPDATEFAILED);
		}
	} catch (error) {
		errorLogger(error.message, req.originalUrl, req.ip);
		res.status(FAILED).json({
			success: false,
			error: error.message || FAILEDRESPONSE,
		});
	}
};
const deleteCall_back = async (req, res) => {
	try {
		const {
			params: { id },
		} = req;
		if (!isValidObjectId(id)) {
			throw new Error(INVALIDOBJECTID);
		}
		const data = await callBackService.callbackdeleteOneQuery(id);
		if (data) {
			res.status(SUCCESS).send({
				success: true,
				msg: CALLBACK.DELETESUCCESS,
				data: [],
			});
		} else {
			throw new Error(CALLBACK.DELETEFAILED);
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
	createCall_back,
	getAllCall_back,
	updateCall_back,
	deleteCall_back,
};
