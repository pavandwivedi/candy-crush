import mongoose from "mongoose"

const adBasedLifesSchema = mongoose.Schema({
  
        collectedlifes:{
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
const adBasedLifesModel = mongoose.model('adbasedfreelifeReward',adBasedLifesSchema);
export default adBasedLifesModel;