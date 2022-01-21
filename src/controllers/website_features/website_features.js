import { featuresModel } from '../../models';
import { featuresService } from '../../mongoServices';
import { errorLogger } from '../../utils';
import { CONSTANTS } from '../../constants';
import { isValidObjectId } from 'mongoose';
import { update } from '../../models/website_header';
const {
	STATUS_CODE: { SUCCESS, FAILED },
	RESPONSE_MESSAGE: { FEATURE, INVALIDOBJECTID, FAILEDRESPONSE },
} = CONSTANTS;

const createFeature = async (req, res) => {
	try {
		let { rank } = req.body;
		let payload;

		const { data: featureAll } = await featuresService.featuresfindAllQuery({});
		let updatedrank = featureAll[0].rank + 1;
		payload = {
			...req.body,
			rank: updatedrank,
		};
		const fetSave = new featuresModel(payload);
		const saveResponse = await fetSave.save();

		if (saveResponse) {
			res.status(200).json({
				success: true,
				message: FEATURE.CREATESUCCESS,
				data: [],
			});
		} else {
			throw new Error(FEATURE.CREATEFAILED);
		}
	} catch (error) {
		console.log(`error`, error);
		errorLogger(error.message, req.originalUrl, req.ip);
		res.status(FAILED).json({
			success: false,
			error: error.message || FAILEDRESPONSE,
		});
	}
};

const getFeature = async (req, res) => {
	try {
		const { data, totalCount } = await featuresService.featuresfindAllQuery(
			req.query,
		);
		if (featuresService) {
			res.status(SUCCESS).send({
				success: true,
				msg: FEATURE.GETSUCCESS,
				data,
				total: totalCount,
			});
		} else {
			throw new Error(FEATURE.GETFAILED);
		}
	} catch (error) {
		errorLogger(error.message, req.originalUrl, req.ip);
		res.status(FAILED).json({
			success: false,
			error: error.message || FAILEDRESPONSE,
		});
	}
};
const deleteFeature = async (req, res) => {
	try {
		const {
			params: { id },
		} = req;
		if (!isValidObjectId(id)) {
			throw new Error(INVALIDOBJECTID);
		}
		const data = await featuresService.featuresdeleteOneQuery(id);
		if (data) {
			res.status(SUCCESS).send({
				success: true,
				msg: FEATURE.DELETESUCCESS,
				data: [],
			});
		} else {
			throw new Error(FEATURE.DELETEFAILED);
		}
	} catch (error) {
		errorLogger(error.message, req.originalUrl, req.ip);
		res.status(FAILED).json({
			success: false,
			error: error.message || FAILEDRESPONSE,
		});
	}
};

const updateFeature = async (req, res) => {
	try {
		const {
			params: { id },
		} = req;
		const { rank: updatedRank } = req.body;
		if (!isValidObjectId(id)) {
			throw new Error(INVALIDOBJECTID);
		}
		let updateResponse;

		const { data: findfeatures } = await featuresService.featuresfindAllQuery({
			_id: id,
		});

		if (findfeatures.length === 1) {
			let fet,
				currentRank = findfeatures[0]?.rank;

			if (findfeatures[0].rank < updatedRank) {
				fet = await featuresModel
					.find({})
					.where({ rank: { $gte: currentRank, $lte: updatedRank } });
				for (let i = 0; i < fet.length; i++) {
					fet[i].rank--;

					let update = fet[i]._id == id ? { ...req.body } : { ...fet[i] },
						filter = { _id: fet[i]._id };

					await featuresService.featuresFindOneUpdateQuery(filter, update);
				}
			}
			if (findfeatures[0].rank > updatedRank) {
				fet = await featuresModel.find({
					rank: { $gte: updatedRank, $lte: currentRank },
				});
				for (let i = 0; i < fet.length; i++) {
					fet[i].rank++;

					let update = fet[i]._id == id ? { ...req.body } : { ...fet[i] },
						filter = { _id: fet[i]._id };

					await featuresService.featuresFindOneUpdateQuery(filter, update);
				}
			}

			res.status(200).json({
				success: true,
				message: FEATURE.UPDATESUCCESS,
			});
		} else {
			throw new Error(FEATURE.NOTFEATURES);
		}
	} catch (error) {
		errorLogger(error.message, req.originalUrl, req.ip);
		res.status(FAILED).json({
			success: false,
			error: error.message || FAILEDRESPONSE,
		});
	}
};

export default { createFeature, getFeature, deleteFeature, updateFeature };
