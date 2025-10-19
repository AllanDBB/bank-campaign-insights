import mongoose from 'mongoose';

const filterItemSchema = new mongoose.Schema({
  active: {
    type: Boolean,
    required: true,
    default: true
  },
  type: {
    type: String,
    required: true,
    enum: ['range', 'multiple']
  },
  values: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
    validate: {
      validator: function(value) {
        if (this.type === 'range') {
          return value && typeof value === 'object' && ('min' in value || 'max' in value);
        }
        if (this.type === 'multiple') {
          return Array.isArray(value);
        }
        return false;
      },
      message: 'Values must be an object with min/max for range type, or an array for multiple type'
    }
  }
}, { _id: false });

const filterSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  filterName: {
    type: String,
    required: true
  },
  filters: {
    type: Map,
    of: filterItemSchema,
    required: true
  }
}, {
  timestamps: true
});

filterSchema.index({ id: 1 });
filterSchema.index({ filterName: 1 });

const Filter = mongoose.model('Filter', filterSchema);

export default Filter;
