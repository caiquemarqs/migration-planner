const { prisma } = require('../config/db');

const addMember = async (userId, data) => {
    return await prisma.household.create({
        data: {
            userId,
            name: data.name,
            age: data.age,
            type: data.type || 'DEPENDENT',
            works: data.works || false,
        }
    });
};

const getMembers = async (userId) => {
    return await prisma.household.findMany({
        where: { userId }
    });
};

const updateMember = async (userId, memberId, data) => {
    // Check if belongs to user
    const member = await prisma.household.findFirst({
        where: { id: memberId, userId }
    });
    if (!member) throw new Error('Member not found');

    return await prisma.household.update({
        where: { id: memberId },
        data
    });
};

const deleteMember = async (userId, memberId) => {
    const member = await prisma.household.findFirst({
        where: { id: memberId, userId }
    });
    if (!member) throw new Error('Member not found');

    return await prisma.household.delete({
        where: { id: memberId }
    });
};

module.exports = {
    addMember,
    getMembers,
    updateMember,
    deleteMember
};
