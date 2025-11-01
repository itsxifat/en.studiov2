import mongoose from 'mongoose';

const TestimonialSchema = new mongoose.Schema({
  quote: {
    type: String,
    required: [true, 'Please provide a quote.'],
    trim: true,
    maxlength: [500, 'Quote cannot be more than 500 characters'],
  },
  name: {
    type: String,
    required: [true, 'Please provide the client name.'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters'],
  },
  project: {
    type: String,
    trim: true,
    maxlength: [100, 'Project description cannot be more than 100 characters'],
    default: '',
  },
  photo: {
    type: String,
    trim: true,
    default: null,
  },
  cloudinaryPublicId: {
    type: String,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// ✨ ENSURE THIS LINE IS EXACTLY LIKE THIS ✨
// This handles Next.js hot-reloading correctly.
export default mongoose.models.Testimonial || mongoose.model('Testimonial', TestimonialSchema);