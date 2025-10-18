import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema({
  // Client Information
  age: {
    type: Number,
    required: true
  },
  job: {
    type: String,
    required: true
  },
  marital: {
    type: String,
    required: true
  },
  education: {
    type: String,
    required: true
  },

  // Client Credit Information
  hasCreditDefault: {
    type: String
  },
  hasHousingLoan: {
    type: String
  },
  hasPersonalLoan: {
    type: String
  },

  // Campaign Contact Information
  contactType: {
    type: String
  },
  contactMonth: {
    type: String,
    required: true
  },
  contactDayOfWeek: {
    type: String,
    required: true
  },
  contactDurationSeconds: {
    type: Number
  },
  numberOfContacts: {
    type: Number
  },
  daysSinceLastContact: {
    type: Number
  },
  previousContactsCount: {
    type: Number
  },
  previousCampaignOutcome: {
    type: String
  },

  // Economic Indicators
  employmentVariationRate: {
    type: Number
  },
  consumerPriceIndex: {
    type: Number
  },
  consumerConfidenceIndex: {
    type: Number
  },
  euriborThreeMonthRate: {
    type: Number
  },
  numberOfEmployees: {
    type: Number
  },

  // Campaign Result
  subscribedTermDeposit: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

// Indexes for frequently queried fields
documentSchema.index({ job: 1 });
documentSchema.index({ education: 1 });
documentSchema.index({ contactMonth: 1 });
documentSchema.index({ subscribedTermDeposit: 1 });
documentSchema.index({ contactMonth: 1, subscribedTermDeposit: 1 });

const Document = mongoose.model('Document', documentSchema);

export default Document;
