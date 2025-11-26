import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  lastname: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ["ejecutivo", "gerencia"],
    default: "ejecutivo"
  }
}, {
  timestamps: true
});

const User = mongoose.model('User', userSchema);
export default User;
