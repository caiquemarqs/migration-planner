const { z } = require('zod');
const authService = require('../services/auth.service');

const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    role: z.enum(['USER', 'AFFILIATE', 'ADMIN']).optional(),
});

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string(),
});

const register = async (req, res, next) => {
    try {
        const validatedData = registerSchema.parse(req.body);
        const result = await authService.register(validatedData);

        res.status(201).json({
            status: 'success',
            data: result,
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ status: 'fail', errors: error.errors });
        }
        if (error.message === 'User already exists') {
            return res.status(409).json({ status: 'fail', message: error.message });
        }
        next(error);
    }
};

const login = async (req, res, next) => {
    try {
        const validatedData = loginSchema.parse(req.body);
        const result = await authService.login(validatedData);

        res.status(200).json({
            status: 'success',
            data: result,
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ status: 'fail', errors: error.errors });
        }
        if (error.message === 'Invalid credentials') {
            return res.status(401).json({ status: 'fail', message: error.message });
        }
        next(error);
    }
};

const getMe = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const user = await authService.getMe(userId);

        res.status(200).json({
            status: 'success',
            data: { user },
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    register,
    login,
    getMe,
};
