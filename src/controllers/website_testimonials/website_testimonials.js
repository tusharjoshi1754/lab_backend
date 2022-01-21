import { errorLogger } from '../../utils';
import { CONSTANTS } from '../../constants';
import { isValidObjectId, Types } from 'mongoose';
import { testimonialsModel } from '../../models';
import { testimonialService } from '../../mongoServices';
const {
	STATUS_CODE: { SUCCESS, FAILED },
	RESPONSE_MESSAGE: { TESTIMONIAL, INVALIDOBJECTID, FAILEDRESPONSE },
} = CONSTANTS;
const createTestimonial = async (req, res) => {
	try {
		const testimonial = new testimonialsModel(req.body);
		const saveTestimonial = testimonial.save();
		if (saveTestimonial) {
			res.status(SUCCESS).json({
				success: true,
				msg: TESTIMONIAL.CREATESUCCESS,
			});
		} else {
			throw new Error(TESTIMONIAL.CREATEFAILED);
		}
	} catch (error) {
		errorLogger(error.message, req.originalUrl, req.ip);
		res.status(FAILED).json({
			success: false,
			error: error.message || FAILEDRESPONSE,
		});
	}
};
const getAllTestimonial = async (req, res) => {
	try {
		const { data, totalCount } =
			await testimonialService.testimonialfindAllQuery(req.query);
		if (data) {
			res.status(SUCCESS).send({
				success: true,
				msg: TESTIMONIAL.GETSUCCESS,
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
const updateTestimonial = async (req, res) => {
	try {
		const {
			params: { id },
		} = req;
		if (!isValidObjectId(id)) {
			throw new Error(INVALIDOBJECTID);
		}
		let filter = { _id: Types.ObjectId(id) };
		const { data } = await testimonialService.testimonialfindAllQuery(filter);
		if (data.length === 1) {
			let update = { ...req.body };
			const data = await testimonialService.updateOneQuery(filter, update);
			if (data) {
				res.status(SUCCESS).send({
					success: true,
					msg: TESTIMONIAL.UPDATESUCCESS,
					data,
				});
			} else {
				throw new Error(TESTIMONIAL.UPDATEFAILED);
			}
		} else {
			throw new Error(TESTIMONIAL.NOTTESTIMONIAL);
		}
	} catch (error) {
		errorLogger(error.message, req.originalUrl, req.ip);
		res.status(FAILED).json({
			success: false,
			error: error.message || FAILEDRESPONSE,
		});
	}
};
const deleteTestimonial = async (req, res) => {
	try {
		const {
			params: { id },
		} = req;
		if (!isValidObjectId(id)) {
			throw new Error(INVALIDOBJECTID);
		}
		const data = await testimonialService.testimonialdeleteOneQuery(
			Types.ObjectId(id),
		);
		if (data) {
			res.status(SUCCESS).send({
				success: true,
				msg: TESTIMONIAL.DELETESUCCESS,
				data: [],
			});
		} else {
			throw new Error(TESTIMONIAL.DELETEFAILED);
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
	createTestimonial,
	getAllTestimonial,
	updateTestimonial,
	deleteTestimonial,
};
