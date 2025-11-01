import mongoose from 'mongoose';

const ServiceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title.'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Please provide a description.'],
    trim: true,
  },
  icon: {
    type: String, // lucide-react icon name
    required: [true, 'Please provide an icon name.'],
    trim: true,
  },
  startingPrice: {
    // Stored as String to allow "Negotiable" or "4,000"
    type: String,
    required: [true, 'Please provide a starting price.'],
    trim: true,
  },
  displayOrder: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

export default mongoose.models.Service || mongoose.model('Service', ServiceSchema);