import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/userService';
import { FiX, FiUser, FiMail, FiAlertTriangle, FiTrash2, FiSave } from 'react-icons/fi';

const ProfileModal = ({ onClose }) => {
    const { user, logout } = useAuth();
    const [formData, setFormData] = useState({
        username: user?.username || '',
        email: user?.email || ''
    });
    const [message, setMessage] = useState({ type: '', text: '' });
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const handleUpdate = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });
        try {
            await userService.updateDetails(formData);
            setMessage({ type: 'success', text: 'Profile updated successfully! Please re-login to see changes.' });
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to update profile' });
        }
    };

    const handleDeleteAccount = async () => {
        try {
            await userService.deleteAccount();
            logout();
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to delete account' });
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm overflow-y-auto h-full w-full flex items-center justify-center z-50">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-xl w-full max-w-md border border-slate-100 dark:border-slate-700 transition-colors">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white">Edit Profile</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"><FiX size={24} /></button>
                </div>

                <form onSubmit={handleUpdate} className="space-y-4">
                    <div>
                        <label className="block text-slate-700 dark:text-slate-300 text-sm font-bold mb-2">Username</label>
                        <div className="relative">
                            <FiUser className="absolute left-3 top-3 text-slate-400" />
                            <input
                                type="text"
                                className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-slate-900 dark:text-white"
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-slate-700 dark:text-slate-300 text-sm font-bold mb-2">Email</label>
                        <div className="relative">
                            <FiMail className="absolute left-3 top-3 text-slate-400" />
                            <input
                                type="email"
                                className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-slate-900 dark:text-white"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                    </div>

                    {message.text && (
                        <div className={`p-3 rounded-lg text-sm ${message.type === 'success' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300' : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'}`}>
                            {message.text}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
                    >
                        <FiSave /> Save Changes
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
                    {!showDeleteConfirm ? (
                        <button
                            onClick={() => setShowDeleteConfirm(true)}
                            className="w-full py-2 px-4 bg-red-50 dark:bg-red-900/10 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 font-bold rounded-xl transition-all flex items-center justify-center gap-2 border border-red-200 dark:border-red-800/30"
                        >
                            <FiTrash2 /> Deactivate Account
                        </button>
                    ) : (
                        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-xl border border-red-200 dark:border-red-800/50">
                            <h4 className="flex items-center gap-2 font-bold text-red-700 dark:text-red-400 mb-2">
                                <FiAlertTriangle /> Are you sure?
                            </h4>
                            <p className="text-xs text-red-600 dark:text-red-300 mb-3">
                                This action is irreversible. All your data will be permanently deleted.
                            </p>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setShowDeleteConfirm(false)}
                                    className="flex-1 py-1 px-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 text-sm font-semibold rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDeleteAccount}
                                    className="flex-1 py-1 px-3 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-lg"
                                >
                                    Confirm Delete
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfileModal;
