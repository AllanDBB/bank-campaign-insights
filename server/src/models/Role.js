import mongoose from 'mongoose';

const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    enum: ["ejecutivo", "gerente"]
  },
  permissions: {
    type: Map,
    of: Boolean,
    default: new Map()
  }
}, {
  timestamps: true
});

const Role = mongoose.model('Role', roleSchema);
export default Role;
