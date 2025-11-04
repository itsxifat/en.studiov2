import mongoose from 'mongoose';

const BtsItemSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PhotoProject',
    required: true,
    index: true,
  },
  type: {
    type: String,
    enum: ['video', 'image'],
    required: true,
  },
  // This will store either a YouTube ID or a full Cloudinary URL
  url: {
    type: String,
    required: true,
    trim: true,
  },
  // Cloudinary public_id (if type is 'image') for deletion
  cloudinaryPublicId: {
    type: String,
    trim: true,
    default: null,
  },
  description: {
    type: String,
    trim: true,
    default: '',
  },
  displayOrder: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

export default mongoose.models.BtsItem || mongoose.model('BtsItem', BtsItemSchema);