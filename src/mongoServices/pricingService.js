import { pricingModel } from '../models';
const pricingfindAllQuery = async (query) => {
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
		let rankSearch = {};
		//  search with number Attribitue
		if (parseInt(search)) {
			rankSearch = { rank: +search };
		}
		search = new RegExp(search, 'ig');
		whereClause = {
			$or: [
				{ title: search },
				{ subtitle: search },
				{ description: search },
				rankSearch,
			],
		};
	}
	if (_id) {
		whereClause = { ...whereClause, _id };
	}
	const data = await pricingModel
		.find(whereClause)
		.populate({
			path: 'features',
			model: 'Website_Features',
		})
		.skip(page > 0 ? +limit * (+page - 1) : 0)
		.limit(+limit || 20)
		.sort(sort);
	const totalCount = await pricingModel.find(whereClause).countDocuments();
	return { data, totalCount };
};
const updateOneQuery = async (filter, update, projection) => {
	let options = { new: true, fields: { ...projection } };

	const data = await pricingModel.findOneAndUpdate(filter, update, options);
	return data;
};

const pricedeleteOneQuery = async (filter) => {
	const data = await pricingModel.findByIdAndDelete(filter);
	return data;
};
export default { pricingfindAllQuery, updateOneQuery, pricedeleteOneQuery };
