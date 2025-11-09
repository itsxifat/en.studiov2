import mongoose from 'mongoose';

const VisitSchema = new mongoose.Schema({
  path: {
    type: String,
    required: true,
    trim: true,
    index: true,
  },
  ip: {
    type: String,
    required: true,
    index: true,
  },
  userAgent: {
    type: String,
  },
  referrer: {
    type: String,
    trim: true,
    index: true,
  },
  source: {
    type: String,
    trim: true,
    index: true,
  },
  
  // --- NEW: Added fields for GeoIP data ---
  location: {
    type: String, // e.g., "Savar, Bangladesh"
    trim: true,
  },
  coordinates: {
    type: [Number], // Stored as [longitude, latitude]
    index: '2dsphere', // For geospatial queries
  },
  // --- END NEW FIELDS ---

  timestamp: {
    type: Date,
    default: Date.now,
    expires: '90d',
  },
}, { timestamps: false });

export default mongoose.models.Visit || mongoose.model('Visit', VisitSchema);