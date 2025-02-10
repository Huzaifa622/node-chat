import  { Router } from 'express';
import { createUser, getAllUsers, getSingleUser, logout, userLogin } from "../controllers/userController.js";
import { auth } from '../middlewares/auth.js';

const userRouter = Router();

userRouter.post('/register', createUser);
userRouter.post('/login', userLogin );
userRouter.get('/get-all-users',auth, getAllUsers );
userRouter.post('/single-user',auth, getSingleUser );
userRouter.post('/logout', logout );
export default userRouter;