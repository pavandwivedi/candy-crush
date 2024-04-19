import mongoose from "mongoose";

const dailyRewardSchema = mongoose.Schema({
    collectedamount:{
        type:Number,
        required:true
    },
    collectedtime:{
        type:Date,
        required:true
    },
    user : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }
});

const dailyRewardModel = mongoose.model('dailyreward',dailyRewardSchema);
export default dailyRewardModel;