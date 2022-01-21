import { notificationModel, notificationTypeModel } from '../models';
const createNotification = async (type, field) => {
	let filter = { key: type };
	const findNotificationType = await notificationTypeModel.findOne(filter);

	let details = findNotificationType?.type.replace(
		'{username}',
		field[0]?.name,
	);
	if (findNotificationType) {
		const notificationData = {
			type: findNotificationType._id,
			details,
		};
		const notification = new notificationModel(notificationData);
		await notification.save();
	}
	return true;
};

export default { createNotification };
