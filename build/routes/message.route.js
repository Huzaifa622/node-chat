import { Router } from 'express';
import { auth } from '../middlewares/auth.js';
import { checkChatroom } from '../middlewares/checkCheckroom.js';
import { getAllMessages, sendMessage } from '../controllers/userMessage.js';
const msgRouter = Router();
msgRouter.get('/get-all-messages', auth, checkChatroom, getAllMessages);
msgRouter.post('/send', auth, checkChatroom, sendMessage);
export default msgRouter;
