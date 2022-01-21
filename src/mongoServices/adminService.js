import { adminModel } from '../models';

const findOneQuery = async (filter, projection) => {
	let query = {};

	if (filter && filter.orQuery) {
		query = { email: filter.email };
	}

	const data = await adminModel.findOne(query, projection);
	return data;
};

const findOneUpdateQuery = async (filter, update, projection) => {
	let options = { new: true, fields: { ...projection, password: 0 } };

	const data = await adminModel.findOneAndUpdate(filter, update, options);
	return data;
};

const findAllQuery = async (query) => {
	let { search, _id, limit, page, role, accountType, isVerified } = query;
	let whereClause = {};
	if (search) {
		search = new RegExp(search, 'ig');
		whereClause = {
			$or: [{ email: search }, { name: search }],
		};
	}
	if (_id) {
		whereClause = { ...whereClause, _id };
	}
	if (role) {
		whereClause = { ...whereClause, role };
	}
	if (accountType) {
		whereClause = { ...whereClause, accountType };
	}
	if (isVerified) {
		whereClause = { ...whereClause, isVerified };
	}

	const data = await adminModel
		.find(whereClause, { password: 0 })
		.skip(page > 0 ? +limit * (+page - 1) : 0)
		.limit(+limit || 20);
	const totalCount = await adminModel.find(whereClause).countDocuments();
	return { data, totalCount };
};

const updateOneQuery = async (filter, update, remove) => {
	const data = await adminModel.updateOne(filter, {
		$set: update,
		$unset: remove,
	});
	return data;
};

export default {
	findOneQuery,
	findAllQuery,
	findOneUpdateQuery,
	updateOneQuery,
};
