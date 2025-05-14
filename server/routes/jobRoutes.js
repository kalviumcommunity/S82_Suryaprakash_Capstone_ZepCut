import express from 'express';
const router = express.Router();

import {
  createJobListing,
  getAllJobListings,
  getJobListingById,
  updateJobListing,
  deleteJobListing,
} from '../controllers/jobController.js';

router.post('/', createJobListing);
router.get('/', getAllJobListings);
router.get('/:id', getJobListingById);
router.put('/:id', updateJobListing);
routter.delete('/:id', deleteJobListing);
export default router;
