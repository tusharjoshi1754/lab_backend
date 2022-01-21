import { appModel } from '../models';
const get = async () => {
	const totalCount = await appModel.find().countDocuments();
	return totalCount;
};

export default {
	get,
};
