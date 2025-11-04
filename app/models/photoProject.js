import mongoose from 'mongoose';

const PhotoProjectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title.'],
    trim: true,
  },
  slug: {
    type: String,
    required: [true, 'Please provide a URL slug.'],
    trim: true,
    unique: true,
    lowercase: true,
  },
  description: {
    type: String,
    trim: true,
    default: '',
  },
  thumbnail: {
    type: String,
    required: [true, 'Please provide a thumbnail URL.'],
  },
  thumbnailPublicId: {
    type: String,
    required: true,
  },
  // --- ✨ ADD THIS FIELD ✨ ---
  isFeatured: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

export default mongoose.models.PhotoProject || mongoose.model('PhotoProject', PhotoProjectSchema);