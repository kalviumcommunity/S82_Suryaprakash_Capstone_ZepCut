import express from 'express';
const router = express.Router();

import {
  createJobListing,
  getAllJobListings,
  getJobListingById,
  updateJobListing
} from '../controllers/jobController.js';

router.post('/', createJobListing);
router.get('/', getAllJobListings);
router.get('/:id', getJobListingById);
router.put('/:id', updateJobListing);

export default router;
