import { adminUserService, FormSubService } from '../../mongoServices';
import { Forms, Fields } from '../../models';
import { errorLogger } from '../../utils';
import { CONSTANTS } from '../../constants';

import { Types } from 'mongoose';
const {
	STATUS_CODE: { SUCCESS, FAILED },
	RESPONSE_MESSAGE: { DATATYPE, FAILEDRESPONSE, ADMINUSER, FORM },
} = CONSTANTS;

const get = async (req, res) => {
	try {
		const appCount = await FormSubService.get();
		if (appCount.length >= 1) {
			res.status(SUCCESS).json({
				success: true,
				msg: FORM.GETSUCCESS,
				data: appCount,
			});
		} else {
			res.status(SUCCESS).json({
				success: true,
				msg: FORM.GETFAILED,
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
const post = async (req, res) => {
	try {
		const id = req.body.userid;
		const checkExistingUser = await adminUserService.findAllQuery({
			_id: id,
		});
		// check user is exist or not
		if (!checkExistingUser) {
			throw new Error(ADMINUSER.NOTADMINUSER);
		}

		req.body.createdBy = id;
		var data = {
			...req.body,
		};
		const DataSave = new Forms(data);
		const saveResponse = await DataSave.save();
		if (saveResponse) {
			res.status(SUCCESS).json({
				success: true,
				msg: FORM.CREATESUCCESS,
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
		const { id } = req.params;
		const data = await FormSubService.FindByIdForm(id);
		const map1 = data.fieldId.map((x) => Types.ObjectId(x));
		const finddata = await Fields.aggregate([
			{
				$match: {
					_id: {
						$in: map1,
					},
				},
			},
			{
				$lookup: {
					from: 'datatypes',
					localField: 'Datatypeid',
					foreignField: '_id',
					as: 'datatype',
				},
			},
		]);
		var mainData = {
			formData: data,
			FieldData: finddata,
		};
		if (!mainData) {
			res.status(FAILED).json({
				success: false,
				msg: FORM.GETFAILED,
			});
		} else {
			res.status(SUCCESS).json({
				success: true,
				msg: FORM.GETSUCCESS,
				data: mainData,
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
const deleteForm = async (req, res) => {
	try {
		console.log('req.query', req.query);
		const { id } = req.query;

		const data = await FormSubService.deleteOneQuery(id, req.query.userid);
		if (data) {
			res.status(SUCCESS).send({
				success: true,
				msg: FIELDS.DELETESUCCESS,
				data: [],
			});
		} else {
			throw new Error(FIELDS.DELETEFAILED);
		}
	} catch (error) {
		errorLogger(error.message, req.originalUrl, req.ip);
		res.status(FAILED).json({
			success: false,
			error: error.message || FAILEDRESPONSE,
		});
	}
};
const updateForms = async (req, res) => {
	try {
		const { id } = req.body;
		console.log('req.body', req.body);
		const data = await FormSubService.FindByIdForm({ _id: id });
		console.log('data', data);
		if (!data) {
			res.status(FAILED).json({
				success: false,
				msg: FORM.UPDATEFAILED,
			});
		} else {
			const updateData = await FormSubService.FindByIdAndUpdate(id, req.body);
			res.status(SUCCESS).json({
				success: true,
				msg: FORM.UPDATESUCCESS,
				data: updateData,
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

export default { get, post, getByid, updateForms, deleteForm };
