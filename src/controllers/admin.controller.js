import adminModel from "../models/admin.model.js";
import {userModel} from "../models/user.model.js";
import createChallengeModel from "../models/admin.challenge.model.js";
import bcrypt from 'bcrypt'
import dotenv from 'dotenv';
import Razorpay from "razorpay";
import { generateAccessToken } from "../services/generateAccessToken.js";
import {error,success} from "../services/responseWrapper.js"
import timerBasedFreeCoinsModel from "../models/admin.timerbasedfreecoins.model.js";
import adBasedFreeCoinsModel from "../models/admin.adbasedfreecoins.model.js";
import adBasedFreeLifesModel from "../models/admin.adbasedfreelifes.model.js";
import shopModel from "../models/admin.shop.model.js";
import kycModel from "../models/user.kyc.model.js";
import WithdrawRequestModel from "../models/user.withdrawrequest.model.js";
dotenv.config();


const ACCESS_SECRET_KEY = process.env.ACCESS_SECRET_KEY || "greenwebsolutions";
export async function signupController(req,res){
    try {
        const {username,password,email} = req.body;
        if(!username || !password || !email){
            return res.send(error(404,"insufficient data"));
        }
        const hashedPassword = await bcrypt.hash(password,10);
        req.body["password"] = hashedPassword;
        const user = await adminModel.create(req.body);
        const  newuser = await adminModel.findById(user._id);
        return res.send(success(200,"admin registered successfully"));

    } catch (err) {
        return res.send(error(500,err.message));
    }

}

export async function loginController(req,res){
    try {

        const {usernameOrEmail,password} = req.body;
        const user = await adminModel.findOne({
            $or:[{username:usernameOrEmail}, {email:usernameOrEmail}]
        });
        if(!user){
            return res.status(404).json({message:"user not found"});
        }

        const matched = await bcrypt.compare(password,user.password);
        if(!matched){
            return res.send({message:"incorrect password"});
        }

        const accessToken = generateAccessToken({...user})
        // const {_id,password,newuser} = user;
        delete user['_doc']['password'];
        delete user['_doc']['__v'];
        delete user._doc['_id'];
        // console.log(user);

        return res.send({...user._doc,"accessToken":accessToken});
        
    } catch (error) {
        return res.json({"error":error.message});
    }
}

export async function getAllUsers(req,res){
    try {
        const users = await userModel.find({}).populate('Levels');
        return res.send(users);

    } catch (error) {
        return res.send({message:error.message})
    }
}

export async function createChallengeController(req, res) {
    const { name, description, isActive, rewards,duration,taskamount } = req.body;
    console.log("pavan")
    console.log(req.body)
    try {
        // Validate required fields
        if (!name || !description || !rewards || !duration || !taskamount) {
             return res.send(error(404,"insufficient data"))
        }

        // Create a new challenge instance
        const newChallenge = new createChallengeModel({
            name,
            description,
            isActive: isActive || true, // Default isActive to true if not provided
            rewards,
            duration,
            taskamount
        });

        // Save the new challenge to the database
        const savedChallenge = await newChallenge.save();
          console.log(savedChallenge)
        return res.send(success(200,"challenge created successfully",savedChallenge));
    } catch (err) {
        
        return res.send(error(500,err.message));
    }
}

export async function getChallengeController(req,res){
    try {
        
        const challengeDetails = await createChallengeModel.find({});
        

        if(! challengeDetails){
            return res.send(error(404,"no challenge exit"))
        }
        return res.send(success(200, challengeDetails));
    } catch (err) {
        return res.send(error(500,err.message));
    }
}

export async function updateChallengeController(req, res) {
     const { id } = req.params; 
    const { name, description, isActive, rewards, duration,taskamount} = req.body;

    try {
       
        // Find the challenge by ID
        const existingChallenge = await createChallengeModel.findById(id);

        // Check if the challenge exists
        if (!existingChallenge) {
            return res.send(error(404, "Challenge not found"));
        }

        // Update the challenge fields if provided
        if (name) {
            existingChallenge.name = name;
        }
        if (description) {
            existingChallenge.description = description;
        }
        if (isActive !== undefined) {
            existingChallenge.isActive = isActive;
        }
        if (rewards) {
            existingChallenge.rewards = rewards;
        }
        if (duration) {
            existingChallenge.duration = duration;
        }
     
        if (taskamount) {
            existingChallenge.taskamount = taskamount;
        }
        // Save the updated challenge to the database
        const updatedChallenge = await existingChallenge.save();

        return res.send(success(200, "Challenge updated successfully",updatedChallenge));
    } catch (err) {
        return res.send(error(500, err.message));
    }
}

export async function deleteChallengeController(req,res){
    
    try {
        const { id } = req.params; 
        await createChallengeModel.findByIdAndDelete(id) ;
        return res.send(success(200,"challenge deleted successfully"));
    } catch (err) {
        return res.send(error(500,err.message));
    }
}


export async function createTimerBasedFreeCoinsController(req,res){
    try {
        const {duration,coins} = req.body;
        if(!duration || !coins){
            return res.send(success(404,"all fields are required"));
        }
        const newTimerBasedFreeCoinsReward = new timerBasedFreeCoinsModel({duration,coins});
        await newTimerBasedFreeCoinsReward.save();
        return res.send(success(200,"new timer based free coins reward created successfully"));

    } catch (err) {

        return res.send(error(500,err.message));
    }
}
export async function createAdBasedFreeCoinsController(req,res){
    try {
        const {duration,coins} = req.body;
        if(!duration || !coins){
            return res.send(success(404,"all fields are required"));
        }
        const newAdBasedFreeCoinsReward = new adBasedFreeCoinsModel({duration,coins});
        await newAdBasedFreeCoinsReward.save();
        return res.send(success(200,"new ad based free coins reward created successfully"));

    } catch (err) {

        return res.send(error(500,err.message));
    }
}
export async function createAdBasedFreeLifesController(req,res){
    try {
        const {duration,life} = req.body;
        if(!duration || !life){
            return res.send(success(404,"all fields are required"));
        }
        const newAdBasedFreeLifesReward = new adBasedFreeLifesModel({duration,life});
        await newAdBasedFreeLifesReward.save();
        return res.send(success(200,"new add based free life reward created successfully"));

    } catch (err) {

        return res.send(error(500,err.message));
    }
}

export async function createShopController(req,res){
    try {
        const {name,coins,type,count} = req.body;
        if (!name || !coins ||!type || !count){
            return res.send(error(404,"all fields are required"));
        }

        const newShop = new shopModel({name,coins,type,count});
        await newShop.save();
        return res.send(success(200,"new shoping item  created successfully"));
    } catch (err) {
        return res.send(error(500,err.message));
    }
}
export async function updateShopController(req,res){
    try {
        const {id} = req.params;
        const {name,coins,type,count} = req.body;


        const existingShop = await shopModel.findById(id);
        if (!existingShop){
            return res.send(error(404,"no such shop exist"));
        }

        if(name){
            existingShop.name = name;
        }
        if(coins){
            existingShop.coins = coins;
        }
        if(type){
            existingShop.type = type;
        }
        if(count){
            existingShop.count = count;
        }

        await existingShop.save();
      return res.send(success(200,"shop updated successfully"));

    } catch (err) {
        return res.send(error(500,err.message));
    }
}

export async function deleteShopController(req,res){
    try {
        const {id} = req.params;
        await shopModel.findByIdAndDelete(id);
        return res.send(success(200,"shop deleted successfully"));
    } catch (err) {
        return res.send(error(500,err.message)); 
    }
}

export async  function  getShopListController(req,res){
    try {
        const shopList = await shopModel.find({});
        if(!shopList){
            return res.send(error(404,"no  shop exist")); 
        }
        return res.send(success(200,shopList));
    } catch (err) {
        return res.send(error(500,err.message)); 
    }
}

export async function getKycListController(req,res){
    try {
        const admin = req._id;
         const adminDetail = await adminModel.findById({_id:admin});
         if(!adminDetail){
            return res.send(error(404,"unauthorized access"));
         }
        const kycList = await kycModel.find({});
        return res.send(success(200, kycList,"kyc list fetch successfully"));
    } catch (err) {
        return res.send(error(500,err.message));
    }
}

export async function updateKycStatusController(req,res){
    try {
         const admin = req._id;
         const adminDetail = await adminModel.findById({_id:admin});
         if(!adminDetail){
            return res.send(error(404,"unauthorized access"));
         }
         const {status} = req.body;
         const user = req.params;
         const userDetails = await userModel.findByIdAndUpdate(user,{$set:{kycstatus:status}});
         
         const kycdetails = await kycModel.findOne({user:user});
         kycdetails.status = status;
         await kycdetails.save();
        
      
        return res.send(success(200,"user kyc details verified successfully"));

    } catch (err) {
        return res.send(error(500,err.message));
    }
}

export async function getAllWithdrawRequestController(req,res){
    try {
         const admin = req._id;
         const adminDetail = await adminModel.findById({_id:admin});
         if(!adminDetail){
            return res.send(error(404,"unauthorized access"));
         }
         const withdrawList = await WithdrawRequestModel.find({});
        return res.send(success(200,withdrawList));
    } catch (err) {
       return res.send(error(500,err.message));
    }
}

export async function updateWIthdrawRequestController(req,res){
    try {
        const admin = req._id;
        const {user} = req.params;
       
   
        const adminDetail = await adminModel.findById({_id:admin});
         if(!adminDetail){
            return res.send(error(404,"unauthorized access"));
         }

         const withdrawDetail = await WithdrawRequestModel.findOne({user:user});
         console.log(withdrawDetail);
         if(!withdrawDetail){
            return res.send(error(404,"no such request exist"));
           }
           withdrawDetail.status = true;
           await withdrawDetail.save();
           return res.send(success(200,"withdraw request has been verified successfully"));

    } catch (err) {
        return res.send(error(500,err.message));
    }
}

export async function disbursedCashController(req,res){
    try {
        const admin = req._id;
        const {user} = req.body;
       
   
        const adminDetail = await adminModel.findById({_id:admin});
         if(!adminDetail){
            return res.send(error(404,"unauthorized access"));
         }

         const userDetails = await userModel.findByIdAndUpdate({_id:user});
         if(!userDetails){
            return res.send(error(404,"no such user exist"));
         }
         const withdrawDetail = await WithdrawRequestModel.findOne({user:user});
         console.log(withdrawDetail);
         if(!withdrawDetail){
            return res.send(error(404,"no such request exist"));
           }

           const keyId = 'rzp_test_BehAvGqJTJnEZU';
           const keySecret = 'hfyIyOhCHRD71SOrL9pNToKC';
           
           const razorpay = new Razorpay({
             key_id: keyId,
             key_secret: keySecret,
           });
           
           const payoutResponse = await razorpay.payouts.create({
            account_number: "2323230055816469",
            fund_account_id: "fa_NoYldaK8MZIDHn",
            amount: 100,
            currency: "INR",
            mode: "UPI",
            purpose: "refund",
            queue_if_low_balance: true,
            reference_id: "Acme Transaction ID 12345",
            narration: "Acme Corp Fund Transfer",
            notes:{
            random_key_1: "Make it so.",
              random_key_2: "Tea. Earl Grey. Hot."
            }
           });
           console.log(payoutResponse);
          
          userDetails.INR -= withdrawDetail.amt_withdraw;
          await userDetails.save();
          
        return res.send(success(200,`${withdrawDetail.amt_withdraw} rupees has been credited to ${withdrawDetail.upi_id}`,payoutResponse))


    } catch (err) {
        return res.send(error(500,err.message));
    }
}