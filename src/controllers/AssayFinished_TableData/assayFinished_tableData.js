import {
	adminUserService,
	SectionSubService,
	AssayFinishedSubService,
} from '../../mongoServices';
import { Fields, AssayFinished_tabledata } from '../../models';
import { errorLogger } from '../../utils';
import { CONSTANTS } from '../../constants';
import { v1 as uuidv1 } from 'uuid';

const {
	STATUS_CODE: { SUCCESS, FAILED },
	RESPONSE_MESSAGE: { FAILEDRESPONSE, ADMINUSER, ASSAYFINISHED_TABLEDATA },
} = CONSTANTS;

const get = async (req, res) => {
	try {
		let appCount = await AssayFinishedSubService.get();
		if (appCount.length >= 1) {
			var mainData = [];
			appCount.map((element) => {
				var id = element._id;
				if (element.ObjectValue) {
					element.ObjectValue[0].sectionId = id;
				}
				mainData.push(element);
			});
			res.status(SUCCESS).json({
				success: true,
				msg: ASSAYFINISHED_TABLEDATA.GETSUCCESS,
				data: mainData,
			});
		} else {
			res.status(SUCCESS).json({
				success: true,
				msg: ASSAYFINISHED_TABLEDATA.GETFAILED,
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
		console.log('req.body', req.body);
		const id = req.body.userid;
		const checkExistingUser = await adminUserService.findAllQuery({
			_id: id,
		});
		if (!checkExistingUser) {
			throw new Error(ADMINUSER.NOTADMINUSER);
		}
		if (req.body.ObjectField) {
			const finddata = await Fields.find({
				_id: {
					$in: req.body.ObjectField,
				},
			});
			if (finddata) {
				req.body.createdBy = id;
				if (req.body.ObjectValue) {
					var data = req.body.ObjectValue[0];
					data.id = uuidv1();
					req.body.ObjectValue[0] = data;
				}
				var data = {
					...req.body,
				};
				const DataSave = new AssayFinished_tabledata(data);
				const saveResponse = await DataSave.save();
				if (saveResponse) {
					res.status(SUCCESS).json({
						success: true,
						msg: ASSAYFINISHED_TABLEDATA.CREATESUCCESS,
						data: saveResponse,
					});
				}
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
const getByid = async (req, res) => {
	try {
		const { id } = req.params;
		var mainData = [];
		const data = await SectionSubService.FindById(id);
		mainData.push(data);
		const finddata = await Fields.find(
			{
				_id: {
					$in: data.fieldId,
				},
			},
			{ _id: 1, fieldName: 1, bgColor: 1, title: 1, variant: 1 },
		);
		var test = { SectionData: [...mainData], FieldData: finddata };
		if (!mainData) {
			res.status(FAILED).json({
				success: false,
				msg: ASSAYFINISHED_TABLEDATA.GETFAILED,
			});
		} else {
			res.status(SUCCESS).json({
				success: true,
				msg: ASSAYFINISHED_TABLEDATA.GETSUCCESS,
				data: test,
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
const deleteData = async (req, res) => {
	try {
		const { id } = req.query;
		console.log('req.query', req.query);

		const data = await AssayFinishedSubService.deleteOneQuery(
			id,
			req.query.userid,
		);
		if (data) {
			res.status(SUCCESS).send({
				success: true,
				msg: ASSAYFINISHED_TABLEDATA.DELETESUCCESS,
				data: [],
			});
		} else {
			throw new Error(ASSAYFINISHED_TABLEDATA.DELETEFAILED);
		}
	} catch (error) {
		errorLogger(error.message, req.originalUrl, req.ip);
		res.status(FAILED).json({
			success: false,
			error: error.message || FAILEDRESPONSE,
		});
	}
};
const updateData = async (req, res) => {
	try {
		const { id } = req.body;
		console.log('req.body', req.body);
		const data = await AssayFinishedSubService.FindById({ _id: id });
		if (!data) {
			res.status(FAILED).json({
				success: false,
				msg: ASSAYFINISHED_TABLEDATA.UPDATEFAILED,
			});
		} else {
			const updateData = await AssayFinishedSubService.FindByIdAndUpdate(
				id,
				req.body,
			);
			res.status(SUCCESS).json({
				success: true,
				msg: ASSAYFINISHED_TABLEDATA.UPDATESUCCESS,
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

export default { get, post, getByid, deleteData, updateData };
