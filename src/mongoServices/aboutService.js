import { aboutModel } from '../models';
const aboutfindAllQuery = async (query) => {
	let { search, _id, limit, page, sortField, sortValue } = query;
	let sort = {};
	let whereClause = {};
	if (sortField) {
		sort = {
			[sortField]: sortValue === 'ASC' ? 1 : -1,
		};
	} else {
		sort = {
			createdAt: 1,
		};
	}
	if (search) {
		search = new RegExp(search, 'ig');
		whereClause = {
			$or: [{ address: search }, { contact: search }, { email: search }],
		};
	}
	if (_id) {
		whereClause = { ...whereClause, _id };
	}
	const data = await aboutModel
		.find(whereClause)
		.skip(page > 0 ? +limit * (+page - 1) : 0)
		.limit(+limit || 20)
		.sort(sort);
	const totalCount = await aboutModel.find(whereClause).countDocuments();
	return { data, totalCount };
};

const updateOneQuery = async (filter, update, projection) => {
	let options = { new: true, fields: { ...projection } };

	const data = await aboutModel.findOneAndUpdate(filter, update, options);
	return data;
};
const deleteOneQuery = async (filter) => {
	const data = await aboutModel.findByIdAndDelete(filter);
	return data;
};
export default {
	aboutfindAllQuery,
	updateOneQuery,
	deleteOneQuery,
};
