import mongoose from 'mongoose';

const PhotoSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PhotoProject',
    required: true,
    index: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  publicId: {
    type: String,
    required: true,
  },
  width: {
    type: Number,
    required: true,
  },
  height: {
    type: Number,
    required: true,
  },
  // Optional: context from admin upload
  title: { type: String, trim: true },
  description: { type: String, trim: true },
}, { timestamps: true });

export default mongoose.models.Photo || mongoose.model('Photo', PhotoSchema);