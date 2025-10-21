import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Category name is required'],
    unique: true,
    trim: true,
    maxlength: [40, 'Category name cannot be more than 40 characters'],
  },
});

export default mongoose.models.Category || mongoose.model('Category', CategorySchema);