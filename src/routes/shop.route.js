import express from 'express';
import { checkUserLogin } from '../middlewares/middlewares.js';
import { getShoppingListController, purchaseShopController } from '../controllers/shop.controller.js';

const shopRouter = express.Router();

shopRouter.post('/purchase',checkUserLogin,purchaseShopController);
shopRouter.get('/getshoppinglist',checkUserLogin,getShoppingListController);




export default shopRouter;