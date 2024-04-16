import createChallengeModel from "../models/admin.challenge.model.js";
import challengeModel from "../models/challenge.model.js";
import { userModel } from "../models/user.model.js";
import {error,success} from "../services/responseWrapper.js"


export async function insertChallengeController(req, res) {
    try {
      const user= req._id;
      const { name } = req.body;
      const startTime = new Date();
      const currUser = await userModel.findById(user);
      if (!currUser) {
        return res.send(error(404, 'User not found'));
      }
        const existingChallenge = await challengeModel.findOne({name});
        if(existingChallenge){
            await challengeModel.deleteOne({name});
        }
      const challengeDetails = await createChallengeModel.findOne({ name });
      if (!challengeDetails) {
        return res.send(error(404, 'Challenge not found'));
      }
  
      if (!challengeDetails.isActive) {
        return res.send(error(400, 'Challenge is not active'));
      }
  
      // const endTime = new Date(starttime);
      // endTime.setMilliseconds(endTime.getMilliseconds() + challengeDetails.duration);
  
      const challengeInfo = new challengeModel({ user,startTime,name });
      const createdChallenge = await challengeInfo.save();
  
      
  
      currUser.challenges.push(createdChallenge._id);
      await currUser.save();
  
      return res.send(success(200, "Challenge started successfully"));
    } catch (err) {
      return res.send(error(500, err.message));
    }
  }
export async function updateChallengeTimeController(req,res){
    try {

        const user = req._id;
        const {name ,remainingLevel} = req.body;
        const currUser = await userModel.findById(user);
      if (!currUser) {
        return res.send(error(404, 'User not found'));
      }

        const challengeDetails = await createChallengeModel.findOne({ name });
        console.log(challengeDetails)
        const challengeInfo = await challengeModel.findOne({name});
        // const now = new Date(); // Current UTC date
        // const utcOffset = 5.5 * 60 * 60 * 1000; // Indian Standard Time (IST) offset in milliseconds (UTC+5:30)
        // const istTime = new Date(now.getTime() + utcOffset); // Convert UTC to IST
        const endTime = new Date();
        const startTime = challengeInfo.startTime
        const timePlayed = endTime-startTime
        const challengeDuration = challengeDetails.duration
        const remainingTime = challengeDuration-timePlayed
        
        // if (status === "win") {
        //     // Assuming rewards is defined somewhere in your code
        //     currUser.INR += challengeDetails.rewards;
        //     await currUser.save();
        //   }

          challengeInfo.remainingTime = remainingTime;
          challengeInfo.remainingLevel = remainingLevel;
          challengeInfo.endTime = endTime;
          await challengeInfo.save();
          return res.send(success(200,"challenge is incomplete,! please complete it"))
    } catch (err) {
        return res.send(error(500,err.message));
    }
}
export async function updateChallengeController(req,res){
  try {

      const user = req._id;
      const {name ,status} = req.body;
      const currUser = await userModel.findById(user);
    if (!currUser) {
      return res.send(error(404, 'User not found'));
    }

      const challengeDetails = await createChallengeModel.findOne({ name });
      console.log(challengeDetails)
      const challengeInfo = await challengeModel.findOne({name});
      const endTime = new Date();

      if (status === "complete") {
          // Assuming rewards is defined somewhere in your code
          currUser.INR += challengeDetails.rewards;
          await currUser.save();
        }
        challengeInfo.endTime = endTime;
        challengeInfo.status = status;
        await challengeInfo.save();
        return res.send(success(200,"challenge completed successfully"))
  } catch (err) {
      return res.send(error(500,err.message));
  }
}
export async function getAllChallengesController(req,res){
    try {
        console.log("pavan");
        const user = req._id;
        const currUser = await userModel.findById(user);
        if (!currUser) {
            return res.send(error(404,'User does not exist!'));
          }
        const allChallenges = await challengeModel.find({user}).populate('user');
        if (!allChallenges){
            return res.send(error(404,"no challenge have been played by you"));
        }
         console.log(allChallenges);
        return res.send(success(200,allChallenges));
       

    } catch (err) {
        return res.send(error(500,err.message));
    }
}