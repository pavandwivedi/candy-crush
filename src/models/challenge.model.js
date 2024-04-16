import mongoose from "mongoose"

const challengeSchema = mongoose.Schema({
    
      name: {
        type: String,
        required: true
      },
      startTime: {
        type: Date,
        required: true
      },
      endTime: {
        type: Date,
       
      },
     remainingTime:{
      type:Date,
     },
     remainingLevel:{
      type:Number
     },
     status: {
      type: String,
      enum: ['complete', 'incomplete'],
      default: 'incomplete'
  },
      user : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }
    
})
const challengeModel = mongoose.model('challenge',challengeSchema);
export default challengeModel;