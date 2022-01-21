import { notificationTypeModel } from '../models';
const findAllQuery = async (query) => {
	let { search, _id, limit, page, sortField, sortValue } = query;
	let sort = {};
	let whereClause = {};
	if (sortField) {
		sort = {
			[sortField]: sortValue === 'ASC' ? 1 : -1,
		};
	} else {
		sort = {
			createdAt: -1,
		};
	}
	if (search) {
		search = new RegExp(search, 'ig');
		whereClause = { type: search };
	}
	if (_id) {
		whereClause = { ...whereClause, _id };
	}
	const data = await notificationTypeModel
		.find(whereClause)
		.skip(page > 0 ? +limit * (+page - 1) : 0)
		.limit(+limit || 20)
		.sort(sort);
	const totalCount = await notificationTypeModel
		.find(whereClause)
		.countDocuments();
	return { data, totalCount };
};

const deleteOneQuery = async (filter) => {
	const data = await notificationTypeModel.findByIdAndDelete(filter);
	return data;
};
const findOneUpdateQuery = async (filter, update, projection) => {
	let options = { new: true, fields: projection };

	const data = await notificationTypeModel.findOneAndUpdate(
		filter,
		update,
		options,
	);
	return data;
};
const fiUpdateQuery = async (filter, update, projection) => {
	let options = { new: true, fields: projection };

	const data = await notificationTypeModel.findOneAndUpdate(
		filter,
		update,
		options,
	);
	return data;
};
export default { findAllQuery, deleteOneQuery, findOneUpdateQuery };
