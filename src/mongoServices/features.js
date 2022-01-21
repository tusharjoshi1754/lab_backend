import { featuresModel } from '../models';

const featuresfindAllQuery = async (query) => {
	let { search, _id, limit, page, sortField, sortValue, rank } = query;
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
	if (rank) {
		whereClause = { ...whereClause, rank };
	}

	const data = await featuresModel
		.find(whereClause)
		.skip(page > 0 ? +limit * (+page - 1) : 0)
		.limit(+limit || 20)
		.sort(sort);
	const totalCount = await featuresModel.find(whereClause).countDocuments();
	return { data, totalCount };
};

const featuresdeleteOneQuery = async (filter) => {
	const data = await featuresModel.findByIdAndDelete(filter);
	return data;
};
const featuresFindOneUpdateQuery = async (filter, update, projection) => {
	let options = { new: true, fields: { ...projection } };

	const data = await featuresModel.findOneAndUpdate(filter, update, options);
	return data;
};
const featuresValidation = async (filter) => {
	const data = await featuresModel.find({
		_id: {
			$in: filter,
		},
	});
	if (filter.length === data.length) return true;
	else return false;
};
export default {
	featuresfindAllQuery,
	featuresdeleteOneQuery,
	featuresFindOneUpdateQuery,
	featuresValidation,
};
