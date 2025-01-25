import { Router } from 'express';
import { createUser } from "../controllers/userController.js";
const router = Router();
router.post('/user', createUser);
export default router;
