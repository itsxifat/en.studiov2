import mongoose from 'mongoose';

const PortfolioItemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title.'],
    maxlength: [100, 'Title cannot be more than 100 characters'],
    trim: true,
  },
  category: {
    type: String,
    required: [true, 'Please provide a category.'],
    trim: true,
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot be more than 500 characters'],
    trim: true,
    default: '',
  },
  youtubeId: {
    type: String,
    trim: true,
    default: null,
  },
  thumbnail: {
    type: String,
    trim: true,
    default: null,
  },
  // liveUrl and githubUrl fields have been removed
  isFeatured: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.PortfolioItem || mongoose.model('PortfolioItem', PortfolioItemSchema);