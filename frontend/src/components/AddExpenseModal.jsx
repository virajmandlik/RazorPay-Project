import { useState } from 'react';
import { groupService } from '../services/api';

const AddExpenseModal = ({ group, onClose, onExpenseAdded }) => {
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    // Default to all members selected
    const [selectedMembers, setSelectedMembers] = useState(group.members.map(m => m._id));

    const handleToggleMember = (memberId) => {
        if (selectedMembers.includes(memberId)) {
            // Prevent deselecting everyone - at least one person must split
            if (selectedMembers.length > 1) {
                setSelectedMembers(selectedMembers.filter(id => id !== memberId));
            }
        } else {
            setSelectedMembers([...selectedMembers, memberId]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const numMembers = selectedMembers.length;
            const splitAmount = parseFloat(amount) / numMembers;
            const splitDetails = {};

            selectedMembers.forEach(memberId => {
                splitDetails[memberId] = splitAmount;
            });

            await groupService.addExpense(group._id, {
                description,
                amount: parseFloat(amount),
                splitDetails
            });

            onExpenseAdded();
            onClose();
        } catch (error) {
            console.error("Failed to add expense", error);
            alert("Failed to add expense");
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm overflow-y-auto h-full w-full flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-md border border-slate-100">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-slate-800">Add Expense</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600">✕</button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-slate-700 text-sm font-bold mb-1">Description</label>
                        <input
                            type="text"
                            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="e.g. Dinner, Taxi, etc."
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-slate-700 text-sm font-bold mb-1">Amount (INR)</label>
                        <input
                            type="number"
                            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="0.00"
                            min="1"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-slate-700 text-sm font-bold mb-2">Split With ({selectedMembers.length})</label>
                        <div className="max-h-40 overflow-y-auto border border-slate-200 rounded-lg p-2 bg-slate-50 space-y-2">
                            {group.members.map(member => (
                                <div key={member._id} className="flex items-center p-2 hover:bg-white rounded-md transition-colors cursor-pointer" onClick={() => handleToggleMember(member._id)}>
                                    <input
                                        type="checkbox"
                                        checked={selectedMembers.includes(member._id)}
                                        onChange={() => handleToggleMember(member._id)}
                                        className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500 border-gray-300"
                                    />
                                    <span className="ml-3 text-sm font-medium text-slate-700">{member.username}</span>
                                    {selectedMembers.includes(member._id) && amount && (
                                        <span className="ml-auto text-xs text-emerald-600 font-bold">
                                            ₹{(parseFloat(amount) / selectedMembers.length).toFixed(2)}
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="pt-4 flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-2 px-4 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/20 transition-all"
                        >
                            Add Expense
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddExpenseModal;
