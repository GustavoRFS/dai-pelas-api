import mongoose from '@/database';

const clanSchema = new mongoose.Schema({
  nome: {
    type: String,
    lowercase: true,
    unique: true,
    required: true,
    trim: true,
  },
  discordId: {
    type: String,
    unique: true
  },
  imagens: {
    type: Array,
    default: [],
    select: false,
  }
});

export default mongoose.model('clan', clanSchema);
