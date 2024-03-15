import express from 'express';
import { adBasedFreeCoinsController, adBasedFreeLifesController, authenticLoginController, dailyRewardController, facebookLoginController,  getUnlockLevels, getUserController, guestLoginController, referAndEarnController, timerBasedFreeCoinsController, updateUserController, userShopController, userUpdateController } from "../controllers/user.controller.js" ;
import { checkUserLogin } from '../middlewares/middlewares.js';
import { getChallengeController, getShopListController } from '../controllers/admin.controller.js';

const userRouter = express.Router();

userRouter.post('/authLogin',authenticLoginController);
userRouter.post('/guestLogin',guestLoginController);
userRouter.post('/facebookLogin',facebookLoginController);
userRouter.get('/get',checkUserLogin , getUserController);
userRouter.put('/update',checkUserLogin,userUpdateController);
userRouter.post('/refer',checkUserLogin,referAndEarnController);
userRouter.put('/shop',checkUserLogin,userShopController);
userRouter.get("/unlockLevelCount",checkUserLogin,getUnlockLevels);
userRouter.put('/updateUser',checkUserLogin,updateUserController);
userRouter.get('/getchallenge',getChallengeController);
userRouter.get('/getshoplist',getShopListController);
userRouter.post('/collectdailyreward',checkUserLogin,dailyRewardController);
userRouter.post('/timerbasedfreecoins',checkUserLogin,timerBasedFreeCoinsController );
userRouter.post('/adbasedfreecoins',checkUserLogin,adBasedFreeCoinsController );
userRouter.post('/adbasedfreelifes',checkUserLogin,adBasedFreeLifesController );


export default userRouter;