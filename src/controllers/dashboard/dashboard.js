import { appModel } from '../../models';
import { dashboardService, salloneEmployeeService } from '../../mongoServices';
import { errorLogger } from '../../utils';
import { CONSTANTS } from '../../constants';
const {
	STATUS_CODE: { SUCCESS, FAILED },
	RESPONSE_MESSAGE: { DASHBOARD, FAILEDRESPONSE },
} = CONSTANTS;

const get = async (req, res) => {
	try {
		const appCount = await dashboardService.get();
		const EmpCount = await salloneEmployeeService.get();
		res.status(SUCCESS).json({
			success: true,
			msg: DASHBOARD.GETSUCCESS,
			data: { appCount, EmpCount },
		});
	} catch (error) {
		errorLogger(error.message, req.originalUrl, req.ip);
		res.status(FAILED).json({
			success: false,
			error: error.message || FAILEDRESPONSE,
		});
	}
};

export default { get };
