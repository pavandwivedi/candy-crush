import mongoose from "mongoose";

const adBasedFreeLifesSchema = mongoose.Schema({
    duration:{
        type:Number,
        required:true
    },
    life:{
        type:Number,
        required:true
    }


}, { timestamps: true });

const adBasedFreeLifesModel = mongoose.model(
    "createAdBasedFreeLifesRewards",
    adBasedFreeLifesSchema);

export default adBasedFreeLifesModel;