import express from 'express';
import { checkUserLogin } from '../middlewares/middlewares.js';
import { getAllChallengesController, insertChallengeController, updateChallengeController, updateChallengeTimeController } from '../controllers/challenge.controller.js';


const challengeRouter = express.Router();

challengeRouter.post('/insert',checkUserLogin,insertChallengeController);
 challengeRouter.get('/get',checkUserLogin,getAllChallengesController);
// challengeRouter.get('/get/:id',checkUserLogin,getChallengeByIdController);
challengeRouter.put('/update',checkUserLogin,updateChallengeController);
challengeRouter.put('/updatetime',checkUserLogin,updateChallengeTimeController);
// challengeRouter.delete('/delete/:id',checkUserLogin,deleteChallengeController);

export default challengeRouter;