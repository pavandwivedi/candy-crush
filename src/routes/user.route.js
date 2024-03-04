import express from 'express';
import { authenticLoginController, facebookLoginController, getUnlockLevels, getUserController, guestLoginController, referAndEarnController, updateUserController, userShopController, userUpdateController } from "../controllers/user.controller.js" ;
import { checkUserLogin } from '../middlewares/middlewares.js';

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
export default userRouter;