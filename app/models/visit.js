import mongoose from 'mongoose';

const VisitSchema = new mongoose.Schema({
  // The page that was visited (e.g., /about, /portfolio/project-slug)
  path: {
    type: String,
    required: true,
    trim: true,
    index: true,
  },
  // ✨ Storing the raw IP as requested
  ip: {
    type: String,
    required: true,
    index: true,
  },
  // The full User-Agent string
  userAgent: {
    type: String,
  },
  // The referring site (e.g., google.com, facebook.com)
  referrer: {
    type: String,
    trim: true,
    index: true,
  },
  // Timestamp of the visit
  timestamp: {
    type: Date,
    default: Date.now,
    // Automatically delete records after 90 days
    expires: '90d', 
  },
}, { timestamps: false }); // We use our own timestamp

export default mongoose.models.Visit || mongoose.model('Visit', VisitSchema);