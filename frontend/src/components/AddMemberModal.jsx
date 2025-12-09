import { useState, useEffect, useRef } from 'react';
import { groupService } from '../services/api';
import { userService } from '../services/userService';
import { FiX, FiSearch, FiUserPlus } from 'react-icons/fi';

const AddMemberModal = ({ group, onClose, onMemberAdded }) => {
    const [email, setEmail] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [error, setError] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const debounceRef = useRef(null);

    // Debounce Search
    useEffect(() => {
        if (!email) {
            setSuggestions([]);
            return;
        }

        if (debounceRef.current) clearTimeout(debounceRef.current);

        debounceRef.current = setTimeout(async () => {
            // Only search if it looks somewhat like a name or email and not already a full email
            setIsSearching(true);
            try {
                const { data } = await userService.searchUsers(email);
                if (data.success) {
                    // Filter out existing members
                    const existingMemberIds = group.members.map(m => m._id);
                    const filtered = data.data.filter(u => !existingMemberIds.includes(u._id));
                    setSuggestions(filtered);
                }
            } catch (err) {
                console.error("Search failed", err);
            } finally {
                setIsSearching(false);
            }
        }, 300);

        return () => clearTimeout(debounceRef.current);
    }, [email, group.members]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await groupService.addMember(group._id, { email });
            onMemberAdded();
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to add member");
        }
    };

    const handleSelectUser = (user) => {
        setEmail(user.email);
        setSuggestions([]);
    };

    return (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm overflow-y-auto h-full w-full flex items-center justify-center z-50">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-xl w-full max-w-md border border-slate-100 dark:border-slate-700 transition-colors">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white">Add Member</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"><FiX size={24} /></button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative">
                        <label className="block text-slate-700 dark:text-slate-300 text-sm font-bold mb-2">Member Email or Name</label>
                        <div className="relative">
                            <FiSearch className="absolute left-3 top-3 text-slate-400" />
                            <input
                                type="text"
                                className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all text-slate-900 dark:text-white"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Search by email..."
                                required
                                autoFocus
                            />
                        </div>

                        {/* Suggestions Dropdown */}
                        {suggestions.length > 0 && (
                            <div className="absolute z-10 w-full mt-1 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                {suggestions.map(user => (
                                    <div
                                        key={user._id}
                                        onClick={() => handleSelectUser(user)}
                                        className="px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-600 cursor-pointer flex items-center gap-2"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center text-xs font-bold text-emerald-700 dark:text-emerald-300">
                                            {user.username.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-slate-800 dark:text-white">{user.username}</p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">{user.email}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {error && <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm rounded-lg">{error}</div>}

                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-2 px-4 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 font-bold rounded-xl transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
                        >
                            <FiUserPlus /> Add
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddMemberModal;
