import { Router } from 'express';

import * as userController from '../controllers/user.controller';
import { auth } from '../middlewares/auth.middleware';
import { UserModel } from '../models/user.model';

const router = Router();

router.post('/register', userController.registerUser);

router.post('/login', userController.loginUser);

router.put('/score', auth, userController.updateUserScore);

router.get('/top10', async (req, res) => {
    const top10 = await UserModel.find().sort({ score: -1 }).limit(10).select('username score');
    res.json(top10);
});

export default router;
