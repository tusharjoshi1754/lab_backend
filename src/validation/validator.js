import * as Joi from 'joi';
import { func } from 'joi';

import { validateRequest } from '../middleware';

function headerValidator(req, res, next) {
	const schema = Joi.object({
		title: Joi.string().required(),
		subtitle: Joi.string().required(),
		description: Joi.string().required(),
		appStoreLink: Joi.string().required(),
		playStoreLink: Joi.string().required(),
	});
	validateRequest(req, res, next, schema);
}
function featureValidator(req, res, next) {
	const schema = Joi.object({
		title: Joi.string().required(),
		subtitle: Joi.string().required(),
		description: Joi.string().required(),
		rank: Joi.number().required(),
		image: Joi.string().required(),
	});
	validateRequest(req, res, next, schema);
}
function priceValidator(req, res, next) {
	const schema = Joi.object({
		title: Joi.string().required(),
		features: Joi.array().required(),
		description: Joi.string().required(),
		price: Joi.number().required(),
		image: Joi.string().required(),
	});
	validateRequest(req, res, next, schema);
}

function callBackValidator(req, res, next) {
	const schema = Joi.object({
		content: Joi.string().required(),
	});
	validateRequest(req, res, next, schema);
}

const socialMediaSchema = Joi.object().keys({
	facebook: Joi.string().default(null),
	linkedin: Joi.string().default(null),
	twitter: Joi.string().default(null),
	instagram: Joi.string().default(null),
});

function aboutValidator(req, res, next) {
	const schema = Joi.object({
		address: Joi.string().required(),
		contact: Joi.string().required(),
		email: Joi.string().email().required(),
		socialMediaLinks: socialMediaSchema,
	});
	validateRequest(req, res, next, schema);
}
function permissionsValidator(req, res, next) {
	const schema = Joi.object({
		path: Joi.string().required(),
		displayName: Joi.string().required(),
	});
	validateRequest(req, res, next, schema);
}
function roleValidator(req, res, next) {
	const schema = Joi.object({
		name: Joi.string().required(),
		permissions: Joi.array().required(),
	});
	validateRequest(req, res, next, schema);
}

function adminUserValidation(req, res, next) {
	const schema = Joi.object({
		name: Joi.string().required(),
		email: Joi.string().email().required(),
		role: Joi.string().required(),
		profileImage: Joi.string().optional(),
	});
	validateRequest(req, res, next, schema);
}
function adminUserLoginValidation(req, res, next) {
	const schema = Joi.object({
		email: Joi.string().email().required(),
		password: Joi.string().required(),
	});
	validateRequest(req, res, next, schema);
}
function adminUserUpdateValidation(req, res, next) {
	const schema = Joi.object({
		name: Joi.string().required(),
		role: Joi.string().required(),
		profileImage: Joi.string().optional(),
	});
	validateRequest(req, res, next, schema);
}
function adminUserPasswordChangeValidation(req, res, next) {
	const schema = Joi.object({
		oldPassword: Joi.string().required(),
		newPassword: Joi.string().required(),
	});
	validateRequest(req, res, next, schema);
}
function termsConditionValidator(req, res, next) {
	const schema = Joi.object({
		content: Joi.string().required(),
	});
	validateRequest(req, res, next, schema);
}
function supportTicketValidation(req, res, next) {
	const schema = Joi.object({
		title: Joi.string().required(),
		details: Joi.string().required(),
		ownerId: Joi.string().required(),
	});
	validateRequest(req, res, next, schema);
}
function supportTicketUpdateValidation(req, res, next) {
	const schema = Joi.object({
		status: Joi.string().required(),
		rejectReason: Joi.string(),
	});
	validateRequest(req, res, next, schema);
}
function forgetPasswordValidation(req, res, next) {
	const schema = Joi.object({
		email: Joi.string().email().required(),
	});
	validateRequest(req, res, next, schema);
}
function resetPasswordValidation(req, res, next) {
	const schema = Joi.object({
		email: Joi.string().email().required(),
		newPassword: Joi.string().required(),
	});
	validateRequest(req, res, next, schema);
}
function notificationTypeValidation(req, res, next) {
	const schema = Joi.object({
		type: Joi.string().required('Notification Type is required'),
		key: Joi.string().required('Notification Type is required'),
	});
	validateRequest(req, res, next, schema);
}
function appModelValidation(req, res, next) {
	const schema = Joi.object({
		name: Joi.string().required(),
		description: Joi.string().required(),
	});
	validateRequest(req, res, next, schema);
}
function appMainServiceValidation(req, res, next) {
	const schema = Joi.object({
		name: Joi.string().required(),
		description: Joi.string().required(),
		image: Joi.string().optional(),
	});
	validateRequest(req, res, next, schema);
}
function appSubServiceValidation(req, res, next) {
	const schema = Joi.object({
		name: Joi.string().required(),
		description: Joi.string().required(),
		image: Joi.string().optional(),
		serviceId: Joi.string().required(),
		time: Joi.number().precision(2).required(),
		price: Joi.number().precision(2).required(),
	});
	validateRequest(req, res, next, schema);
}
function adminProductValidation(req, res, next) {
	const schema = Joi.object({
		name: Joi.string().required(),
		description: Joi.string().required(),
		price: Joi.number().precision(2).required(),
	});
	validateRequest(req, res, next, schema);
}

function createOrderValidation(req, res, next) {
	const schema = Joi.object({
		productId: Joi.string().required(),
		qty: Joi.string().required(),
	});
	validateRequest(req, res, next, schema);
}

function createPaymentValidation(req, res, next) {
	const schema = Joi.object({
		method: Joi.string().required(),
		paymentId: Joi.string().required(),
		orderId: Joi.string().required(),
	});
	validateRequest(req, res, next, schema);
}

function createFieldsValidation(req, res, next) {
	const schema = Joi.object({
		userid: Joi.string().required(),
		fieldName: Joi.string().required(),
		Datatypeid: Joi.string().required(),
		bgColor: Joi.string().required(),
		title: Joi.string().required(),
		variant: Joi.string().required(),
	});
	validateRequest(req, res, next, schema);
}
function updateFieldsValidation(req, res, next) {
	const schema = Joi.object({
		id: Joi.string().required(),
		userid: Joi.string().required(),
		fieldName: Joi.string().required(),
		Datatypeid: Joi.string().required(),
		bgColor: Joi.string().required(),
		title: Joi.string().required(),
		variant: Joi.string().required(),
	});
	validateRequest(req, res, next, schema);
}
function createFormValidation(req, res, next) {
	const schema = Joi.object({
		userid: Joi.string().required(),
		formName: Joi.string().required(),
		form_Type: Joi.string().required(),
	});
	validateRequest(req, res, next, schema);
}
function createSectionValidation(req, res, next) {
	const schema = Joi.object({
		userid: Joi.string().required(),
		fieldId: Joi.array().required(),
		title: Joi.string().required(),
		subtitle: Joi.string().required(),
		description: Joi.string().required(),
		content: Joi.string().required(),
		formId: Joi.string().required(),
		type: Joi.string().required(),
	});
	validateRequest(req, res, next, schema);
}
function createAssayFinishedValidation(req, res, next) {
	const schema = Joi.object({
		ObjectField: Joi.array().required(),
		ObjectValue: Joi.array().required(),
		userid: Joi.string().required(),
		formId: Joi.string().required(),
	});
	validateRequest(req, res, next, schema);
}
function updateAssayFinishedValidation(req, res, next) {
	const schema = Joi.object({
		id: Joi.string().required(),
		ObjectField: Joi.array().required(),
		ObjectValue: Joi.array().required(),
		userid: Joi.string().required(),
		formId: Joi.string().required(),
	});
	validateRequest(req, res, next, schema);
}
function updateSectionValidation(req, res, next) {
	const schema = Joi.object({
		id: Joi.string().required(),
		userid: Joi.string().required(),
		fieldId: Joi.array().required(),
		title: Joi.string().required(),
		subtitle: Joi.string().required(),
		description: Joi.string().required(),
		content: Joi.string().required(),
		formId: Joi.string().required(),
		type: Joi.string().required(),
	});
	validateRequest(req, res, next, schema);
}
function updateFormValidation(req, res, next) {
	const schema = Joi.object({
		id: Joi.string().required(),
		userid: Joi.string().required(),
		formName: Joi.string().required(),
		form_Type: Joi.string().required(),
	});
	validateRequest(req, res, next, schema);
}

export default {
	headerValidator,
	featureValidator,
	priceValidator,
	callBackValidator,
	aboutValidator,
	permissionsValidator,
	roleValidator,
	adminUserValidation,
	adminUserLoginValidation,
	adminUserUpdateValidation,
	adminUserPasswordChangeValidation,
	termsConditionValidator,
	supportTicketValidation,
	supportTicketUpdateValidation,
	forgetPasswordValidation,
	resetPasswordValidation,
	notificationTypeValidation,
	appModelValidation,
	appMainServiceValidation,
	appSubServiceValidation,
	adminProductValidation,
	createOrderValidation,
	createPaymentValidation,
	createFieldsValidation,
	updateFieldsValidation,
	createFormValidation,
	updateFormValidation,
	createSectionValidation,
	updateSectionValidation,
	createAssayFinishedValidation,
	updateAssayFinishedValidation,
};
