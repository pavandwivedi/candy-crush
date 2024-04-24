import createChallengeModel from "../models/admin.challenge.model.js";
import challengeModel from "../models/challenge.model.js";
import { userModel } from "../models/user.model.js";
import {error,success} from "../services/responseWrapper.js"
import CompletedChallenge from "../models/completedChallenge.js";

  export async function insertChallengeController(req, res) {
      try {
        const user= req._id;
        const { name } = req.body;
        // const startTime = new Date();
        const currUser = await userModel.findById(user);
        if (!currUser) {
          return res.send(error(404, 'User not found'));
        }

          const activeChallenge = await challengeModel.findOne({user,status:"incomplete"})
          if(activeChallenge){
            return res.send(error(400,'You already have a active challenge.Complete it before starting New One' ))
          }
         
        const challengeDetails = await createChallengeModel.findOne({ name });
        if (!challengeDetails) {
          return res.send(error(404, 'Challenge not found'));
        }
    
        if (!challengeDetails.isActive) {
          return res.send(error(400, 'Challenge is not active'));
        }
        const now = new Date(); 
    const utcOffset = 5.5 * 60 * 60 * 1000; 
    const istTime = new Date(now.getTime() + utcOffset); 
    const startTime = istTime;
    const endTime = new Date(startTime.getTime() + challengeDetails.duration);

    
        // const endTime = new Date(starttime);
        // endTime.setMilliseconds(endTime.getMilliseconds() + challengeDetails.duration);
    
        const challengeInfo = new challengeModel({ 
          user,
          startTime,
        endTime,
          name,
          duration:challengeDetails.duration,
          taskamount:challengeDetails.taskamount,
          status: "incomplete",
          referenceId: challengeDetails.referenceId
        });
        const createchallenges = await challengeInfo.save();
    
        
    
        currUser.challenges.push({challengeId:createchallenges._id,referenceId:challengeDetails.referenceId});
        await currUser.save();

        const response = {
          _id: createchallenges._id,
          name: createchallenges.name,
          startTime: createchallenges.startTime,
          status: createchallenges.status,
          user: createchallenges.user,
          duration:createchallenges.duration,
          taskamount:createchallenges.taskamount,
          referenceId:challengeDetails.referenceId
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
      const challengeInfo = await challengeModel.findOne({name,user})
      if(!challengeInfo){
        return res.send(error(400, "No Challenge Found for this user exists"));
      }
      const existingChallenge = await challengeModel.findOne({name,user});
      if (!existingChallenge) {
        return res.send(error(400, "No Challenge Found for this user exists"));
      }

      if (status === "complete" && challengeInfo.status === "complete") {
          // Assuming rewards is defined somewhere in your code
          currUser.INR += challengeDetails.rewards;
          // currUser.challenges = currUser.challenges.filter(challengeId => challengeId.toString() !==challengeInfo._id.toString())
          await currUser.save();

          const completedChallenge = new CompletedChallenge({
            user:user,
            challenge: challengeInfo._id,
           status:status,
           referenceId:challengeInfo.referenceId
          })
          console.log(completedChallenge)
          await completedChallenge.save();
        }
       existingChallenge.status = status
       await existingChallenge.save();

       await challengeModel.findOneAndDelete({name,user})

        return res.send(success(200,"challenge completed successfully"))
  } catch (err) {
      return res.send(error(500,err.message));
  }
}
export async function getAllChallengesController(req,res){
    try {
      if(!req._id){
        return 
      }
        const user = req._id;
        const currUser = await userModel.findById(user);
        if (!currUser) {
            return res.send(error(404,'User does not exist!'));
          }
      
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
            taskamount:challenge.taskamount
            
        };
    });
 console.log(challengesResponse)

         console.log(allChallenges);
        return res.send(success(200,allChallenges));
       

    } catch (err) {
        return res.send(error(500,err.message));
    }
}

export async function getCompletedChallengesController(req,res){
  try {
    const user = req._id

    const completedchallenges = await CompletedChallenge.find({user,status:'complete'}).populate('challenge')

    if(completedchallenges.length ===0){
      return res.send(error(404,'No Completed Challenges Found',[]))
    }
    return res.send(success(200,'Completed Challenges',completedchallenges))
  }catch (err){
    return res.send(error(500,err.message));
  }
}