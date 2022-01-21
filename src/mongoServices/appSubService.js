import { SubServiceModel } from '../models';
import { CONSTANTS } from '../constants';
const {
	ROLE: { DEVELOPER },
} = CONSTANTS;
const findAllQuery = async (query, role) => {
	let { search, _id, limit, page, sortField, sortValue } = query;
	let sort = {};
	let whereClause = role === DEVELOPER || !role ? {} : { is_deleted: false };
	if (sortField) {
		sort = {
			[sortField]: sortValue === 'ASC' ? 1 : -1,
		};
	} else {
		sort = {
			createAt: -1,
		};
	}
	if (search) {
		search = new RegExp(search, 'ig');
		whereClause = {
			$or: [{ name: search }, { description: search }],
		};
	}
	if (_id) {
		whereClause = { ...whereClause, _id };
	}
	const data = await SubServiceModel.find(whereClause)
		.skip(page > 0 ? +limit * (+page - 1) : 0)
		.limit(+limit || 20)
		.sort(sort);
	const totalCount = await SubServiceModel.find(whereClause).countDocuments();
	return { data, totalCount };
};

const updateOneQuery = async (filter, update, projection) => {
	let options = { new: true, fields: { ...projection } };

	const data = await SubServiceModel.findOneAndUpdate(filter, update, options);
	return data;
};

export default {
	findAllQuery,
	updateOneQuery,
};
