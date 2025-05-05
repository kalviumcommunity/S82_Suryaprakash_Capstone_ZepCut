const JobListing = require('../models/JobListing');

// Create a job listing (by salon)
exports.createJobListing = async (req, res) => {
  try {
    const job = new JobListing(req.body);
    await job.save();
    res.status(201).json(job);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

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
