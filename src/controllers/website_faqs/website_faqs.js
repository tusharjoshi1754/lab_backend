import { faqModel } from '../../models';
import { faqService } from '../../mongoServices';
import { errorLogger } from '../../utils';
import { CONSTANTS } from '../../constants';
import { isValidObjectId } from 'mongoose';
const {
	STATUS_CODE: { SUCCESS, FAILED },
	RESPONSE_MESSAGE: { FAQ, INVALIDOBJECTID, FAILEDRESPONSE },
} = CONSTANTS;

const createFaq = async (req, res) => {
	try {
		const saveFaq = new faqModel(req.body);
		const saveResponse = await saveFaq.save();
		if (saveResponse) {
			res.status(SUCCESS).send({
				success: true,
				msg: FAQ.CREATESUCCESS,
				data: [],
			});
		} else {
			throw new Error(FAQ.CREATEFAILED);
		}
	} catch (error) {
		errorLogger(error.message, req.originalUrl, req.ip);
		res.status(FAILED).json({
			success: false,
			error: error.message || FAILEDRESPONSE,
		});
	}
};
const getAllFaq = async (req, res) => {
	try {
		const { data, totalCount } = await faqService.faqfindAllQuery(req.query);
		if (data) {
			res.status(SUCCESS).send({
				success: true,
				msg: FAQ.GETSUCCESS,
				total: totalCount,
				data,
			});
		} else {
			throw new Error(FAQ.GETFAILED);
		}
	} catch (error) {
		errorLogger(error.message, req.originalUrl, req.ip);
		res.status(FAILED).json({
			success: false,
			error: error.message || FAILEDRESPONSE,
		});
	}
};

const updateFaq = async (req, res) => {
	try {
		const {
			params: { id },
		} = req;
		if (!isValidObjectId(id)) {
			throw new Error(INVALIDOBJECTID);
		}
		let filter = { _id: id };
		const { data } = await faqService.faqfindAllQuery(filter);
		if (data.length === 1) {
			let update = { ...req.body };
			const data = await faqService.updateOneQuery(filter, update);
			res.status(SUCCESS).send({
				success: true,
				msg: FAQ.UPDATESUCCESS,
				data,
			});
		} else {
			throw new Error(FAQ.UPDATEFAILED);
		}
	} catch (error) {
		errorLogger(error.message, req.originalUrl, req.ip);
		res.status(FAILED).json({
			success: false,
			error: error.message || FAILEDRESPONSE,
		});
	}
};
const deleteFaq = async (req, res) => {
	try {
		const {
			params: { id },
		} = req;
		if (!isValidObjectId(id)) {
			throw new Error(INVALIDOBJECTID);
		}
		const data = await faqService.faqdeleteOneQuery(id);
		if (data) {
			res.status(SUCCESS).send({
				success: true,
				msg: FAQ.DELETESUCCESS,
				data: [],
			});
		} else {
			throw new Error(FAQ.DELETEFAILED);
		}
	} catch (error) {
		errorLogger(error.message, req.originalUrl, req.ip);
		res.status(FAILED).json({
			success: false,
			error: error.message || FAILEDRESPONSE,
		});
	}
};
export default { createFaq, getAllFaq, updateFaq, deleteFaq };
