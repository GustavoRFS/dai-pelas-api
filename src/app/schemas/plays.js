import mongoose from '@/database';

const playSchema = new mongoose.Schema({
  url: {
    type: String,
    unique: true,
    required: true,
  },
  autores: {
    type: String,
    required: true,
  }
});

export default mongoose.model('plays', playSchema);
