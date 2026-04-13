import express from 'express';
import { isAuth, login, register, logout } from '../controllers/usercontroller.js';
import authUser from '../middleware/authUser.js';

const UserRouter = express.Router();

UserRouter.post('/register', register);
UserRouter.post('/login', login);
UserRouter.get('/is-auth',authUser, isAuth);
UserRouter.get('/logout', authUser,logout);


export default UserRouter;
