import mongoose from '@/database';

const fraseSchema = new mongoose.Schema({
  texto: {
    type: String,
    trim: true,
    unique: true,
    required: true,
  },
  tipo: {
    type: String,
    trim: true,
    required: true,
  }
});

export default mongoose.model('frases', fraseSchema);
