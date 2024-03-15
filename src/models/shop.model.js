import mongoose from "mongoose";
const userShopSchema = new mongoose.Schema({
    name:{
        type:String
       
    },
    type: { type: String, enum: ['extraball', 'colorball', 'fireball', 'life'] },
    count:{type:Number},
    coins: { type: Number },
    user : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }
    
},{timestamps:true});

const userShopModel = mongoose.model('shop',userShopSchema);
export default userShopModel;