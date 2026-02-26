import express from 'express';
import multer from 'multer';
import { register, login, me, uploadAvatar, logout, changePassword } from '../controllers/AuthController.js';
import {  protectCookie } from '../middlewares/auth.js';

const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();

//router.post('/register', register);
// tava dando erro no registro, vamos tentar assim

router.post('/register', upload.single("avatar"), register);


router.post('/login', login);
//router.get('/me', protect, me); // se usar header-token
router.get('/me', protectCookie, me); // se usar cookie

//router.post('/me/avatar', protect, upload.single('avatar'), uploadAvatar);
router.post('/me/avatar', protectCookie, upload.single('avatar'), uploadAvatar);

router.post('/logout', logout);

router.put("/change-password", protectCookie, changePassword);
//troca de senha

export default router;