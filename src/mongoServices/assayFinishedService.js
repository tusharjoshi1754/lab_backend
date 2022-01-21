import { AssayFinished_tabledata } from '../models';
const get = async () => {
	const data = await AssayFinished_tabledata.find({
		isEnabled: true,
	});
	return data;
};
const FindById = async (id) => {
	const data = await AssayFinished_tabledata.find({
		$and: [{ _id: id }, { isEnabled: true }],
	});
	return data[0];
};
const deleteOneQuery = async (id, Jsondata) => {
	const data = await AssayFinished_tabledata.findByIdAndUpdate(id, {
		deletedAt: new Date(),
		deletedBy: Jsondata,
		isEnabled: false,
	});
	data = [];
	return data;
};
const FindByIdAndUpdate = async (id, Jsondata) => {
	const data = await AssayFinished_tabledata.findByIdAndUpdate(
		id,
		{
			...Jsondata,
		},
		{ new: true },
	);
	return data;
};

export default {
	get,
	FindById,
	deleteOneQuery,
	FindByIdAndUpdate,
};
