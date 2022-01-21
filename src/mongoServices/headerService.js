import { Types } from 'mongoose';
import { headerModel } from '../models';

const findOneQuery = async () => {
	const data = await headerModel.findOne();
	return data;
};

const updateOneQuery = async (filter, update, projection) => {
	let options = { new: true, fields: { ...projection } };

	const data = await headerModel.findOneAndUpdate(filter, update, options);
	return data;
};
const deleteOneQuery = async (filter) => {
	const data = await headerModel.findByIdAndDelete(filter);
	return data;
};
export default { findOneQuery, updateOneQuery, deleteOneQuery };
