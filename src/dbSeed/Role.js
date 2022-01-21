import { redBright, greenBright, yellowBright } from 'chalk';
import { roleModel } from '../models';
import { permissionService, roleService } from '../mongoServices';
import { errorLogger } from '../utils';
import roledata from './JSONData/Role.json';
const seedRole = async (data = roledata) => {
	try {
		let insertObj = {};
		for (let i = 0; i < data.length; i++) {
			console.info(yellowBright('Sowing seed for Role'));
			const checkExistingRole = await roleService.roleQuery({
				name: data[i].name,
			});

			if (!checkExistingRole) {
				let filter = {},
					project = { _id: 1 },
					permission,
					skip = 0;

				insertObj = data[i];
				if (insertObj.name === 'DEVELOPER') {
					permission = await permissionService.findWithoutPage(filter, project);
				} else {
					skip = 4;
					permission = await permissionService.findWithSkip(
						filter,
						project,
						skip,
					);
				}
				const permissionArray = [];

				permission.map((permission) => {
					permissionArray.push(permission?._id);
				});

				insertObj = {
					...insertObj,
					isEnabled: true,
					permissions: permissionArray,
				};

				const role = new roleModel(insertObj);
				await role.save();
			} else {
				throw new Error('role is avalible');
			}
		}
		console.info(greenBright('Sowing seed completed for ROLe'));
	} catch (error) {
		errorLogger(error.message);
		console.error(redBright('error', error.message));
		return;
	}
};
export default seedRole;
