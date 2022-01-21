import express from 'express';
import { webTestimonialController } from '../controllers';
import { authMiddelware } from '../middleware';
const router = express.Router();

// website_testimonials CRUD Routes
router.post(
	'/create',
	authMiddelware,
	webTestimonialController.createTestimonial,
);
router.get('/get', webTestimonialController.getAllTestimonial);
router.put(
	'/update/:id',
	authMiddelware,
	webTestimonialController.updateTestimonial,
);
router.delete(
	'/delete/:id',
	authMiddelware,
	webTestimonialController.deleteTestimonial,
);

module.exports = router;
