const householdService = require('../services/household.service');
const { z } = require('zod');

const addMemberSchema = z.object({
    name: z.string().optional(),
    age: z.number().int().positive().optional(),
    type: z.string().optional(),
    works: z.boolean().optional()
});

const updateMemberSchema = z.object({
    name: z.string().optional(),
    age: z.number().int().positive().optional(),
    type: z.string().optional(),
    works: z.boolean().optional()
});

const addMember = async (req, res, next) => {
    try {
        const validatedData = addMemberSchema.parse(req.body);
        const member = await householdService.addMember(req.user.id, validatedData);
        res.status(201).json({ status: 'success', data: { member } });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ status: 'fail', errors: error.errors });
        }
        next(error);
    }
};

const getMembers = async (req, res, next) => {
    try {
        const members = await householdService.getMembers(req.user.id);
        res.status(200).json({ status: 'success', data: { members } });
    } catch (error) {
        next(error);
    }
};

const updateMember = async (req, res, next) => {
    try {
        const validatedData = updateMemberSchema.parse(req.body);
        const member = await householdService.updateMember(req.user.id, req.params.id, validatedData);
        res.status(200).json({ status: 'success', data: { member } });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ status: 'fail', errors: error.errors });
        }
        if (error.message === 'Member not found') {
            return res.status(404).json({ status: 'fail', message: error.message });
        }
        next(error);
    }
};

const deleteMember = async (req, res, next) => {
    try {
        await householdService.deleteMember(req.user.id, req.params.id);
        res.status(204).send();
    } catch (error) {
        if (error.message === 'Member not found') {
            return res.status(404).json({ status: 'fail', message: error.message });
        }
        next(error);
    }
};

module.exports = {
    addMember,
    getMembers,
    updateMember,
    deleteMember
};
