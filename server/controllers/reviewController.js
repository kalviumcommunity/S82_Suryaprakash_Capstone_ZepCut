const Review = require('../models/Review');
const Appointment = require('../models/Appointment');

exports.createReview = async (req, res) => {
  try {
    const { reviewer, reviewedUser } = req.body;

    const hadAppointment = await Appointment.findOne({
      user: reviewer,
      salon: reviewedUser,
    });

    if (!hadAppointment) {
      return res.status(403).json({ error: 'You can only review professionals you booked with.' });
    }

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


// Update a review
exports.updateReview = async (req, res) => {
    try {
      const review = await Review.findById(req.params.id);
  
      if (!review) return res.status(404).json({ error: "Review not found" });
  
      if (review.reviewer.toString() !== req.user.id) {
        return res.status(403).json({ error: "Unauthorized to update this review" });
      }
  
      const allowedFields = ['rating', 'comment'];
      for (let field of allowedFields) {
        if (req.body[field]) review[field] = req.body[field];
      }
  
      await review.save();
      res.status(200).json(review);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  
  



