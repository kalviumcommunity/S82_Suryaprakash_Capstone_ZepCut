import express from 'express';
const router = express.Router();

import {
  createReview,
  getReviewsForUser,
  updateReview
} from '../controllers/reviewController.js';

router.post('/', createReview);
router.get('/:userId', getReviewsForUser);
router.put('/:id', updateReview);

export default router;
