import express from 'express';
import { mailLogController } from '../controllers';
import { authMiddelware } from '../middleware';
const router = express.Router();

// website_header CRUD Routes
router.get('/get', authMiddelware, mailLogController.getMailLogs);
router.delete('/delete/:id', authMiddelware, mailLogController.deleteMailLogs);
module.exports = router;
