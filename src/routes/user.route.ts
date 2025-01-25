import  { Router } from 'express';
import { createUser, logout, userLogin } from "../controllers/userController.js";
import { auth } from '../middlewares/auth.js';

const userRouter = Router();

userRouter.post('/user', createUser);
userRouter.post('/login', userLogin );
userRouter.post('/get-all-users',auth, userLogin );
userRouter.post('/logout',auth , logout );
export default userRouter;