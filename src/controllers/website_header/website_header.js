import { headerModel } from '../../models';
import { headerService } from '../../mongoServices';
import { errorLogger } from '../../utils';
import { CONSTANTS } from '../../constants';
import { isValidObjectId } from 'mongoose';
const {
	STATUS_CODE: { SUCCESS, FAILED },
	RESPONSE_MESSAGE: { HEADER, INVALIDOBJECTID },
} = CONSTANTS;

const createHeader = async (req, res) => {
	try {
		// Add update as per his avaliblity
		const findHeader = await headerService.findOneQuery();
		if (findHeader?._id) {
			const filter = { _id: findHeader._id };
			const update = { ...req.body };
			const updateHeader = await headerService.updateOneQuery(filter, update);
			if (updateHeader) {
				res
					.status(SUCCESS)
					.send({ success: true, msg: HEADER.UPDATESUCCESS, data: [] });
			} else {
				throw new Error(HEADER.UPDATEFAILED);
			}
			// update header if avalible
		} else {
			const newHeader = new headerModel(req.body);
			const headerCreate = await newHeader.save();
			if (headerCreate) {
				res
					.status(SUCCESS)
					.send({ success: true, msg: HEADER.CREATESUCCESS, data: [] });
			} else {
				throw new Error(HEADER.CREATEFAILED);
			}
			// Add header if not avalible
		}
	} catch (error) {
		errorLogger(error.message, req.originalUrl, req.ip);
		res.status(FAILED).json({
			success: false,
			error: error.message || 'failed',
		});
	}
};
const getHeader = async (req, res) => {
	try {
		const findHeader = await headerService.findOneQuery();
		if (findHeader) {
			res.status(SUCCESS).json({
				success: true,
				msg: HEADER.GETSUCCESS,
				data: findHeader,
			});
		} else {
			throw new Error(HEADER.GETFAILED);
		}
	} catch (error) {
		errorLogger(error.message, req.originalUrl, req.ip);
		res.status(FAILED).json({
			success: false,
			error: error.message || 'failed',
		});
	}
};

const deleteHeader = async (req, res) => {
	try {
		const {
			params: { id },
		} = req;
		if (!isValidObjectId(id)) {
			throw new Error(INVALIDOBJECTID);
		}
		const data = await headerService.deleteOneQuery(id);
		if (data) {
			res.status(SUCCESS).send({
				success: true,
				msg: HEADER.DELETESUCCESS,
				data: [],
			});
		} else {
			throw new Error(HEADER.DELETEFAILED);
		}
	} catch (error) {
		errorLogger(error.message, req.originalUrl, req.ip);
		res.status(FAILED).json({
			success: false,
			error: error.message || FAILEDRESPONSE,
		});
	}
};

export default { createHeader, getHeader, deleteHeader };
