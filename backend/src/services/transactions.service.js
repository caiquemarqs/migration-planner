const { prisma } = require('../config/db');
const dayjs = require('dayjs');

const addTransaction = async (userId, data) => {
    return await prisma.transaction.create({
        data: {
            userId,
            description: data.description,
            amount: data.amount,
            currency: data.currency || 'BRL',
            type: data.type,
            category: data.category,
            date: data.date ? new Date(data.date) : new Date(),
        }
    });
};

const getTransactions = async (userId, month, year) => {
    let dateFilter = {};
    if (month && year) {
        const startDate = dayjs(`${year}-${month}-01`).startOf('month').toDate();
        const endDate = dayjs(startDate).endOf('month').toDate();
        dateFilter = {
            date: {
                gte: startDate,
                lte: endDate
            }
        };
    }

    return await prisma.transaction.findMany({
        where: {
            userId,
            ...dateFilter
        },
        orderBy: { date: 'desc' }
    });
};

const getMonthlySummary = async (userId, month, year) => {
    const startDate = dayjs(`${year}-${month}-01`).startOf('month').toDate();
    const endDate = dayjs(startDate).endOf('month').toDate();

    const prevMonthStartDate = dayjs(startDate).subtract(1, 'month').startOf('month').toDate();
    const prevMonthEndDate = dayjs(startDate).subtract(1, 'month').endOf('month').toDate();

    // Fetch transactions for both current and previous month concurrently
    const [transactions, prevTransactions] = await Promise.all([
        prisma.transaction.findMany({
            where: {
                userId,
                date: { gte: startDate, lte: endDate }
            }
        }),
        prisma.transaction.findMany({
            where: {
                userId,
                date: { gte: prevMonthStartDate, lte: prevMonthEndDate }
            }
        })
    ]);

    let totalIncome = 0;
    let totalExpense = 0;
    const expenseByCategory = {};

    transactions.forEach(t => {
        if (t.type === 'INCOME') {
            totalIncome += t.amount;
        } else if (t.type === 'EXPENSE') {
            totalExpense += t.amount;
            if (!expenseByCategory[t.category]) {
                expenseByCategory[t.category] = 0;
            }
            expenseByCategory[t.category] += t.amount;
        }
    });

    let prevTotalIncome = 0;
    let prevTotalExpense = 0;

    prevTransactions.forEach(t => {
        if (t.type === 'INCOME') {
            prevTotalIncome += t.amount;
        } else if (t.type === 'EXPENSE') {
            prevTotalExpense += t.amount;
        }
    });

    const balance = totalIncome - totalExpense;
    const prevBalance = prevTotalIncome - prevTotalExpense;

    const calcMom = (current, prev) => {
        if (prev === 0) return current > 0 ? 100 : 0;
        return ((current - prev) / prev) * 100;
    };

    return {
        month,
        year,
        totalIncome,
        totalExpense,
        balance,
        expenseByCategory,
        momIncome: calcMom(totalIncome, prevTotalIncome),
        momExpense: calcMom(totalExpense, prevTotalExpense),
        momBalance: calcMom(balance, prevBalance)
    };
};

const deleteTransaction = async (userId, transactionId) => {
    const transaction = await prisma.transaction.findFirst({
        where: { id: transactionId, userId }
    });
    if (!transaction) throw new Error('Transaction not found');

    return await prisma.transaction.delete({
        where: { id: transactionId }
    });
};

module.exports = {
    addTransaction,
    getTransactions,
    getMonthlySummary,
    deleteTransaction
};
