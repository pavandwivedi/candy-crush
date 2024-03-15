import shopModel from "../models/admin.shop.model.js"; 
import userShopModel from "../models/shop.model.js";
import {userModel} from "../models/user.model.js";
import {error,success} from "../services/responseWrapper.js";

export async function purchaseShopController(req,res){
    try {
        const user = req._id;
        const{name} = req.body;
        const currUser = await userModel.findById(user);
        if (!currUser) {
            return res.send(error(404, 'User not found'));
          }
        const shopDetails = await shopModel.findOne({name:name});
        if(!shopDetails) {
            return res.send(error(404,"no such shop exist"));
        }
        const type = shopDetails.type;
        const coins = shopDetails.coins;
        const count = shopDetails.count;
        if(currUser.coins<coins){
            return res.send(error(403,"you do not have a sufficient coins"));
        }
        const newShop = new userShopModel({name,type,coins,count,user});
        const shopInfo = await newShop.save();
        currUser.coins -=coins;
       if(type =="extraball"){
        currUser.extraball+=count;
       }
       if(type =="fireball"){
        currUser.fireball+=count;
       }
       if(type =="colorball"){
        currUser.colorball+=count;
       }
       if (type == "life"){
        currUser.life+= count;
       }

       currUser.shops.push(shopInfo._id);
       await currUser.save();
       return res.send(success(200,`you have purchased ${count+type} successfully `))  ;

    } catch (err) {
       return res.send(error(500,err.message)); 
    }
}

export async function getShoppingListController(req,res){
    try {
        const user = req._id;
        const currUser = await userModel.findById(user);
        if (!currUser) {
            return res.send(error(404,'User does not exist!'));
          }
        const shoppingList = await userShopModel.find({user}).populate('user');
        if(!shoppingList){
            return res.send(error(403,"you dont have purchase anything"));

        }
        return res.send(success(200,shoppingList));
    } catch (err) {
        return res.send(error(500,err.message)); 
    }
}

