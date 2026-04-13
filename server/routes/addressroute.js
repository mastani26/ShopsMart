import express from 'express';
import authUser from '../middleware/authUser.js';
import { addaddress, getaddress } from '../controllers/addresscontroller.js';

const addressRouter = express.Router();

addressRouter.post('/add', authUser, addaddress);
addressRouter.get('/get', authUser, getaddress);  // ✅ GET

export default addressRouter;
