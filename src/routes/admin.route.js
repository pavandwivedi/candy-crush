import express from "express";
import { createAdBasedFreeCoinsController, createAdBasedFreeLifesController, createChallengeController, createShopController, createTimerBasedFreeCoinsController, deleteChallengeController, deleteShopController, getAllUsers,  loginController, signupController, updateChallengeController, updateShopController } from "../controllers/admin.controller.js";
import { checkAdminLogin } from "../middlewares/middlewares.js";

const adminRouter = express.Router();


adminRouter.post("/signup",signupController);
adminRouter.post("/login",loginController);
adminRouter.get("/getallusers",checkAdminLogin,getAllUsers);
adminRouter.post('/createchallenge',checkAdminLogin,createChallengeController);
adminRouter.put('/updatechallenge/:id',checkAdminLogin,updateChallengeController);
adminRouter.delete('/deletechallenge/:id',checkAdminLogin,deleteChallengeController);
adminRouter.post('/createtimerbasedfreecoinsrewards',checkAdminLogin,createTimerBasedFreeCoinsController);
adminRouter.post('/createadbasedfreecoinsrewards',checkAdminLogin,createAdBasedFreeCoinsController);
adminRouter.post('/createadbasedfreelifesRewards',checkAdminLogin,createAdBasedFreeLifesController);
adminRouter.post('/createshop',checkAdminLogin,createShopController);
adminRouter.put('/updateshop/:id',checkAdminLogin,updateShopController);
adminRouter.delete('/deleteshop/:id',checkAdminLogin,deleteShopController);

export default adminRouter;
