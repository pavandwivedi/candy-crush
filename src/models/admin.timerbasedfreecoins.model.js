import mongoose from "mongoose";

const timerBasedFreeCoinsSchema = mongoose.Schema({
    duration:{
        type:Number,
        required:true
    },
    coins:{
        type:Number,
        required:true
    }


}, { timestamps: true });

const timerBasedFreeCoinsModel = mongoose.model(
    "createTimerBasedFreeCoinsRewards",
    timerBasedFreeCoinsSchema);

export default timerBasedFreeCoinsModel;