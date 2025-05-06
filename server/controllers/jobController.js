import JobListing from '../src/models/JobListing.model.js';

// Create a job listing
export const createJobListing = async (req, res) => {
  try {
    const jobData = {
      ...req.body,
      postedDate: req.body.postedDate || new Date(), // Default to current date
    };

    const job = new JobListing(jobData);
    await job.save();
    res.status(201).json(job);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all job listings
export const getAllJobListings = async (req, res) => {
  try {
    const jobs = await JobListing.find().populate('salon');
    res.status(200).json(jobs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get job listing by ID
export const getJobListingById = async (req, res) => {
  try {
    const job = await JobListing.findById(req.params.id).populate('salon');
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.status(200).json(job);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update job listing
export const updateJobListing = async (req, res) => {
  try {
    const updatedJob = await JobListing.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedJob) return res.status(404).json({ message: 'Job not found' });
    res.status(200).json(updatedJob);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
