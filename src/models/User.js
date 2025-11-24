import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, sparse: true },
  password: String,    // hashed
  avatar: String,      // URL Cloudinary
  role: { type: String, default: 'user' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('User', userSchema);
