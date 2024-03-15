import mongoose from "mongoose";

const adBasedFreeCoinsSchema = mongoose.Schema({
    duration:{
        type:Number,
        required:true
    },
    coins:{
        type:Number,
        required:true
    }


}, { timestamps: true });

const adBasedFreeCoinsModel = mongoose.model(
    "createAdBasedFreeCoinsRewards",
    adBasedFreeCoinsSchema);

export default adBasedFreeCoinsModel;