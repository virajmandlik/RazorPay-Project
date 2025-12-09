import { useState } from "react";
import { authService } from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import { FiUserPlus, FiUser, FiMail, FiLock, FiShield, FiPieChart, FiTrendingUp } from "react-icons/fi";

import appIcon from "../assets/app_icon.png";

const Register = () => {
    const [formData, setFormData] = useState({ username: "", email: "", password: "" });
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [focusedField, setFocusedField] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        try {
            const { data } = await authService.register(formData);
            if (data.success) {
                navigate("/login");
            }
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative flex items-center justify-center min-h-screen bg-slate-900 font-sans overflow-hidden">

            {/* Animated Background Shapes */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-pulse delay-700"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse"></div>

                {/* Floating Payment Icons */}
                <div className="absolute top-1/4 right-20 animate-bounce duration-[3500ms]">
                    <div className="w-16 h-16 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center transform -rotate-6">
                        <FiPieChart className="w-8 h-8 text-pink-400" />
                    </div>
                </div>
                <div className="absolute bottom-1/3 left-20 animate-bounce duration-[4500ms]">
                    <div className="w-12 h-12 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl flex items-center justify-center transform rotate-6">
                        <FiTrendingUp className="w-6 h-6 text-blue-400" />
                    </div>
                </div>
            </div>

            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay pointer-events-none"></div>

            <div className="relative z-10 w-full max-w-md p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl">
                <div className="text-center mb-8">
                    <div className="mx-auto w-20 h-20 mb-4 drop-shadow-xl filter hover:scale-105 transition-transform duration-300">
                        <img src={appIcon} alt="Payment Splitter" className="w-full h-full object-contain" />
                    </div>
                    <h2 className="text-3xl font-bold text-white tracking-tight">Join Securely</h2>
                    <p className="text-slate-400 mt-2">Start managing your group expenses today</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1 ml-1">Username</label>
                        <div className={`relative group transition-all duration-300 ${focusedField === 'username' ? 'scale-[1.02]' : ''}`}>
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <FiUser className={`h-5 w-5 transition-colors duration-300 ${focusedField === 'username' ? 'text-blue-400' : 'text-slate-500'}`} />
                            </div>
                            <input
                                type="text"
                                required
                                className="w-full pl-11 pr-4 py-3.5 bg-slate-900/50 border border-slate-700/50 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 text-white placeholder-slate-500 transition-all outline-none backdrop-blur-sm"
                                placeholder="johndoe"
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                onFocus={() => setFocusedField('username')}
                                onBlur={() => setFocusedField(null)}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1 ml-1">Email</label>
                        <div className={`relative group transition-all duration-300 ${focusedField === 'email' ? 'scale-[1.02]' : ''}`}>
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <FiMail className={`h-5 w-5 transition-colors duration-300 ${focusedField === 'email' ? 'text-blue-400' : 'text-slate-500'}`} />
                            </div>
                            <input
                                type="email"
                                required
                                className="w-full pl-11 pr-4 py-3.5 bg-slate-900/50 border border-slate-700/50 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 text-white placeholder-slate-500 transition-all outline-none backdrop-blur-sm"
                                placeholder="name@example.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                onFocus={() => setFocusedField('email')}
                                onBlur={() => setFocusedField(null)}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1 ml-1">Password</label>
                        <div className={`relative group transition-all duration-300 ${focusedField === 'password' ? 'scale-[1.02]' : ''}`}>
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <FiLock className={`h-5 w-5 transition-colors duration-300 ${focusedField === 'password' ? 'text-blue-400' : 'text-slate-500'}`} />
                            </div>
                            <input
                                type="password"
                                required
                                className="w-full pl-11 pr-4 py-3.5 bg-slate-900/50 border border-slate-700/50 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 text-white placeholder-slate-500 transition-all outline-none backdrop-blur-sm"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                onFocus={() => setFocusedField('password')}
                                onBlur={() => setFocusedField(null)}
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-200 text-sm flex items-center backdrop-blur-md">
                            <span className="mr-2">⚠️</span> {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
                    >
                        {isLoading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                            <span className="flex items-center gap-2"><FiUserPlus /> Create Account</span>
                        )}
                    </button>

                    <p className="text-center text-slate-400 text-sm mt-6">
                        Already have an account?{" "}
                        <Link to="/login" className="text-blue-400 hover:text-blue-300 font-semibold underline-offset-4 hover:underline transition-colors">
                            Log In
                        </Link>
                    </p>
                </form>
            </div>

            <div className="fixed bottom-4 text-slate-500 text-xs text-center w-full">
                <p className="flex items-center justify-center gap-1">
                    <FiShield /> Data Privacy Protected
                </p>
            </div>
        </div>
    );
};

export default Register;
