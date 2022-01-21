import { privacyPolicyModel } from '../models';
const findOneQuery = async () => {
	const data = await privacyPolicyModel.findOne();

	return data;
};

const updateOneQuery = async (filter, update, projection) => {
	let options = { new: true, fields: { ...projection } };

	const data = await privacyPolicyModel.findOneAndUpdate(
		filter,
		update,
		options,
	);
	return data;
};
const deleteOneQuery = async (filter) => {
	const data = await privacyPolicyModel.findByIdAndDelete(filter);
	return data;
};
export default {
	findOneQuery,
	updateOneQuery,
	deleteOneQuery,
};
