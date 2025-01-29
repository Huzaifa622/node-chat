import  { Router } from 'express';
// import { createUser, getAllUsers, logout, userLogin } from "../controllers/userController.js";
import { auth } from '../middlewares/auth.js';
import { createChatroom } from '../controllers/chatroomController.js';

const chatRouter = Router();

chatRouter.post('/create-room',auth, createChatroom);

export default chatRouter;