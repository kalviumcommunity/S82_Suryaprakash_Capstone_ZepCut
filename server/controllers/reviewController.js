const Review = require('../models/Review');

// Create review
exports.createReview = async (req, res) => {
  try {
    const review = new Review(req.body);
    await review.save();
    res.status(201).json(review);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get reviews for a user (barber/salon)
exports.getReviewsForUser = async (req, res) => {
  try {
    const reviews = await Review.find({ reviewedUser: req.params.userId }).populate('reviewer reviewedUser');
    res.status(200).json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};




