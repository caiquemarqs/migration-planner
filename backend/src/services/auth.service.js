const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { prisma } = require('../config/db');
const { env } = require('../config/env');

const register = async ({ email, password, name, cpf, role = 'USER' }) => {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
        throw new Error('User already exists');
    }

    if (cpf) {
        const existingCpf = await prisma.user.findUnique({ where: { cpf } });
        if (existingCpf) {
            throw new Error('CPF already registered');
        }
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const userData = { email, password_hash, role, name, cpf };
    if (role === 'AFFILIATE') {
        const code = Math.random().toString(36).substring(2, 8).toUpperCase();
        userData.affiliate = {
            create: { code, status: 'PENDING' }
        };
    }

    const user = await prisma.user.create({
        data: userData,
        select: { id: true, email: true, name: true, cpf: true, role: true, appMode: true, createdAt: true },
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

    const userData = { id: user.id, email: user.email, role: user.role, appMode: user.appMode };

    return { user: userData, token };
};

const getMe = async (userId) => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, email: true, role: true, appMode: true, createdAt: true },
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
