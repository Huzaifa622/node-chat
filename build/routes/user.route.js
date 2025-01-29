import { Router } from 'express';
import { createUser, getAllUsers, logout, userLogin } from "../controllers/userController.js";
import { auth } from '../middlewares/auth.js';
const userRouter = Router();
userRouter.post('/user', createUser);
userRouter.post('/login', userLogin);
userRouter.get('/get-all-users', auth, getAllUsers);
userRouter.post('/logout', auth, logout);
export default userRouter;
