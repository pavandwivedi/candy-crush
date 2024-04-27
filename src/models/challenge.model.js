import mongoose from "mongoose"

const challengeSchema = mongoose.Schema({
  referenceId: {
    type: String,
    unique: true
  },
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
      default:0
     },
     remainingLevel:{
      type:Number
     },
     status: {
      type: String,
      enum: ['complete', 'incomplete'],
      default:"incomplete"
      
  },
      user : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    challengetype:{
      type: String
    },
    taskamount:{
      type:Number
    
    },
    duration:{
      type:Number
      
    },
    rewards:{
      type:Number,
      
    }
    
})
const challengeModel = mongoose.model('challenge',challengeSchema);
export default challengeModel;