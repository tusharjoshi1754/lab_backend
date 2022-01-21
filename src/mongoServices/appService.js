import { CONSTANTS } from '../constants';
import { appModel } from '../models';
const {
	ROLE: { DEVELOPER },
} = CONSTANTS;

const findAllQuery = async (query, role) => {
	let { search, _id, limit, page, sortField, sortValue } = query;
	let sort = {};
	let whereClause = role === DEVELOPER ? {} : { is_deleted: false };

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
			$or: [{ name: search }, { description: search }],
		};
	}
	if (_id) {
		whereClause = { ...whereClause, _id };
	}
	const data = await appModel.aggregate([
		{ $match: whereClause },
		{
			$lookup: {
				from: 'salone_owners',
				localField: '_id',
				foreignField: 'salloneId',
				as: 'saloneOwner',
			},
		},
		{ $skip: page > 0 ? +limit * (+page - 1) : 0 },
		{ $limit: +limit || 20 },
		{ $sort: sort },
	]);
	// const data1 = await appModel
	// 	.find(whereClause)
	// 	.populate({
	// 		path: 'createdBy',
	// 		model: 'admin_User',
	// 		select: 'name',
	// 	})
	// 	.skip(page > 0 ? +limit * (+page - 1) : 0)
	// 	.limit(+limit || 20)
	// 	.sort(sort);
	const totalCount = await appModel.find(whereClause).countDocuments();
	return { data, totalCount };
};

const updateOneQuery = async (filter, update, projection) => {
	let options = { new: true, fields: { ...projection } };

	const data = await appModel.findOneAndUpdate(filter, update, options);
	return data;
};
const deleteOneQuery = async (filter) => {
	const data = await appModel.findByIdAndDelete(filter);
	return data;
};
export default {
	findAllQuery,
	updateOneQuery,
	deleteOneQuery,
};
