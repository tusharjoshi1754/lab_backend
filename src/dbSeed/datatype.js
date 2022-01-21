import { redBright, yellowBright } from 'chalk';
import { Datatype } from '../models';
import JSONdata from './JSONData/datatype.json';

const seedDatatype = async (data = JSONdata) => {
	try {
		let insertObj;
		data.forEach(async (element) => {
			console.info(yellowBright('Sowing seed for datatype'));
		
					insertObj = {
						...element
					};
					const user = new Datatype(insertObj);
					const userRes = await user.save();
				
			
		});
	} catch (error) {
		errorLogger(error.message);
		console.error(redBright('error', error.message));
		return;
	}
};

export default seedDatatype;
