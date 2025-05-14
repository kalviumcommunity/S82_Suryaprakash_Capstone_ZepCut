import express from 'express';
const router = express.Router();

import {
  createReview,
  getReviewsForUser,
  updateReview,
  deleteReview
} from '../controllers/reviewController.js';

router.post('/', createReview);
router.get('/:userId', getReviewsForUser);
router.put('/:id', updateReview);
router.delete('/:id', deleteReview);
export default router;
