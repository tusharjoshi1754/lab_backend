import { footerModel } from '../../models';
import { footerService } from '../../mongoServices';
import { errorLogger } from '../../utils';
import { CONSTANTS } from '../../constants';
import { isValidObjectId } from 'mongoose';
const {
	STATUS_CODE: { SUCCESS, FAILED },
	RESPONSE_MESSAGE: { FOOTER, FAILEDRESPONSE },
} = CONSTANTS;

const createFooter = async (req, res) => {
	try {
		// Add update as per his avaliblity
		const findHeader = await footerService.findOneQuery();
		if (findHeader?._id) {
			const filter = { _id: findHeader._id };
			const update = { ...req.body };
			const updateHeader = await footerService.updateOneQuery(filter, update);
			if (updateHeader) {
				res
					.status(SUCCESS)
					.send({ success: true, msg: FOOTER.UPDATESUCCESS, data: [] });
			} else {
				throw new Error(FOOTER.UPDATEFAILED);
			}
		} else {
			const newFooter = new footerModel(req.body);
			const footerCreate = await newFooter.save();
			if (footerCreate) {
				res
					.status(SUCCESS)
					.send({ success: true, msg: FOOTER.CREATESUCCESS, data: [] });
			} else {
				throw new Error(FOOTER.CREATEFAILED);
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
const getFooter = async (req, res) => {
	try {
		const findHeader = await footerService.findOneQuery();
		if (findHeader) {
			res.status(SUCCESS).json({
				success: true,
				msg: FOOTER.GETSUCCESS,
				data: findHeader,
			});
		} else {
			throw new Error(FOOTER.GETFAILED);
		}
	} catch (error) {
		errorLogger(error.message, req.originalUrl, req.ip);
		res.status(FAILED).json({
			success: false,
			error: error.message || FAILEDRESPONSE,
		});
	}
};

const delereFooter = async (req, res) => {
	try {
		const {
			params: { id },
		} = req;
		if (!isValidObjectId(id)) {
			throw new Error(INVALIDOBJECTID);
		}
		const data = await footerService.deleteOneQuery(id);
		if (data) {
			res.status(SUCCESS).send({
				success: true,
				msg: FOOTER.DELETESUCCESS,
				data: [],
			});
		} else {
			throw new Error(FOOTER.DELETEFAILED);
		}
	} catch (error) {
		errorLogger(error.message, req.originalUrl, req.ip);
		res.status(FAILED).json({
			success: false,
			error: error.message || FAILEDRESPONSE,
		});
	}
};
export default { createFooter, getFooter, delereFooter };
