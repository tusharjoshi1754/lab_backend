import { callBackModel } from '../models';
const callbackfindAllQuery = async (query) => {
	let { search, _id, limit, page, sortField, sortValue } = query;
	let sort = {};
	let whereClause = {};
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
			$or: [{ question: search }, { answer: search }],
		};
	}
	if (_id) {
		whereClause = { ...whereClause, _id };
	}
	const data = await callBackModel
		.find(whereClause)
		.skip(page > 0 ? +limit * (+page - 1) : 0)
		.limit(+limit || 20)
		.sort(sort);
	const totalCount = await callBackModel.find(whereClause).countDocuments();
	return { data, totalCount };
};

const updateOneQuery = async (filter, update, projection) => {
	let options = { new: true, fields: { ...projection } };

	const data = await callBackModel.findOneAndUpdate(filter, update, options);
	return data;
};
const callbackdeleteOneQuery = async (filter) => {
	const data = await callBackModel.findByIdAndDelete(filter);
	return data;
};
export default {
	callbackfindAllQuery,
	updateOneQuery,
	callbackdeleteOneQuery,
};
