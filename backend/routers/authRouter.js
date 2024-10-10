import express from 'express';
import {authCheck, signup, login, logout } from '../controllers/authController.js';
import { protectRouter } from '../middlewares/protectRouter.js';

const router = express.Router();

router.post('/signup', signup);

router.post('/login', login);

router.post('/logout', logout);

router.get('/authCheck', protectRouter, authCheck);

export default router;
