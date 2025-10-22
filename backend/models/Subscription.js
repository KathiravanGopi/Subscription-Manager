const mongoose = require('mongoose');
const { Schema } = mongoose;

const SubscriptionSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    name: { type: String, required: true, trim: true },
    category: {type:String,  required: true },
    price: { type: Number, required: true, min: 0 },
    billingCycle: { type: String, enum: [ 'Weekly', 'Monthly', 'Yearly'], default: 'Monthly' },
    startDate: { type: Date, default: Date.now },
    nextBillingDate: { type: Date },
    notes: { type: String, trim: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);


module.exports = mongoose.model('Subscription', SubscriptionSchema);
