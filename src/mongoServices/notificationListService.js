import { notificationModel } from '../models';
const findAllQuery = async () => {
	return await notificationModel.find({ is_read: false });
};
const findOneUpdateQuery = async (filter, update) => {
	return await notificationModel.updateOne(filter, update);
};
const findUpdateAllQuery = async () => {
	return await notificationModel.updateMany({ is_read: true });
};
export default { findAllQuery, findOneUpdateQuery, findUpdateAllQuery };
