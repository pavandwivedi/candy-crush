import mongoose from "mongoose"

const adBasedCoinsSchema = mongoose.Schema({
  
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
const adBasedCoinsModel = mongoose.model('adbasedfreecoinReward',adBasedCoinsSchema);
export default adBasedCoinsModel;