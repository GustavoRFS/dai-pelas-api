import mongoose from '@/database';

const parenteSchema = new mongoose.Schema({
  nome: {
    type: String,
    unique: true,
    required: true,
    trim: true,
  },
  mae: {
    type: Boolean,
    required: true,
  }
});

export default mongoose.model('parentes', parenteSchema);
