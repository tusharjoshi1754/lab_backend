import { adminUserModel } from '../../models';
import { adminUserService } from '../../mongoServices';
import { CONSTANTS } from '../../constants';
import {
	errorLogger,
	generatePassword,
	hashPassword,
	sendMail,
	comparePassword,
	jwtGenerate,
	notification,
} from '../../utils';
import { isValidObjectId } from 'mongoose';
import fileUpload from '../s3';
const {
	RESPONSE_MESSAGE: { ADMINUSER, FAILEDRESPONSE, INVALIDOBJECTID },
	STATUS_CODE: { SUCCESS, FAILED },
	MAILSUBJECT: { REGISTERMAIL, FORGETPASSWORDEMAIL },
} = CONSTANTS;
const adminUserCreate = async (req, res) => {
	try {
		console.log(req);
		var profileImage = req.files.profile_image.name.replace(/\..+$/, '');
		var location = await fileUpload(req.files.profile_image.data, profileImage);
		console.log(`location`, location);
		// const { email, name } = req.body;
		// const checkExistingUser = await adminUserService.userQuery({
		// 	email,
		// 	name,
		// 	orQuery: true,
		// });
		// if (checkExistingUser) {
		// 	throw new Error(ADMINUSER.USERAVAILABLE);
		// }
		// const passwordGenerate = generatePassword();
		// const { hashedPassword, salt } = await hashPassword(passwordGenerate);
		// const insetObj = {
		// 	...req.body,
		// 	hashedPassword,
		// 	salt,
		// };

		// const adminUserSave = new adminUserModel(insetObj);
		// const saveResponse = await adminUserSave.save();
		// if (saveResponse) {
		// 	const html = `
		// 	Hello ${saveResponse?.name} ,
		// 		Password: ${passwordGenerate}`;

		// 	// Send Confirm Account Email
		// 	const sendEmail = await sendMail(
		// 		email,
		// 		process.env.SENDGRID_EMAIL,
		// 		REGISTERMAIL,
		// 		html,
		// 	);
		// 	if (sendEmail[0].statusCode != 202) {
		// 		throw new Error('mail is not send');
		// 	}
		res.status(SUCCESS).send({
			success: true,
			msg: ADMINUSER.CREATESUCCESS,
			data: [],
		});
		// } else {
		// 	throw new Error(ADMINUSER.CREATEFAILED);
		// }
	} catch (error) {
		errorLogger(error.message, req.originalUrl, req.ip);
		res.status(FAILED).json({
			success: false,
			error: error.message || FAILEDRESPONSE,
		});
	}
};

const adminUserLogin = async (req, res) => {
	try {
		const { email, password } = req.body;
		console.log('req.body', req.body);
		const checkExistingUser = await adminUserService.userQuery({
			email,
			populate: true,
		});
		console.log('checkExistingUser', checkExistingUser);
		// check user is exist or not
		if (!checkExistingUser) {
			throw new Error(ADMINUSER.NOTADMINUSER);
		}
		// check user attribitue
		if (
			checkExistingUser.isEnabled === false ||
			checkExistingUser.deletedAt != null
		) {
			throw new Error(ADMINUSER.LOGINSUSSPEND);
		}
		const verifyPassword = await comparePassword(
			password,
			checkExistingUser?.hashedPassword,
		);
		if (!verifyPassword) throw new Error('Email or Password is incorrect');

		const token = await jwtGenerate(
			checkExistingUser?._id,
			process.env.JWT_EXPIRY,
		);

		res.status(200).send({
			success: true,
			data: { ...checkExistingUser._doc, token },
			msg: ` Login Successfully`,
		});
	} catch (error) {
		errorLogger(error.message, req.originalUrl, req.ip);
		res.status(FAILED).json({
			success: false,
			error: error.message || FAILEDRESPONSE,
		});
	}
};

const adminUserList = async (req, res) => {
	try {
		const { data, totalCount } = await adminUserService.findAllQuery(req.query);
		if (data) {
			res.status(SUCCESS).send({
				success: true,
				msg: ADMINUSER.GETSUCCESS,
				total: totalCount,
				data,
			});
		} else {
			throw new Error(ADMINUSER.GETFAILED);
		}
	} catch (error) {
		errorLogger(error.message, req.originalUrl, req.ip);
		res.status(FAILED).json({
			success: false,
			error: error.message || FAILEDRESPONSE,
		});
	}
};
const adminUserUpdate = async (req, res) => {
	try {
		const {
			params: { id },
		} = req;
		if (!isValidObjectId(id)) {
			throw new Error(INVALIDOBJECTID);
		}
		let filter = { _id: id };
		const { data } = await adminUserService.findAllQuery(filter);
		if (data.length != 1) throw new Error(ADMINUSER.NOTADMINUSER);

		if (data[0].role.name === 'SUPER_USER') {
			throw new Error('Super User cannot update');
		} else {
			let update = { ...req.body };
			const updateAdminUser = await adminUserService.updateOneQuery(
				filter,
				update,
			);
			if (!updateAdminUser) throw new Error(ADMINUSER.UPDATEFAILED);
			res.status(SUCCESS).json({
				success: true,
				message: ADMINUSER.UPDATESUCCESS,
				data: [],
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

const adminUserStatus = async (req, res) => {
	try {
		const {
			params: { id },
		} = req;
		if (!isValidObjectId(id)) {
			throw new Error(INVALIDOBJECTID);
		}
		let filter = { _id: id };
		const { data } = await adminUserService.findAllQuery(filter);
		if (data.length != 1) throw new Error(ADMINUSER.NOTADMINUSER);

		if (data[0].role.name === 'SUPER_USER') {
			throw new Error('Super User cannot update');
		} else {
			let update = { isEnabled: data[0].isEnabled === true ? false : true };
			const updateAdminUser = await adminUserService.updateOneQuery(
				filter,
				update,
			);
			if (!updateAdminUser) throw new Error('status is not updated');
			res.status(SUCCESS).send({
				success: true,
				msg: 'status update successfully',
				data: [],
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
const adminUserDelete = async (req, res) => {
	try {
		const {
			params: { id },
		} = req;
		if (!isValidObjectId(id)) {
			throw new Error(INVALIDOBJECTID);
		}
		let filter = { _id: id };
		const { data } = await adminUserService.findAllQuery(filter);
		if (data.length != 1) throw new Error(ADMINUSER.NOTADMINUSER);

		if (data[0].role.name === 'SUPER_USER') {
			throw new Error('Super User cannot update');
		} else {
			let update = { deletedAt: new Date() };
			const updateAdminUser = await adminUserService.updateOneQuery(
				filter,
				update,
			);
			if (!updateAdminUser) throw new Error('status is not updated');
			res.status(SUCCESS).send({
				success: true,
				msg: 'status update successfully',
				data: [],
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
const adminUserChangePassword = async (req, res) => {
	try {
		const {
			currentUser: { _id },
			body: { oldPassword, newPassword },
		} = req;

		let filter = { _id };
		const { data } = await adminUserService.findAllQuery(filter);
		if (data.length != 1) throw new Error(ADMINUSER.NOTADMINUSER);

		const comparePass = await comparePassword(
			oldPassword,
			data[0].hashedPassword,
		);
		if (comparePass) {
			const { salt, hashedPassword } = await hashPassword(newPassword);
			let updateObj = {
				salt,
				hashedPassword,
				firstLogin: false,
			};
			const passwordChange = await adminUserService.updateOneQuery(
				filter,
				updateObj,
			);
			if (passwordChange) {
				await notification.createNotification('changePassword', data);
				res.status(SUCCESS).send({
					success: true,
					msg: ADMINUSER.PASSWORDCHANGED,
					data: [],
				});
			} else {
				throw new Error(ADMINUSER.PASSWORDNOTCHANGED);
			}
		} else {
			throw new Error('Password is invalid');
		}
	} catch (error) {
		errorLogger(error.message, req.originalUrl, req.ip);
		res.status(FAILED).json({
			success: false,
			error: error.message || FAILEDRESPONSE,
		});
	}
};
const forgetPassword = async (req, res) => {
	try {
		const { email } = req.body;
		const checkExistingUser = await adminUserService.userQuery({
			email,
		});
		console.log('checkExistingUser', checkExistingUser);
		if (!checkExistingUser) {
			throw new Error(ADMINUSER.USERNOTAVAILABLE);
		} else {
			const token = await jwtGenerate(
				checkExistingUser?.email,
				process.env.FORGET_TOKEN_EXPITY,
			);
			const html = `
			Hello ${checkExistingUser?.name} ,
				please use this link to <a href=${process.env.FRONTEND_URL}forgetPassword?token=${token} target="_blank">reset password </a>`;

			// Send Confirm Account Email
			const sendEmail = await sendMail(
				email,
				process.env.SENDGRID_EMAIL,
				FORGETPASSWORDEMAIL,
				html,
			);
			if (sendEmail[0].statusCode != 202) {
				throw new Error('mail is not send');
			}
			res.status(SUCCESS).send({
				success: true,
				msg: 'Mail send successfully',
				data: [],
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
const resetPassword = async (req, res) => {
	try {
		const {
			currentUser: { _id },
		} = req;
		const { newPassword } = req.body;

		let filter = { _id };
		const { salt, hashedPassword } = await hashPassword(newPassword);
		let update = {
			salt,
			hashedPassword,
			firstLogin: false,
		};
		const updateAdminUser = await adminUserService.updateOneQuery(
			filter,
			update,
		);
		if (updateAdminUser) {
			res.status(SUCCESS).json({
				success: false,
				msg: 'error.message || FAILEDRESPONSE',
			});
		} else {
			throw new Error('password changeing failed');
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
	adminUserCreate,
	adminUserLogin,
	adminUserList,
	adminUserUpdate,
	adminUserStatus,
	adminUserDelete,
	adminUserChangePassword,
	forgetPassword,
	resetPassword,
};
