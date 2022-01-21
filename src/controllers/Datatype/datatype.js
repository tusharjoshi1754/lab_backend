import { adminUserService, DatatypeSubService } from '../../mongoServices';
import { Datatype } from '../../models'
import { errorLogger } from '../../utils';
import { CONSTANTS } from '../../constants';
const {
	STATUS_CODE: { SUCCESS, FAILED },
	RESPONSE_MESSAGE: { DATATYPE, FAILEDRESPONSE, ADMINUSER },
} = CONSTANTS;

const get = async (req, res) => {
	try {
		const appCount = await DatatypeSubService.get();
		res.status(SUCCESS).json({
			success: true,
			msg: DATATYPE.GETSUCCESS,
			data: appCount,
		});
	} catch (error) {
		errorLogger(error.message, req.originalUrl, req.ip);
		res.status(FAILED).json({
			success: false,
			error: error.message || FAILEDRESPONSE,
		});
	}
};
const post = async (req, res) => {
	try {
		const id = req.body.userid
		const checkExistingUser = await adminUserService.findAllQuery({
			_id: id,
		});
		// check user is exist or not
		if (!checkExistingUser) {
			throw new Error(ADMINUSER.NOTADMINUSER);
		}
		req.body.createdBy = id
		var data = {
			...req.body
		}
		const termsSave = new Datatype(data);
		const saveResponse = await termsSave.save();
		if (saveResponse) {
			res.status(SUCCESS).json({
				success: true,
				msg: DATATYPE.GETSUCCESS,
				data: saveResponse,
			});
		}



	} catch (error) {
		errorLogger(error.message, req.originalUrl, req.ip);
		res.status(FAILED).json({
			success: false,
			error: error.message || FAILEDRESPONSE,
		});
	}
};
const getByid = async (req, res) => {
	try {
		const { id } = req.params
		const data = await DatatypeSubService.FindByIdDataType(id)
		if (!data) {
			res.status(FAILED).json({
				success: false,
				msg: DATATYPE.GETFAILED
			})
		}else {
			res.status(SUCCESS).json({
				success: true,
				msg: DATATYPE.GETSUCCESS,
				data: data,
			});
		}


	} catch (error) {
		errorLogger(error.message, req.originalUrl, req.ip);
		res.status(FAILED).json({
			success: false,
			error: error.message || FAILEDRESPONSE,
		});
	}
}

export default { get, post, getByid };
