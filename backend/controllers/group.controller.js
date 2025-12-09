const Group = require("../models/group.model");
const Expense = require("../models/expense.model");
const User = require("../models/user.model"); // Needed to find users
const { ApiResponse } = require("../utils/ApiResponse");
const { ApiError } = require("../utils/APIError");

const createGroup = async (req, res, next) => {
    try {
        const { name } = req.body;
        if (!name) throw new ApiError(400, "Group name is required");

        const group = await Group.create({
            name,
            members: [req.user._id],
            createdBy: req.user._id
        });

        return res.status(201).json(
            new ApiResponse(201, group, "Group created successfully")
        );
    } catch (error) {
        next(error);
    }
};

const getUserGroups = async (req, res, next) => {
    try {
        const groups = await Group.find({ members: req.user._id })
            .populate("members", "username email")
            .populate({
                path: "expenses",
                populate: { path: "payer", select: "username" }
            });

        return res.status(200).json(
            new ApiResponse(200, groups, "User groups fetched successfully")
        );
    } catch (error) {
        next(error);
    }
};

const addMember = async (req, res, next) => {
    try {
        const { groupId } = req.params;
        const { email } = req.body;

        const group = await Group.findById(groupId);
        if (!group) throw new ApiError(404, "Group not found");

        if (group.createdBy.toString() !== req.user._id.toString()) {
            throw new ApiError(403, "Only admin can add members"); // Simple rule for now
        }

        const userToAdd = await User.findOne({ email });
        if (!userToAdd) throw new ApiError(404, "User not found");

        if (group.members.includes(userToAdd._id)) {
            throw new ApiError(400, "User already in group");
        }

        group.members.push(userToAdd._id);
        await group.save();

        return res.status(200).json(
            new ApiResponse(200, group, "Member added successfully")
        );
    } catch (error) {
        next(error);
    }
};

const addExpense = async (req, res, next) => {
    try {
        const { groupId } = req.params;
        const { description, amount, splitDetails } = req.body;
        // splitDetails: { userId: amountOwed }

        const group = await Group.findById(groupId);
        if (!group) throw new ApiError(404, "Group not found");

        if (!description || !amount) throw new ApiError(400, "Description and amount required");

        const expense = await Expense.create({
            description,
            amount,
            payer: req.user._id,
            group: groupId,
            splitDetails,
            isSettled: false
        });

        group.expenses.push(expense._id);
        await group.save();

        return res.status(201).json(
            new ApiResponse(201, expense, "Expense added successfully")
        );
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createGroup,
    getUserGroups,
    addMember,
    addExpense
};
