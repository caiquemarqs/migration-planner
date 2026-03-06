const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { prisma } = require('../config/db');
const { env } = require('../config/env');

const register = async ({ email, password, role = 'USER' }) => {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
        throw new Error('User already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
        data: {
            email,
            password_hash,
            role,
        },
        select: { id: true, email: true, role: true, createdAt: true },
    });

    const token = jwt.sign({ id: user.id, role: user.role }, env.JWT_SECRET, {
        expiresIn: '7d',
    });

    return { user, token };
};

const login = async ({ email, password }) => {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        throw new Error('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
        throw new Error('Invalid credentials');
    }

    const token = jwt.sign({ id: user.id, role: user.role }, env.JWT_SECRET, {
        expiresIn: '7d',
    });

    const userData = { id: user.id, email: user.email, role: user.role };

    return { user: userData, token };
};

const getMe = async (userId) => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, email: true, role: true, createdAt: true },
    });

    if (!user) {
        throw new Error('User not found');
    }

    return user;
};

module.exports = {
    register,
    login,
    getMe,
};
