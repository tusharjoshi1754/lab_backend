import {
	adminUserService,
	SectionSubService,
	FieldsSubService,
} from '../../mongoServices';
import { Section, Fields, Forms, AssayFinished_tabledata } from '../../models';
import { errorLogger } from '../../utils';
import { CONSTANTS } from '../../constants';
import { Types } from 'mongoose';
const {
	STATUS_CODE: { SUCCESS, FAILED, FIELDS },
	RESPONSE_MESSAGE: { DATATYPE, FAILEDRESPONSE, ADMINUSER, SECTION },
} = CONSTANTS;

const get = async (req, res) => {
	try {
		const appCount = await SectionSubService.get();
		if (appCount.length >= 1) {
			res.status(SUCCESS).json({
				success: true,
				msg: SECTION.GETSUCCESS,
				data: appCount,
			});
		} else {
			res.status(SUCCESS).json({
				success: true,
				msg: SECTION.GETFAILED,
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
		if (req.body.fieldId) {
			const finddata = await Fields.find({
				_id: {
					$in: req.body.fieldId,
				},
			});
			if (finddata) {
				req.body.createdBy = id;
				var data = {
					...req.body,
				};
				const DataSave = new Section(data);
				const saveResponse = await DataSave.save();
				if (saveResponse) {
					res.status(SUCCESS).json({
						success: true,
						msg: SECTION.CREATESUCCESS,
						data: saveResponse,
					});
				}
			} else {
				res.status(SUCCESS).json({
					success: false,
					msg: FIELDS.GETFAILED,
					data: saveResponse,
				});
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
		var formData = [];
		const data = await SectionSubService.FindById(id);

		if (data) {
			const fid = data.formId.map((x) => Types.ObjectId(x));
			const formRecord = await Forms.find({
				_id: {
					$in: fid,
				},
			});
			formData.push(formRecord);
		}
		var outputData = await findFieldData(formData[0]);

		var mainData = {
			SectionData: data,
			FieldDataAndFroms: outputData,
		};
		if (!mainData) {
			res.status(FAILED).json({
				success: false,
				msg: SECTION.GETFAILED,
			});
		} else {
			res.status(SUCCESS).json({
				success: true,
				msg: SECTION.GETSUCCESS,
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
const deleteSection = async (req, res) => {
	try {
		const { id } = req.query;
		const data = await SectionSubService.deleteOneQuery(id, req.query.userid);
		if (data) {
			res.status(SUCCESS).send({
				success: true,
				msg: SECTION.DELETESUCCESS,
				data: [],
			});
		} else {
			throw new Error(SECTION.DELETEFAILED);
		}
	} catch (error) {
		errorLogger(error.message, req.originalUrl, req.ip);
		res.status(FAILED).json({
			success: false,
			error: error.message || FAILEDRESPONSE,
		});
	}
};
const updateSection = async (req, res) => {
	try {
		const { id } = req.body;
		const data = await SectionSubService.FindById({ _id: id });
		if (!data) {
			res.status(FAILED).json({
				success: false,
				msg: SECTION.UPDATEFAILED,
			});
		} else {
			const updateData = await SectionSubService.FindByIdAndUpdate(
				id,
				req.body,
			);
			res.status(SUCCESS).json({
				success: true,
				msg: SECTION.UPDATESUCCESS,
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
const findFieldData = async (data) => {
	var outMainDAta = data.map(async (data) => {
		const map1 = await data.fieldId.map((x) => Types.ObjectId(x));
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
		let mainData = [];
		const tableValue = await AssayFinished_tabledata.find({
			$and: [
				{
					formId: {
						$in: Types.ObjectId(data._id),
					},
				},
				{ isEnabled: true },
			],
		});
		tableValue.map((element) => {
			var id = element._id;
			if (element.ObjectValue) {
				element.ObjectValue[0].sectionId = id;
			}
			mainData.push(element);
		});
		return { formData: data, FieldData: finddata, TableData: mainData };
	});
	var testdata = await Promise.all(outMainDAta);

	if (testdata.length != 0) {
		return testdata;
	} else {
		return false;
	}
};

export default { get, post, getByid, updateSection, deleteSection };
