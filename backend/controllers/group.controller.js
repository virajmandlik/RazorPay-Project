const Group = require("../models/group.model");
const Expense = require("../models/expense.model");
const User = require("../models/user.model");
const { ApiResponse } = require("../utils/ApiResponse");
const { ApiError } = require("../utils/APIError");
const { getIO } = require("../socket");
const NotificationContext = require("../services/notification");

const createGroup = async (req, res, next) => {
    try {
        const { name, description } = req.body;
        if (!name) throw new ApiError(400, "Group name is required");

        const group = await Group.create({
            name,
            description,
            members: [req.user._id],
            createdBy: req.user._id
        });

        // Emit update event to creator (real-time sync)
        getIO().to(req.user._id.toString()).emit("group:updated", group);

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

        // Real-time update to all group members
        const io = getIO();
        group.members.forEach(memberId => {
            io.to(memberId.toString()).emit("group:updated", group);
        });

        // Notify the new member
        await NotificationContext.notify(
            userToAdd._id,
            `You were added to group "${group.name}" by ${req.user.username}`,
            { type: 'GROUP_INVITE', groupId: group._id }
        );

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

        // Real-time update
        const io = getIO();
        group.members.forEach(memberId => {
            io.to(memberId.toString()).emit("group:updated", group); // Optimize: fetch full group to send or trigger refetch
            // Ideally we shouldn't send full group here if it's large, but trigger a refetch or send diff.
            // For simplicity, we just emit event to trigger refetch on frontend.
            io.to(memberId.toString()).emit("refresh:groups");
        });

        // Notify other members
        group.members.forEach(memberId => {
            if (memberId.toString() !== req.user._id.toString()) {
                NotificationContext.notify(
                    memberId,
                    `New expense "${description}" added in ${group.name}`,
                    { type: 'EXPENSE_ADDED', groupId: group._id, amount }
                );
            }
        });

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
