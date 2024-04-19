// challengeModel.js
import mongoose from "mongoose";

const createChallengeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  rewards: {
    type: Number, // Assuming rewards are represented as strings, adjust as needed
    required: true
  },
  duration: {
    type: Number, // Assuming duration is in seconds, adjust as needed
    required: true
  }
}, { timestamps: true });

const createChallengeModel = mongoose.model('createChallenge', createChallengeSchema);
export default  createChallengeModel;
