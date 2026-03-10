const transactionsService = require('../services/transactions.service');
const { z } = require('zod');

const addTransactionSchema = z.object({
    description: z.string(),
    amount: z.number().positive(),
    type: z.enum(['INCOME', 'EXPENSE']),
    category: z.enum(['RENT', 'GROCERIES', 'TRANSPORT', 'HEALTH', 'UTILITIES', 'LEISURE', 'INCOME']),
    date: z.string().optional() // ISO string
});

const getParamsSchema = z.object({
    month: z.string().optional(),
    year: z.string().optional()
});

const addTransaction = async (req, res, next) => {
    try {
        const validatedData = addTransactionSchema.parse(req.body);
        const transaction = await transactionsService.addTransaction(req.user.id, validatedData);
        res.status(201).json({ status: 'success', data: { transaction } });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ status: 'fail', errors: error.errors });
        }
        next(error);
    }
};

const getTransactions = async (req, res, next) => {
    try {
        const { month, year } = getParamsSchema.parse(req.query);
        const transactions = await transactionsService.getTransactions(req.user.id, month, year);
        res.status(200).json({ status: 'success', data: { transactions } });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ status: 'fail', errors: error.errors });
        }
        next(error);
    }
};

const getMonthlySummary = async (req, res, next) => {
    try {
        const { month, year } = getParamsSchema.parse(req.query);
        if (!month || !year) {
            return res.status(400).json({ status: 'fail', message: 'Month and year are required' });
        }
        const summary = await transactionsService.getMonthlySummary(req.user.id, month, year);
        res.status(200).json({ status: 'success', data: { summary } });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ status: 'fail', errors: error.errors });
        }
        next(error);
    }
};

const deleteTransaction = async (req, res, next) => {
    try {
        await transactionsService.deleteTransaction(req.user.id, req.params.id);
        res.status(204).send();
    } catch (error) {
        if (error.message === 'Transaction not found') {
            return res.status(404).json({ status: 'fail', message: error.message });
        }
        next(error);
    }
};

module.exports = {
    addTransaction,
    getTransactions,
    getMonthlySummary,
    deleteTransaction
};
