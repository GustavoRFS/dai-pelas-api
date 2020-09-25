import mongoose from '@/database';

const instagramSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  nome: {
    type: String,
    required: true,
    trim: true,
  },
  hrefs: {
    type: Array,
    required: true,
    default: [],
    select: false,
  }
});

export default mongoose.model('paginas', instagramSchema);
