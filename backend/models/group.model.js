const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    expenses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Expense"
    }],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    description: {
        type: String,
        trim: true
    }
}, { timestamps: true });

const Group = mongoose.model("Group", groupSchema);
module.exports = Group;
