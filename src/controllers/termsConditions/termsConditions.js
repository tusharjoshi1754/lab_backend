import { termConditionsModel } from '../../models';
import { termsConditionsService } from '../../mongoServices';
import { errorLogger } from '../../utils';
import { CONSTANTS } from '../../constants';
import { isValidObjectId } from 'mongoose';
const {
	STATUS_CODE: { SUCCESS, FAILED },
	RESPONSE_MESSAGE: { TERMSCONDITION, FAILEDRESPONSE },
} = CONSTANTS;

const createTermsCondition = async (req, res) => {
	try {
		// Add update as per his avaliblity
		const findTermsCondition = await termsConditionsService.findOneQuery();
		if (findTermsCondition?._id) {
			const filter = { _id: findTermsCondition._id };
			const update = { ...req.body };
			const updateHeader = await termsConditionsService.updateOneQuery(
				filter,
				update,
			);
			if (updateHeader) {
				res
					.status(SUCCESS)
					.send({ success: true, msg: TERMSCONDITION.UPDATESUCCESS, data: [] });
			} else {
				throw new Error(TERMSCONDITION.UPDATEFAILED);
			}
			// update TERMSCONDITION if avalible
		} else {
			const termsSave = new termConditionsModel(req.body);
			const saveResponse = await termsSave.save();
			if (saveResponse) {
				res
					.status(SUCCESS)
					.send({ success: true, msg: TERMSCONDITION.CREATESUCCESS, data: [] });
			} else {
				throw new Error(TERMSCONDITION.CREATEFAILED);
			}
			// Add FOOTER if not avalible
		}
	} catch (error) {
		errorLogger(error.message, req.originalUrl, req.ip);
		res.status(FAILED).json({
			success: false,
			error: error.message || FAILEDRESPONSE,
		});
	}
};
const getTermsCondition = async (req, res) => {
	try {
		const findTermsCondition = await termsConditionsService.findOneQuery();
		if (findTermsCondition) {
			res.status(SUCCESS).json({
				success: true,
				msg: TERMSCONDITION.GETSUCCESS,
				data: findTermsCondition,
			});
		} else {
			throw new Error(TERMSCONDITION.GETFAILED);
		}
	} catch (error) {
		errorLogger(error.message, req.originalUrl, req.ip);
		res.status(FAILED).json({
			success: false,
			error: error.message || FAILEDRESPONSE,
		});
	}
};

const deleteTermsCondition = async (req, res) => {
	try {
		const {
			params: { id },
		} = req;
		if (!isValidObjectId(id)) {
			throw new Error(INVALIDOBJECTID);
		}
		let filter = { _id: id };
		const data = await termsConditionsService.findOneQuery(filter);
		if (!data) {
			throw new Error('Terms and conditions is not available');
		}

		const deleteTicket = await termsConditionsService.deleteOneQuery(id);
		if (deleteTicket) {
			res.status(SUCCESS).send({
				success: true,
				msg: TERMSCONDITION.DELETESUCCESS,
				data: [],
			});
		} else {
			throw new Error(TERMSCONDITION.DELETEFAILED);
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
	createTermsCondition,
	getTermsCondition,
	deleteTermsCondition,
};
