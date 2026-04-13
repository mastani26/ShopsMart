import express from 'express';
import { isSellerAuth, sellerLogin, sellerlogout } from '../controllers/sellercontroller.js';
import authseller from '../middleware/authseller.js';

const sellerRouter = express.Router();

sellerRouter.post('/login',sellerLogin);
sellerRouter.get('/is-auth',authseller,isSellerAuth);
sellerRouter.get('/logout',sellerlogout);

export default sellerRouter;