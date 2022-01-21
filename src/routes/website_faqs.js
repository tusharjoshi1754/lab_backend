import express from 'express';
import { websiteFaqsController } from '../controllers';
import { authMiddelware } from '../middleware';
const router = express.Router();

// website_faqs CRUD Routes
router.post('/create', authMiddelware, websiteFaqsController.createFaq);
router.get('/get', websiteFaqsController.getAllFaq);
router.put('/update/:id', authMiddelware, websiteFaqsController.updateFaq);
router.delete('/delete/:id', authMiddelware, websiteFaqsController.deleteFaq);

module.exports = router;
