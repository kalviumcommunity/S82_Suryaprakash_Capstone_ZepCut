const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');

router.post('/', jobController.createJobListing);
router.get('/', jobController.getAllJobListings);
router.get('/:id', jobController.getJobListingById);
router.put('/:id', jobController.updateJobListing);
router.delete('/:id', jobController.deleteJobListing);

module.exports = router;
