import { mailLoggerModel } from '../models';
const getMailLog = async (query) => {
	let { search, _id, limit, page, sortField, sortValue, email, subject } =
		query;
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
		whereClause = {
			$or: [
				{ from: search },
				{ to: search },
				{ subject: search },
				{ status: search },
			],
		};
	}
	if (_id) {
		whereClause = { ...whereClause, _id };
	}
	if (email) {
		whereClause = { ...whereClause, to: email, subject };
	}
	const data = await mailLoggerModel
		.find(whereClause)
		.skip(page > 0 ? +limit * (+page - 1) : 0)
		.limit(+limit || 20)
		.sort(sort);
	const totalCount = await mailLoggerModel.find(whereClause).countDocuments();
	return { data, totalCount };
};

const deleteOneQuery = async (filter) => {
	const data = await mailLoggerModel.findByIdAndDelete(filter);
	return data;
};
export default { getMailLog, deleteOneQuery };
