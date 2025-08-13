import express from 'express';
import authUser from '../middlewares/authUser.js';
import { getAllOrder, getUserOrder, placedOrderCOD } from '../controllers/orderController.js';
import authSeller from '../middlewares/authSeller.js';

const orderRouter=express.Router();

orderRouter.post('/cod',authUser,placedOrderCOD);
orderRouter.get('/user',authUser,getUserOrder);
orderRouter.get('/seller',authSeller,getAllOrder);

export default orderRouter;