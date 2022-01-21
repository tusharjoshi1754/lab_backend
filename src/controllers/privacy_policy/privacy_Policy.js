import { privacyPolicyModel } from '../../models';
import { privacyPolicyService } from '../../mongoServices';
import { errorLogger } from '../../utils';
import { CONSTANTS } from '../../constants';
import { isValidObjectId } from 'mongoose';
const {
	STATUS_CODE: { SUCCESS, FAILED },
	RESPONSE_MESSAGE: { PRIVACYPOLICY, FAILEDRESPONSE },
} = CONSTANTS;

const createPrivacyPolicy = async (req, res) => {
	try {
		// Add update as per his avaliblity
		const findPrivacyPolicy = await privacyPolicyService.findOneQuery();
		if (findPrivacyPolicy?._id) {
			const filter = { _id: findPrivacyPolicy._id };
			const update = { ...req.body };
			const updatePrivacyPolicy = await privacyPolicyService.updateOneQuery(
				filter,
				update,
			);
			if (updatePrivacyPolicy) {
				res
					.status(SUCCESS)
					.send({ success: true, msg: PRIVACYPOLICY.UPDATESUCCESS, data: [] });
			} else {
				throw new Error(PRIVACYPOLICY.UPDATEFAILED);
			}
			// update PRIVACYPOLICY if avalible
		} else {
			const privacyPolicySave = new privacyPolicyModel(req.body);
			const saveResponse = await privacyPolicySave.save();
			if (saveResponse) {
				res
					.status(SUCCESS)
					.send({ success: true, msg: PRIVACYPOLICY.CREATESUCCESS, data: [] });
			} else {
				throw new Error(PRIVACYPOLICY.CREATEFAILED);
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
const getPrivacyPolicy = async (req, res) => {
	try {
		const findPrivacyPolicy = await privacyPolicyService.findOneQuery();
		if (findPrivacyPolicy) {
			res.status(SUCCESS).json({
				success: true,
				msg: PRIVACYPOLICY.GETSUCCESS,
				data: findPrivacyPolicy,
			});
		} else {
			throw new Error(PRIVACYPOLICY.GETFAILED);
		}
	} catch (error) {
		errorLogger(error.message, req.originalUrl, req.ip);
		res.status(FAILED).json({
			success: false,
			error: error.message || FAILEDRESPONSE,
		});
	}
};

const deletePrivacyPolicy = async (req, res) => {
	try {
		const {
			params: { id },
		} = req;
		if (!isValidObjectId(id)) {
			throw new Error(INVALIDOBJECTID);
		}
		const data = await privacyPolicyService.deleteOneQuery(id);
		if (data) {
			res.status(SUCCESS).send({
				success: true,
				msg: PRIVACYPOLICY.DELETESUCCESS,
				data: [],
			});
		} else {
			throw new Error(PRIVACYPOLICY.DELETEFAILED);
		}
	} catch (error) {
		errorLogger(error.message, req.originalUrl, req.ip);
		res.status(FAILED).json({
			success: false,
			error: error.message || FAILEDRESPONSE,
		});
	}
};
export default { createPrivacyPolicy, getPrivacyPolicy, deletePrivacyPolicy };
