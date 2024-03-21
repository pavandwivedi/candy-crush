import { guestModel } from "../models/user.model.js";
import { authModel } from "../models/user.model.js";
import { userModel } from "../models/user.model.js";
import {facebookModel} from "../models/user.model.js";
import { generateAccessToken } from "../services/generateAccessToken.js";
import { error, success } from "../services/responseWrapper.js";
import { generateUniqueReferralCode } from "../services/generateReferalCode.js";
import dailyRewardModel from "../models/dailyreward.model.js";

import timerBasedCoinsModel from "../models/timerbasedfreecoins.model.js";
import adBasedCoinsModel from "../models/adbasedfreecoins.model.js";
import adBasedLifesModel from "../models/adbasedfreelifes.model.js";
import kycModel from "../models/user.kyc.model.js";
import WithdrawRequestModel from "../models/user.withdrawrequest.model.js";



export async function guestLoginController(req, res) {
    try {
        const { deviceID } = req.body;
        console.log(deviceID);
       
        if (!deviceID) {
            return res.send(error(422, "insufficient data"));
        }
       
        const  existingUser = await guestModel.findOne({ deviceID });
       
        if (!existingUser) {
           
            const referralCode = generateUniqueReferralCode();
          
            const newUser = await guestModel.create({deviceID,referralCode});
            
            const accessToken = generateAccessToken({ ...newUser })
            return res.send(success(200,{accessToken, isNewUser: true}))
        }

        const accessToken = generateAccessToken({ ...existingUser });
        return res.send(success(200, {accessToken, isNewUser: false}));
    } catch (err) {
      
        return res.send(error(500, err.message));
    }
}

// export async function authenticLoginController(req, res) {
//     try {
//         const { email,deviceID } = req.body;
//         if ( !email || !deviceID) {
//             return res.send(error(422, "insufficient data"));
//         }
    
//         // Find existing user with the same email
//         const guestUser = await guestModel.findOne({deviceID});
//         const existingUser = await authModel.findOne({ email });
        
//         if (!existingUser) {
//             console.log('pavan')
//             // Generate referral code only for new users
//             const referralCode = generateUniqueReferralCode();
//             const newUser = new authModel({ email, referralCode });
//             await newUser.save();
//             const accessToken = generateAccessToken({ ...newUser })
//             return res.send(success(200,{accessToken, isNewUser: true}))
//         } 

//         const accessToken = generateAccessToken({ ...existingUser });
//         return res.send(success(200, { accessToken, isNewUser:false }));

//     } catch (err) {
//         return res.send(error(500, err.message));
//     }
// }
export async function authenticLoginController(req, res) {
    try {
        const { email, deviceID ,name} = req.body;
        if (!email || !deviceID || !name) {
            return res.send(error(422, "insufficient data"));
        }
    
        // Find existing user with the same email
        const guestUser = await guestModel.findOne({ deviceID });
        
        const existingUser = await authModel.findOne({ email });
        
        if (!existingUser) {
            
            // Generate referral code only for new users
            const referralCode = generateUniqueReferralCode();
            const newUser = new authModel({ email,name, referralCode });

            // Transfer guest user data to authenticated user
            if (guestUser) {
                newUser.life = guestUser.life; // Assuming name is a field you want to transfer
                newUser.coins = guestUser.coins;
                newUser.extraball = guestUser.extraball;
                newUser.fireball = guestUser.fireball;
                newUser.colorball = guestUser.colorball;
                newUser.levels = guestUser.levels;
                 
            }

            await newUser.save();

            // Delete guest user
            if (guestUser) {
                await guestModel.deleteOne({ _id: guestUser._id });
            }

            const accessToken = generateAccessToken({ ...newUser });
            return res.send(success(200, { accessToken, isNewUser: true }));
        } 

        const accessToken = generateAccessToken({ ...existingUser });
        return res.send(success(200, { accessToken, isNewUser: false }));

    } catch (err) {
        return res.send(error(500, err.message));
    }
}
export async function facebookLoginController(req, res) {
    try {
        const { facebookID, deviceID } = req.body;
        if (!facebookID  &&  !deviceID ) {
            return res.send(error(422, "insufficient data"));
        }
    
    
        // Find existing user with the same email
        const guestUser = await guestModel.findOne({ deviceID });
        var existingUser;
        if(facebookID){
             existingUser = await facebookModel.findOne({ facebookID });
        }
       

        
        
        if (!existingUser) {
            
            // Generate referral code only for new users
            const referralCode = generateUniqueReferralCode();
            const newUser = new facebookModel({  
                referralCode, 
                facebookID
                
            });
            

            // Transfer guest user data to authenticated user
            if (guestUser) {
                newUser.life = guestUser.life; // Assuming name is a field you want to transfer
                newUser.coins = guestUser.coins;
                newUser.extraball = guestUser.extraball;
                newUser.fireball = guestUser.fireball;
                newUser.colorball = guestUser.colorball;
                newUser.levels = guestUser.levels;
                 
            }

            await newUser.save();

            // Delete guest user
            if (guestUser) {
                await guestModel.deleteOne({ _id: guestUser._id });
            }

            const accessToken = generateAccessToken({ ...newUser });
            return res.send(success(200, { accessToken, isNewUser: true }));
        } 

        const accessToken = generateAccessToken({ ...existingUser });
        return res.send(success(200, { accessToken, isNewUser: false }));

    } catch (err) {
        return res.send(error(500, err.message));
    }
}



export async function getUserController(req,res){
    try {
        
        const currUserId = req._id;
        
        const user = await userModel.findOne({_id:currUserId});
        
        if(!user)
        return res.send("user not found!");

        return res.send(success(200,user));
    } catch (err) {
        return res.send(error(500,err.message))
    }
}

export async function userUpdateController(req, res) {
    try {
        const userId = req._id;
        const { coins, life, extraball, fireball, colorball } = req.body;

        const user = await userModel.findById(userId);

        // Store the original referral code
        const originalReferralCode = user.referralCode;

        // Update user's fields
        user.coins += coins || 0;
        user.life += life || 0;
        user.extraball += extraball || 0;
        user.fireball += fireball || 0;
        user.colorball += colorball || 0;

        // Save the user
        await user.save();

        // Restore the original referral code
        user.referralCode = originalReferralCode;

        return res.send(success(200, user));
    } catch (err) {
        return res.send(error(500, err.message));
    }
}
export async function updateCoinsController(req, res) {
    try {
        const userId = req._id;
        const { coins } = req.body;

        const user = await userModel.findById(userId);

        // Store the original referral code
        const originalReferralCode = user.referralCode;

        // Update user's fields
        user.coins += coins || 0;
     

        // Save the user
        await user.save();

        // Restore the original referral code
        user.referralCode = originalReferralCode;

        return res.send(success(200, user));
    } catch (err) {
        return res.send(error(500, err.message));
    }
}
export async function updateLifesController(req, res) {
    try {
        const userId = req._id;
        const { life } = req.body;

        const user = await userModel.findById(userId);

        // Store the original referral code
        const originalReferralCode = user.referralCode;

        // Update user's fields
        user.life += life || 0;
     

        // Save the user
        await user.save();

        // Restore the original referral code
        user.referralCode = originalReferralCode;

        return res.send(success(200, user));
    } catch (err) {
        return res.send(error(500, err.message));
    }
}
export async function referAndEarnController(req, res) {
    const currUser = req._id;
    const { referralCode } = req.body;
    try {
        const referrer = await userModel.findOne({ referralCode });

        if (!referrer) {
            return res.send(error(404, "referrer user not found"));
        }

        const referred = await userModel.findById(currUser);

        if (!referred) {
            return res.send(error(404, "referred user not found"));
        }

        // Store the original referral code of both referrer and referred
        const originalReferralCodeReferrer = referrer.referralCode;
        const originalReferralCodeReferred = referred.referralCode;

        // Perform the referral and earn operations
        referrer.coins += 20;
        referrer.referedCount++;
        await referrer.save();

        referred.coins += 10;
        referred.isReferUsed = true;
        await referred.save();

        // Restore the original referral codes
        referrer.referralCode = originalReferralCodeReferrer;
        referrer.isReferred = true;
        await referrer.save();

        referred.referralCode = originalReferralCodeReferred;
        await referred.save();

        return res.send(success(200, "You have earned 10 coins by referral successfully"));

    } catch (err) {
        return res.send(error(500, err.message));
    }
}
export async function updateUserController (req,res){
    try {
        const userID = req._id;
        const user = await userModel.findById(userID);
        user.isReferred = false;
        await user.save();
        return res.send(success(200,"user updated successfully"))
    } catch (err) {
        return res.send(error(500,err.message));
    }
}

export async function userShopController(req,res){
    try {
        const {coins} = req.body;
        const userId = req._id;
        const  user = await userModel.findById({_id:userId});
        const originalReferralCode = user.referralCode;
        if (coins==50){
            user.life+=1;
            user.coins-=50;
        }
        if(coins==150){
            user.colorball+=5;
            user.coins-=150;
        }
        if(coins==140){
            user.extraball+=3;
            user.coins-=140;
        }
        if(coins==180){
            user.life+=4;
            user.coins-=180;
        }
        if(coins==250){
            user.fireball+=5;
            user.coins-=250;
        }

        await user.save();
        user.referralCode = originalReferralCode;
        return res.send(success(200,user));
    } catch (err) {
        return res.send(error(500,err.message));
    }
}
export async function getUnlockLevels(req,res){
    try {
        const id = req._id;
        const user = await userModel.findById(id);
        const unlockLevelcount = user?.Levels?.length;
        return res.send(success(200,{unlockLevelcount}));
    } catch (err) {
        return res.send(error(500,err.message));
    }
}

export async function dailyRewardController(req,res){
    try {
       const user = req._id;
        const { collectedamount} = req.body;
        if (!collectedamount){
            return res.send(error(404,"insufficient data"));
        }
        const currUser = await userModel.findById(user);
        if (!currUser){
            return res.send(error(404,"no such user exist"));
        }
        const existingDailyReward = await dailyRewardModel.findOne({user:user}  );
        if (existingDailyReward) {
            await dailyRewardModel.findByIdAndDelete(existingDailyReward._id);
        }
        
        const dailyRewardInfo = new dailyRewardModel({user,collectedamount,collectedtime:new Date()});
        const dailyReward = await dailyRewardInfo.save();
        currUser.coins += collectedamount;
        currUser.dailyrewards.push(dailyReward._id);
     
        await currUser.save();
        return res.send(success(200,"daily reward collected successfully",{dailyReward}));

    } catch (err) {
        return res.send(error(500,err.message));
    }
}


  export async function timerBasedFreeCoinsController(req,res){
    try {
        const user = req._id;
        const {collectedamount} = req.body;
        const currUser = await userModel.findById(user);
        if (!currUser) {
          return res.status(404).send(error(404, 'User not found'));
        }

        const  existingFreeCoinsData = await timerBasedCoinsModel.findOne({ user: user }); 

        if (existingFreeCoinsData){
            await  timerBasedCoinsModel.findByIdAndDelete(existingFreeCoinsData._id);
        }



       const freeCoinsData = new timerBasedCoinsModel({user,collectedamount,collectedtime:new Date()});
        const savedFreeCoinsData = await  freeCoinsData.save();
        currUser.coins += collectedamount;
        currUser.timerbasedfreecoins.push(savedFreeCoinsData ._id);
     
        await currUser.save();
        return res.send(success(200,"daily reward collected successfully",{savedFreeCoinsData}));
    } catch (err) {
        return res.send(error(500, err.message));
    }
  }
  export async function adBasedFreeCoinsController(req,res){
    try {
        const user = req._id;
        const {collectedamount} = req.body;
        const currUser = await userModel.findById(user);
        if (!currUser) {
          return res.status(404).send(error(404, 'User not found'));
        }

        const  existingFreeCoinsData = await adBasedCoinsModel.findOne({ user: user }); 

        if (existingFreeCoinsData){
            await  adBasedCoinsModel.findByIdAndDelete(existingFreeCoinsData._id);
        }



       const freeCoinsData = new adBasedCoinsModel({user,collectedamount,collectedtime:new Date()});
        const savedFreeCoinsData = await  freeCoinsData.save();
        currUser.coins += collectedamount;
        currUser.adbasedfreecoins.push(savedFreeCoinsData._id);
     
        await currUser.save();
        return res.send(success(200,"daily reward collected successfully",{savedFreeCoinsData}));
    } catch (err) {
        return res.send(error(500, err.message));
    }
  }

  export async function adBasedFreeLifesController(req,res){
    try {
        const user = req._id;
        const {collectedlifes} = req.body;
        const currUser = await userModel.findById(user);
        if (!currUser) {
          return res.status(404).send(error(404, 'User not found'));
        }

        const  existingFreeLifeData = await adBasedLifesModel.findOne({ user: user }); 

        if (existingFreeLifeData){
            await  adBasedLifesModel.findByIdAndDelete(existingFreeLifeData._id);
        }



       const freeLifeData = new adBasedLifesModel({user,collectedlifes,collectedtime:new Date()});
        const savedFreeLifeData = await  freeLifeData.save();
        currUser.life += collectedlifes;
        currUser.adbasedfreelifes.push(savedFreeLifeData._id);
     
        await currUser.save();
        return res.send(success(200,"daily reward collected successfully",{savedFreeLifeData}));
    } catch (err) {
        return res.send(error(500, err.message));
    }
  }

  // do kyc of a player 
  export async function kycController(req, res) {
    try {
         const user = req._id;
         
      const { firstName, lastName, adharNumber, panNumber, reason } = req.body;
      
      if (!firstName || !lastName || !adharNumber || !panNumber) {
        return res.status(400).send({ error: 'All fields are required for KYC verification' });
      }
      
      const uploadedImage1 = req.files[0];
     
      const uploadedImage2 = req.files[1];
     
      const uploadedImage3 = req.files[2];
      
      
        const adharFrontPath = uploadedImage1.path;
     
        const adharBackPath = uploadedImage2.path;
        const panFrontPath = uploadedImage3.path;
  
        // Save KYC details and file paths to the user document in the 
        const kycdetails = new kycModel({firstName,
            lastName,
            adharNumber,
            panNumber,
            adharFront:adharFrontPath,
            adharBack:adharBackPath,
            panFront:panFrontPath,
            reason,
            user
        });
        await kycdetails.save();
  
        
  
       return res.send(success(200, "player request for kyc successfully"));
    
    } catch (err) {
      return res.send(error(500,err.message));
    }
  }

  export async function withdrawRequestController(req,res){
    try {
        const { amt_withdraw,payment_type,upi_id,mobile_number,reason} = req.body;

        if (!amt_withdraw || !payment_type || !upi_id || !mobile_number || !reason ) {
            return res.send(error(403,"all fields are required"));
        }
         const user = req._id;
         const userInfo = await userModel.findById(user);
         if(!userInfo){
            return res.send(error(404,"no such user exist"));
         }

         if(userInfo.INR < amt_withdraw){
            return res.send(error(404,`you have only ${amt_withdraw} in your wallet , please play the challenge to increase INR`  ));
         }
         const newWithdrawRequest = new WithdrawRequestModel({amt_withdraw,payment_type,upi_id,mobile_number,reason,user});
          await newWithdrawRequest.save();
     return res.send(success(200,` request for ${amt_withdraw } rupees have  been sent successfully,please wait for 3-4 hours for payment processing `));

    } catch (err) {
        return res.send(error(500,err.message));
    }
  }