const mongoose = require('mongoose');

// Define the schema for withdraw history
const WithdrawalSchema = new mongoose.Schema({
    amount: {
      type: Number,
      required: true,
    },
    withdrawalDate: {
      type: Date,
      default: Date.now,
    },
    paymentMethod: {
      type: String,
      maxlength: 100,
    },
    transactionNumber: {
      type: String,
      maxlength: 100,
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'cancelled'],
      default: 'pending',
    },
  });
  
const WithdrawHistorySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  
  },
  withdrawHistory: [WithdrawalSchema],
});

// Create the model based on the schema
const withdrawHistoryModel = mongoose.model('WithdrawHistory', WithdrawHistorySchema);

 export default  withdrawHistoryModel;
