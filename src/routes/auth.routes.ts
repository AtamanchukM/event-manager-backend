import {Router} from 'express';
import { register, login, getAllUsers, resetDatabase } from '../contollers/auth.controller';

const router = Router();
router.post('/register', register);
router.post('/login', login);
router.get('/users', getAllUsers);
router.post('/reset-db', resetDatabase);
export default router;