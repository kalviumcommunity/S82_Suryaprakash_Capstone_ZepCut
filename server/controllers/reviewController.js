import Review from '../src/models/Review.model.js';
import Appointment from '../src/models/Appointment.model.js';

// Simple JS validation for review creation
function validateReviewData(data) {
  if (!data.reviewer || !data.reviewedUser) return 'Reviewer and reviewedUser are required.';
  if (typeof data.rating !== 'number' || data.rating < 1 || data.rating > 5) return 'Rating must be a number between 1 and 5.';
  return null;
}

// Create a review (only after an appointment)
export const createReview = async (req, res) => {
  const error = validateReviewData(req.body);
  if (error) return res.status(400).json({ error });

  const { reviewer, reviewedUser } = req.body;

  try {
    const hadAppointment = await Appointment.findOne({
      user: reviewer,
      salon: reviewedUser,
    });

    if (!hadAppointment) {
      return res.status(403).json({
        error: 'You can only review professionals you have booked with.',
      });
    }

    const review = new Review(req.body);
    await review.save();
    res.status(201).json(review);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all reviews for a user (barber/salon)
export const getReviewsForUser = async (req, res) => {
  try {
    const reviews = await Review.find({ reviewedUser: req.params.userId }).populate('reviewer reviewedUser');
    res.status(200).json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a review
export const updateReview = async (req, res) => {
  const allowedFields = ['rating', 'comment'];
  const updateData = {};
  for (let field of allowedFields) {
    if (req.body[field] !== undefined) updateData[field] = req.body[field];
  }

  // Manual validation
  if (updateData.rating !== undefined) {
    if (typeof updateData.rating !== 'number' || updateData.rating < 1 || updateData.rating > 5) {
      return res.status(400).json({ error: 'Rating must be a number between 1 and 5.' });
    }
  }

  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ error: 'Review not found' });

    if (review.reviewer.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized to update this review' });
    }

    Object.assign(review, updateData);
    await review.save();
    res.status(200).json(review);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// Delete a review
export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ error: 'Review not found' });

    if (review.reviewer.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized to delete this review' });
    }

    await Review.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Review deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
