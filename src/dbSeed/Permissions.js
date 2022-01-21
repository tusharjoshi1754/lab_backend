import { redBright, greenBright, yellowBright } from 'chalk';
import { permissionsModel } from '../models';
import { permissionService } from '../mongoServices';
import { errorLogger } from '../utils';
import permissiondata from './JSONData/Permission.json';
const seedPermissions = async (data = permissiondata) => {
	try {
		for (let i = 0; i < data.length; i++) {
			console.info(yellowBright('Sowing seed for Permissions'));
			const checkExistingPermissions = await permissionService.findWithoutPage({
				path: data[i].path,
			});
			if (checkExistingPermissions.length === 0) {
				const insertObj = new permissionsModel({
					...data[i],
				});
				await insertObj.save();
			}
		}

		console.info(greenBright('Sowing seed completed for Permissions'));
	} catch (error) {
		errorLogger(error.message);
		console.error(redBright('error', error.message));
		return;
	}
};
export default seedPermissions;
