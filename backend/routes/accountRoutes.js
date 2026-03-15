import express from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import { getBalance, getStatement, transferMoney, getUsers } from '../controllers/accountController.js';

const router = express.Router();

router.use(protect); // All account routes are protected

router.get('/balance', getBalance);
router.get('/statement', getStatement);
router.post('/transfer', transferMoney);

export default router;
