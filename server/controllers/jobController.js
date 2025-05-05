const JobListing = require('../models/JobListing');


// Get all job listings
exports.getAllJobListings = async (req, res) => {
  try {
    const jobs = await JobListing.find().populate('salon');
    res.status(200).json(jobs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get single job listing
exports.getJobListingById = async (req, res) => {
  try {
    const job = await JobListing.findById(req.params.id).populate('salon');
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.status(200).json(job);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


