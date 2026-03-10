const userService = require('../services/user.service');

const updateMode = async (req, res, next) => {
    try {
        const { appMode } = req.body;
        const result = await userService.updateMode(req.user.id, appMode);
        res.json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    updateMode
};
