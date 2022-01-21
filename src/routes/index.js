import express from 'express';
const router = express.Router();

router.use('/website_header', require('./website_header'));
router.use('/website_features', require('./website_features'));
router.use('/website_pricing', require('./website_pricing'));
router.use('/website_testimonials', require('./website_testimonials'));
router.use('/website_faqs', require('./website_faqs'));
router.use('/website_about', require('./website_about'));
router.use('/call_back', require('./call_back'));
router.use('/footer', require('./footer'));
router.use('/permissions', require('./adminManagement/permissionsRoutes'));
router.use('/role', require('./adminManagement/roleRoutes'));
router.use('/adminuser', require('./adminManagement/adminUserRoutes'));
router.use('/emailLogs', require('./mailLogs'));
router.use('/terms-condition', require('./termsConditions'));
router.use('/privacy-policy', require('./privacyPolicy'));
router.use('/app', require('./appRoutes'));
router.use('/payment', require('./payment'));
router.use('/dashboard', require('./dashboard'));
router.use('/datatype', require('./datatype'));
router.use('/fields', require('./fields'));
router.use('/forms', require('./form'));
router.use('/section', require('./section'));
router.use('/AssayFinished', require('./assayFinished'));

module.exports = router;
