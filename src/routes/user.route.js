import express from 'express';
import { adBasedFreeCoinsController, adBasedFreeLifesController, authenticLoginController, dailyRewardController, facebookLoginController,  getUnlockLevels, getUserController, guestLoginController, kycController, referAndEarnController, timerBasedFreeCoinsController, updateCoinsController, updateLifesController, updateUserController, userShopController, userUpdateController, withdrawRequestController } from "../controllers/user.controller.js" ;
import { checkUserLogin } from '../middlewares/middlewares.js';
import { getChallengeController, getShopListController } from '../controllers/admin.controller.js';
import upload from '../middlewares/upload.js';

const userRouter = express.Router();

userRouter.post('/authLogin',authenticLoginController);
userRouter.post('/guestLogin',guestLoginController);
userRouter.post('/facebookLogin',facebookLoginController);
userRouter.get('/get',checkUserLogin , getUserController);
userRouter.put('/update',checkUserLogin,userUpdateController);
userRouter.post('/updatecoins',checkUserLogin,updateCoinsController);
userRouter.post('/updatelifes',checkUserLogin,updateLifesController);
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
userRouter.post('/kyc',checkUserLogin,upload.array('files'),kycController);
userRouter.post('/withdrawrequest',checkUserLogin,withdrawRequestController);


export default userRouter;