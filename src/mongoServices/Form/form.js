import { Forms } from '../../models';
const get = async () => {
	const data = await Forms.find({
		isEnabled:true
	});
	return data;
};
const FindByIdForm = async (id) => {
	
	const data = await Forms.find({
		$and: [
			{'_id':id,},
			{'isEnabled':true}
		]
	}
	)
	return data[0]
}
const deleteOneQuery = async (id, Jsondata) => {
	const data = await Forms.findByIdAndUpdate(id, {
		deletedAt: new Date(),
		deletedBy: Jsondata,
		isEnabled: false,
	})
	return data
}
const FindByIdAndUpdate = async (id, Jsondata) => {
	const data = await Forms.findByIdAndUpdate(id, {
		...Jsondata
	}, { new: true })
	return data
}

export default {
	get,
	FindByIdForm,
	deleteOneQuery,
	FindByIdAndUpdate
};
