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

          const activeChallenge = await challengeModel.findOne({user,status:"incomplete"})
          if(activeChallenge){
            return res.send(error(400,'You already have a active challenge.Complete it before starting New One' ))
          }
          const existingChallenge = await challengeModel.findOne({name,status:"incomplete"});
          if(existingChallenge){
            return res.send(error(400,'You already have a active challenge.Complete it before starting New One' ))
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

        const response = {
          _id: createdChallenge._id,
          name: createdChallenge.name,
          startTime: createdChallenge.startTime,
          status: createdChallenge.status,
          user: createdChallenge.user,
          duration:createdChallenge.duration
      };

    
        return res.send(success(200, "Challenge started successfully",response));
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
       
        // const currentTime = new Date();
        // // const endTime = new Date();
        const startTime = new Date (challengeInfo.startTime)
        const endTime = new Date(startTime.getTime() + challengeDetails.duration);
        const challengeDuration = challengeDetails.duration
        const remainingTime = challengeDuration-endTime
        
        if(remainingTime <0){
          remainingTime = 0
        }
          challengeInfo.remainingTime = remainingTime 
          challengeInfo.remainingLevel = remainingLevel;
          
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
      const challengeInfo = await challengeModel.findOne({name})
      

      if (status === "complete") {
          // Assuming rewards is defined somewhere in your code
          currUser.INR += challengeDetails.rewards;
          currUser.challenges = currUser.challenges.filter(challengeId => challengeId.toString() !==challengeInfo._id.toString())
          await currUser.save();
        }

        const challengeDelete = await challengeModel.findOneAndDelete({name,user});
      if(!challengeInfo){
        return res.send(error(404,"No challenge have been played by you"));
      }
       
        challengeInfo.endTime = endTime;
        challengeInfo.status = status;
        await challengeInfo.delete();
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
        // const allChallenges = await challengeModel.find({user}).populate('user');
        // if (!allChallenges){
        //     return res.send(error(404,"no challenge have been played by you"));
        // }
        const completedChallenges = await challengeModel.find({user})

        const ongoingChallenges = await challengeModel.find({user, remainingTime:{$gt: 0}})

        const allChallenges = [...completedChallenges,...ongoingChallenges]

      if(allChallenges.length === 0) {
        return res.send(error(404,"no challenge have been played by you"));
      }

      const challengesResponse = allChallenges.map(challenge => {
        return {
            _id: challenge._id,
            name: challenge.name,
            startTime: challenge.startTime,
            remainingTime: challenge.remainingTime,
            status: challenge.status,
            duration: challenge.duration,
            
        };
    });
 console.log(challengesResponse)

         console.log(allChallenges);
        return res.send(success(200,allChallenges));
       

    } catch (err) {
        return res.send(error(500,err.message));
    }
}