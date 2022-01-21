import { Section, Fields } from '../../models';
import _ from 'loadsh';
const get = async () => {
	let data = await Section.find({
		isEnabled: true,
	});
	if (data) {
		var mainData = [];
		for (let index = 0; index < data.length; index++) {
			console.log('Dta---', data[index]);
			const finddata = await Fields.find({
				_id: {
					$in: data[index].fieldId,
				},
			});
			console.log('finddata', finddata);
			_.assign(data[index], finddata);
			// mainData[index].FindData = finddata;

			mainData = data[index];
			// mainData finddata
			// data[index].fieldData = finddata;
			// outputData[0].add = finddata;
		}
		return mainData;
	}
};
const FindById = async (id) => {
	console.log('id', id);
	const data = await Section.find({
		$and: [{ _id: id, isEnabled: true }],
	});

	return data[0];
};
const deleteOneQuery = async (id, Jsondata) => {
	const data = await Section.findByIdAndUpdate(id, {
		deletedAt: new Date(),
		deletedBy: Jsondata,
		isEnabled: false,
	});
	return data;
};
const FindByIdAndUpdate = async (id, Jsondata) => {
	const data = await Section.findByIdAndUpdate(
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
