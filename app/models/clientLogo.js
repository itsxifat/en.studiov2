import mongoose from 'mongoose';

const ClientLogoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Client name is required for alt text.'],
    trim: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  publicId: {
    type: String,
    required: true,
  },
  // You could add a 'displayOrder' field here if needed
}, { timestamps: true });

export default mongoose.models.ClientLogo || mongoose.model('ClientLogo', ClientLogoSchema);