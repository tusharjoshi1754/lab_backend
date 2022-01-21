import { salonOwnerModel } from '../models';
const findAllQuery = async (query) => {
	let { search, _id, limit, page, sortField, sortValue, status } = query;
	let sort = {};
	let whereClause = {};
	if (status) {
		whereClause = { ...whereClause, status };
	}
	if (sortField) {
		sort = {
			[sortField]: sortValue === 'ASC' ? 1 : -1,
		};
	} else {
		sort = {
			rank: -1,
		};
	}
	if (search) {
		search = new RegExp(search, 'ig');
		whereClause = {
			$or: [{ title: search }, { details: search }],
		};
	}
	if (_id) {
		whereClause = { ...whereClause, _id };
	}
	const data = await salonOwnerModel
		.find(whereClause)
		.populate({
			path: 'salloneId',
			model: 'salone_App',
		})
		.skip(page > 0 ? +limit * (+page - 1) : 0)
		.limit(+limit || 20)
		.sort(sort);
	const totalCount = await salonOwnerModel.find(whereClause).countDocuments();
	return { data, totalCount };
};
const updateOneQuery = async (filter, update, projection) => {
	let options = { new: true, fields: { ...projection } };

	const data = await salonOwnerModel.findOneAndUpdate(filter, update, options);
	return data;
};

const deleteOneQuery = async (filter) => {
	const data = await salonOwnerModel.findByIdAndDelete(filter);
	return data;
};
export default { findAllQuery, updateOneQuery, deleteOneQuery };
