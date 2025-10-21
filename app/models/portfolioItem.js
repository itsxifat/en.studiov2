import mongoose from 'mongoose';

const PortfolioItemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Project title is required'],
    trim: true,
    maxlength: [60, 'Title cannot be more than 60 characters'],
  },
  // FIX: Removed 'enum' constraint to support dynamic categories from the database.
  category: {
    type: String,
    required: [true, 'Category is required'],
  },
  youtubeId: {
    type: String,
    required: [true, 'YouTube ID is required'],
  },
  thumbnail: {
    type: String,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.PortfolioItem || mongoose.model('PortfolioItem', PortfolioItemSchema);
