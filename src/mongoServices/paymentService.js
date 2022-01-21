import { CONSTANTS } from '../constants';
import { paymentModel } from '../models';
const {
	ROLE: { DEVELOPER },
} = CONSTANTS;

const findAllQuery = async (query) => {
	console.log(`query`, query);
	let { search, _id, limit, page, sortField, sortValue } = query;
	let sort = {};
	let whereClause = {};

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
			$or: [
				{ orderId: search },
				{ amount: search },
				{ paymentId: search },
				{ status: search },
			],
		};
	}
	if (_id) {
		whereClause = { ...whereClause, _id };
	}
	const data = await paymentModel
		.find(whereClause)
		.skip(page > 0 ? +limit * (+page - 1) : 0)
		.limit(+limit || 20)
		.sort(sort);
	const totalCount = await paymentModel.find(whereClause).countDocuments();
	return { data, totalCount };
};

export default {
	findAllQuery,
};
