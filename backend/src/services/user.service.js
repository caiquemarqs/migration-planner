const { prisma } = require('../config/db');

const updateMode = async (userId, appMode) => {
    if (appMode !== 'PLANNER' && appMode !== 'RESIDENT') {
        throw new Error('Invalid appMode. Must be PLANNER or RESIDENT');
    }

    const user = await prisma.user.update({
        where: { id: userId },
        data: { appMode }
    });

    return {
        id: user.id,
        appMode: user.appMode
    };
};

module.exports = {
    updateMode
};
