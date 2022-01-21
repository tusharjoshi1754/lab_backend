import express from 'express';
import { featuresController } from '../controllers';
import { validator } from '../validation';
import { authMiddelware } from '../middleware';
const router = express.Router();

// website_features CRUD Routes
router.post(
	'/create',
	validator.featureValidator,
	authMiddelware,
	featuresController.createFeature,
);
router.get('/get', featuresController.getFeature);
router.delete('/delete/:id', authMiddelware, featuresController.deleteFeature);
router.put(
	'/update/:id',
	validator.featureValidator,
	authMiddelware,
	featuresController.updateFeature,
);

module.exports = router;
