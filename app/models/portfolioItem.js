import mongoose from 'mongoose';

const portfolioItemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  youtubeId: {
    type: String,
  },
  thumbnail: {
    type: String,
  },
  liveUrl: {
    type: String,
  },
  githubUrl: {
    type: String,
  },
  tags: {
    type: [String],
    default: [],
  },
  // --- NEW FIELD ADDED ---
  isFeatured: {
    type: Boolean,
    default: false, // Default to not featured
  },
  // -------------------------
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.PortfolioItem || mongoose.model('PortfolioItem', portfolioItemSchema);
