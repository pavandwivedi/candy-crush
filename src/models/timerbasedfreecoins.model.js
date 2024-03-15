import mongoose from "mongoose"

const timerBasedCoinsSchema = mongoose.Schema({
  
        collectedamount:{
            type:Number
        },
        collectedtime:{
            type:Date
        },
 
    
    user : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }

});
const timerBasedCoinsModel = mongoose.model('freecoinReward',timerBasedCoinsSchema);
export default timerBasedCoinsModel;