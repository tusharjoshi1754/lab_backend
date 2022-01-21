import { aboutModel } from '../../models';
import { aboutService } from '../../mongoServices';
import { errorLogger } from '../../utils';
import { CONSTANTS } from '../../constants';
import { isValidObjectId, Types } from 'mongoose';
const {
	STATUS_CODE: { SUCCESS, FAILED },
	RESPONSE_MESSAGE: { ABOUT, INVALIDOBJECTID, FAILEDRESPONSE },
} = CONSTANTS;

const createAbout = async (req, res) => {
	try {
		const saveAbout = new aboutModel(req.body);
		const saveResponse = await saveAbout.save();
		if (saveResponse) {
			res.status(SUCCESS).send({
				success: true,
				msg: ABOUT.CREATESUCCESS,
				data: [],
			});
		} else {
			throw new Error(ABOUT.CREATEFAILED);
		}
	} catch (error) {
		errorLogger(error.message, req.originalUrl, req.ip);
		res.status(FAILED).json({
			success: false,
			error: error.message || FAILEDRESPONSE,
		});
	}
};

const getAllAbout = async (req, res) => {
	try {
		const { data, totalCount } = await aboutService.aboutfindAllQuery(
			req.query,
		);
		if (data) {
			res.status(SUCCESS).send({
				success: true,
				msg: ABOUT.GETSUCCESS,
				total: totalCount,
				data,
			});
		} else {
			throw new Error(ABOUT.GETFAILED);
		}
	} catch (error) {
		errorLogger(error.message, req.originalUrl, req.ip);
		res.status(FAILED).json({
			success: false,
			error: error.message || FAILEDRESPONSE,
		});
	}
};
const updateAbout = async (req, res) => {
	try {
		const {
			params: { id },
		} = req;
		if (!isValidObjectId(id)) {
			throw new Error(INVALIDOBJECTID);
		}
		let filter = { _id: Types.ObjectId(id) };
		const { data } = await aboutService.aboutfindAllQuery(filter);
		if (data.length === 1) {
			let update = { ...req.body };
			const data = await aboutService.updateOneQuery(filter, update);
			if (data) {
				res.status(SUCCESS).send({
					success: true,
					msg: ABOUT.UPDATESUCCESS,
					data,
				});
			} else {
				throw new Error(ABOUT.UPDATEFAILED);
			}
		} else {
			throw new Error(ABOUT.NOTABOUT);
		}
	} catch (error) {
		errorLogger(error.message, req.originalUrl, req.ip);
		res.status(FAILED).json({
			success: false,
			error: error.message || FAILEDRESPONSE,
		});
	}
};
const deleteAbout = async (req, res) => {
	try {
		const {
			params: { id },
		} = req;
		if (!isValidObjectId(id)) {
			throw new Error(INVALIDOBJECTID);
		}
		const data = await aboutService.deleteOneQuery(id);
		if (data) {
			res.status(SUCCESS).send({
				success: true,
				msg: ABOUT.DELETESUCCESS,
				data: [],
			});
		} else {
			throw new Error(ABOUT.DELETEFAILED);
		}
	} catch (error) {
		errorLogger(error.message, req.originalUrl, req.ip);
		res.status(FAILED).json({
			success: false,
			error: error.message || FAILEDRESPONSE,
		});
	}
};
export default { createAbout, getAllAbout, updateAbout, deleteAbout };
