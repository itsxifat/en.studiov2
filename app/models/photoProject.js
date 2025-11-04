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
  thumbnail: { // Public URL from Cloudinary
    type: String,
    required: [true, 'Please provide a thumbnail URL.'],
  },
  thumbnailPublicId: { // Cloudinary ID for deletion
    type: String,
    required: true,
  },
  // BTS fields are now removed and will be handled by a separate model
}, { timestamps: true });

export default mongoose.models.PhotoProject || mongoose.model('PhotoProject', PhotoProjectSchema);