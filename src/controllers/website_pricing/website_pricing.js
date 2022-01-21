import { pricingModel } from '../../models';
import { featuresService, pricingService } from '../../mongoServices';
import { errorLogger } from '../../utils';
import { CONSTANTS } from '../../constants';
import { isValidObjectId, Types } from 'mongoose';
const {
	STATUS_CODE: { SUCCESS, FAILED },
	RESPONSE_MESSAGE: { PRICING, FEATURE, INVALIDOBJECTID, FAILEDRESPONSE },
} = CONSTANTS;

const createPricing = async (req, res) => {
	try {
		const findFeaturs = await featuresService.featuresValidation(
			req.body.features,
		);
		if (findFeaturs === false) {
			throw new Error(FEATURE.NOTFEATURES);
		}

		const priceModel = new pricingModel(req.body);
		const savePrice = priceModel.save();
		if (savePrice) {
			res.status(SUCCESS).send({
				success: true,
				msg: PRICING.CREATESUCCESS,
				data: [],
			});
		} else {
			throw new Error(PRICING.CREATEFAILED);
		}
	} catch (error) {
		errorLogger(error.message, req.originalUrl, req.ip);
		res.status(FAILED).json({
			success: false,
			error: error.message || FAILEDRESPONSE,
		});
	}
};

const getPricing = async (req, res) => {
	try {
		const { data, totalCount } = await pricingService.pricingfindAllQuery(
			req.query,
		);
		if (data) {
			res.status(SUCCESS).send({
				success: true,
				msg: FEATURE.GETSUCCESS,
				total: totalCount,
				data,
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
const updatePricing = async (req, res) => {
	try {
		const {
			params: { id },
		} = req;
		if (!isValidObjectId(id)) {
			throw new Error(INVALIDOBJECTID);
		}
		const findFeaturs = await featuresService.featuresValidation(
			req.body.features,
		);
		if (findFeaturs === false) {
			throw new Error(FEATURE.NOTFEATURES);
		}

		let filter = { _id: Types.ObjectId(id) };
		const { data } = await pricingService.pricingfindAllQuery(filter);
		if (data.length === 1) {
			let update = { ...req.body };
			const data = await pricingService.updateOneQuery(filter, update);
			if (data) {
				res.status(SUCCESS).send({
					success: true,
					msg: PRICING.UPDATESUCCESS,
					data,
				});
			} else {
				throw new Error(PRICING.UPDATEFAILED);
			}
		} else {
			throw new Error(PRICING.NOTPRICING);
		}
	} catch (error) {
		errorLogger(error.message, req.originalUrl, req.ip);
		res.status(FAILED).json({
			success: false,
			error: error.message || FAILEDRESPONSE,
		});
	}
};
const deletePricing = async (req, res) => {
	try {
		const {
			params: { id },
		} = req;
		if (!isValidObjectId(id)) {
			throw new Error(INVALIDOBJECTID);
		}
		const data = await pricingService.pricedeleteOneQuery(Types.ObjectId(id));
		if (data) {
			res.status(SUCCESS).send({
				success: true,
				msg: NOTPRICING.DELETESUCCESS,
				data: [],
			});
		} else {
			throw new Error(NOTPRICING.DELETEFAILED);
		}
	} catch (error) {
		errorLogger(error.message, req.originalUrl, req.ip);
		res.status(FAILED).json({
			success: false,
			error: error.message || FAILEDRESPONSE,
		});
	}
};
export default { createPricing, getPricing, updatePricing, deletePricing };
