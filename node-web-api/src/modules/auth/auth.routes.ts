import { Router } from 'express';
import { AuthController } from './auth.controller';
import { validate } from '../../core/middleware/validation';
import { loginSchema, registerSchema, refreshTokenSchema } from '../../schemas/auth.schema';

const router = Router();
const authController = new AuthController();

router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.post('/refresh-token', validate(refreshTokenSchema), authController.refreshToken);

export default router;

