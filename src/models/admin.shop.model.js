import mongoose from  "mongoose";

const shopSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, enum: ['extraball', 'colorball', 'fireball', 'life'], required: true },
    count:{type:Number,required:true},
    coins: { type: Number, required: true }
},{timestamps:true})

const  shopModel = mongoose.model("shoplist",shopSchema);
export default shopModel;