import { Datatype } from '../models';
const get = async () => {
	const data = await Datatype.find();
	return data;
};
const FindByIdDataType = async (id)=>{
	const data = await Datatype.findById(
		id
	)
	if(!data){
		return false
	}
	return data
}
export default {
	get,
	FindByIdDataType
};
