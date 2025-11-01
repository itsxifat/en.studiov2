import mongoose from 'mongoose';

const PricingPackageSchema = new mongoose.Schema({
  // Link to the Service
  serviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: true,
    index: true,
  },
  packageName: {
    type: String,
    required: true,
    trim: true,
  },
  // ✨ NEW: The description from the PDF
  description: {
    type: String,
    trim: true,
    default: '', // e.g., "Duration: max 40 sec..."
  },
  // This is now ONLY for the quantity
  quantity: { 
    type: String,
    required: true,
    trim: true, // e.g., "1", "3", "05 Products"
  },
  unitPrice: {
    type: String,
    required: true,
    trim: true,
  },
  totalPrice: {
    type: String,
    required: true,
    trim: true,
  },
  displayOrder: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

export default mongoose.models.PricingPackage || mongoose.model('PricingPackage', PricingPackageSchema);