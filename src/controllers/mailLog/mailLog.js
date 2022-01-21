import { mailLoggerService } from '../../mongoServices';
import { CONSTANTS } from '../../constants';
import { errorLogger } from '../../utils';
import { isValidObjectId } from 'mongoose';
const {
	RESPONSE_MESSAGE: { MAILLOGS },
	STATUS_CODE: { SUCCESS, FAILED },
} = CONSTANTS;
const getMailLogs = async (req, res) => {
	try {
		const { data, totalCount } = await mailLoggerService.getMailLog(req.query);
		if (data) {
			res.status(SUCCESS).json({
				success: true,
				msg: MAILLOGS.GETSUCCESS,
				data,
				totalCount,
			});
		} else {
			throw new Error(MAILLOGS.GETFAILED);
		}
	} catch (error) {
		errorLogger(error.message, req.originalUrl, req.ip);
		res.status(FAILED).json({
			success: false,
			error: error.message || FAILEDRESPONSE,
		});
	}
};
const deleteMailLogs = async (req, res) => {
	try {
		const {
			params: { id },
		} = req;
		if (!isValidObjectId(id)) {
			throw new Error(INVALIDOBJECTID);
		}
		const data = await mailLoggerService.deleteOneQuery(id);
		if (data) {
			res.status(SUCCESS).send({
				success: true,
				msg: MAILLOGS.DELETESUCCESS,
				data: [],
			});
		} else {
			throw new Error(MAILLOGS.DELETEFAILED);
		}
	} catch (error) {
		errorLogger(error.message, req.originalUrl, req.ip);
		res.status(FAILED).json({
			success: false,
			error: error.message || FAILEDRESPONSE,
		});
	}
};
export default { getMailLogs, deleteMailLogs };
