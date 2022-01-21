import { Fields } from '../../models';
const get = async () => {
	const data = await Fields.find({isEnabled : true});
	return data;
};
const FindByIdFild = async (id)=>{
	const data = await Fields.findById(
		id
	)
	return data
}
const deleteOneQuery = async(id,Jsondata)=>{
	const data = await Fields.findByIdAndUpdate(id,{
		deletedAt: new Date(),
		deletedBy: Jsondata,
		isEnabled:false,
	})
	return data
}
const FindByIdAndUpdate= async(id,Jsondata)=>{
	const data = await Fields.findByIdAndUpdate(id,{
		...Jsondata
	}, {new: true})
	return data
}
export default {
	get,
	FindByIdFild,
	deleteOneQuery,
	FindByIdAndUpdate
};
