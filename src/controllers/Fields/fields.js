import { adminUserService, FieldsSubService, DatatypeSubService } from '../../mongoServices';
import { Fields } from '../../models'
import { errorLogger } from '../../utils';
import { CONSTANTS } from '../../constants';
const {
    STATUS_CODE: { SUCCESS, FAILED },
    RESPONSE_MESSAGE: { FIELDS, FAILEDRESPONSE, ADMINUSER, DATATYPE },
} = CONSTANTS;

const get = async (req, res) => {
    try {
        const appCount = await FieldsSubService.get();
        res.status(SUCCESS).json({
            success: true,
            msg: FIELDS.GETSUCCESS,
            data: appCount,
        });
    } catch (error) {
        errorLogger(error.message, req.originalUrl, req.ip);
        res.status(FAILED).json({
            success: false,
            error: error.message || FAILEDRESPONSE,
        });
    }
};
const post = async (req, res) => {
    try {
        const id = req.body.userid
        console.log(req.body)
        const checkExistingUser = await adminUserService.findAllQuery({
            _id: id,
        });
        // check user is exist or not
        if (!checkExistingUser) {
            throw new Error(ADMINUSER.NOTADMINUSER);
        }
        const datatypeId = req.body.Datatypeid
        const datatype = await DatatypeSubService.FindByIdDataType(datatypeId);
        if (!datatype) {
            res.status(FAILED).json({
                success: false,
                msg: DATATYPE.GETFAILED,
            })
        } else {
            req.body.createdBy = id
            var data = {
                ...req.body
            }
            const DataSave = new Fields(data);
            const saveResponse = await DataSave.save();
            if (saveResponse) {
                res.status(SUCCESS).json({
                    success: true,
                    msg: FIELDS.CREATESUCCESS,
                    data: saveResponse,
                });
            }

        }




    } catch (error) {
        errorLogger(error.message, req.originalUrl, req.ip);
        res.status(FAILED).json({
            success: false,
            error: error.message || FAILEDRESPONSE,
        });
    }
}
const getByid = async (req, res) => {
	try {
		const { id } = req.params
		const data = await FieldsSubService.FindByIdFild(id)
		if (!data) {
			res.status(FAILED).json({
				success: false,
				msg: FIELDS.GETFAILED,
			})
		}else {
			res.status(SUCCESS).json({
				success: true,
				msg: FIELDS.GETSUCCESS,
				data: data,
			});
		}


	} catch (error) {
		errorLogger(error.message, req.originalUrl, req.ip);
		res.status(FAILED).json({
			success: false,
			error: error.message || FAILEDRESPONSE,
		});
	}
}
const deleteField = async (req, res) => {
	try {
		
        console.log('req.query', req.query)
		const { id} = req.query
        
		const data = await FieldsSubService.deleteOneQuery(id,req.query.userid);
		if (data) {
			res.status(SUCCESS).send({
				success: true,
				msg: FIELDS.DELETESUCCESS,
				data: [],
			});
		} else {
			throw new Error(FIELDS.DELETEFAILED);
		}
	} catch (error) {
		errorLogger(error.message, req.originalUrl, req.ip);
		res.status(FAILED).json({
			success: false,
			error: error.message || FAILEDRESPONSE,
		});
	}
};
const updateField = async(req,res)=>{
	try {
		const { id } = req.body
		console.log('req.body', req.body)
		const data = await FieldsSubService.FindByIdFild(id)
		console.log('data', data)
		if (!data) {
			res.status(FAILED).json({
				success: false,
				msg: FIELDS.UPDATEFAILED,
			})
		}else {
            const updateData = await FieldsSubService.FindByIdAndUpdate(id ,req.body)
			res.status(SUCCESS).json({
				success: true,
				msg: FIELDS.UPDATESUCCESS,
				data: updateData,
			});
		}


	} catch (error) {
		errorLogger(error.message, req.originalUrl, req.ip);
		res.status(FAILED).json({
			success: false,
			error: error.message || FAILEDRESPONSE,
		});
	}
}
export default { get, post ,getByid,deleteField,updateField};
