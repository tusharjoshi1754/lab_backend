import { Types } from 'mongoose';
import { footerModel } from '../models';

const findOneQuery = async () => {
	const data = await footerModel.findOne();
	return data;
};

const updateOneQuery = async (filter, update, projection) => {
	let options = { new: true, fields: { ...projection } };

	const data = await footerModel.findOneAndUpdate(filter, update, options);
	return data;
};
const deleteOneQuery = async (filter) => {
	const data = await footerModel.findByIdAndDelete(filter);
	return data;
};
export default { findOneQuery, updateOneQuery, deleteOneQuery };
