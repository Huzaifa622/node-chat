import  { Router } from 'express';
import { createUser, getAllUsers, logout, userLogin } from "../controllers/userController.js";
import { auth } from '../middlewares/auth.js';
import { checkChatroom } from '../middlewares/checkCheckroom.js';
import { getAllMessages } from '../controllers/userMessage.js';

const msgRouter = Router();

 msgRouter.get('/get-all-messages',auth, checkChatroom , getAllMessages);

export default  msgRouter;
