import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { FiLock, FiUnlock, FiUser, FiCheckCircle, FiShield, FiCreditCard, FiDollarSign } from "react-icons/fi";
import appIcon from "../assets/app_icon.png";

const Login = () => {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const { login } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [focusedField, setFocusedField] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        try {
            await login(formData.email, formData.password);
            navigate("/");
        } catch (err) {
            setError(err.response?.data?.message || "Invalid credentials");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative flex items-center justify-center min-h-screen bg-slate-900 font-sans overflow-hidden">

            {/* Animated Background Shapes */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-500/30 rounded-full blur-3xl animate-pulse delay-1000"></div>

                {/* Floating Payment Icons */}
                <div className="absolute top-1/4 left-10 animate-bounce duration-[3000ms]">
                    <div className="w-16 h-16 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl flex items-center justify-center transform rotate-12">
                        <FiCreditCard className="w-8 h-8 text-emerald-400" />
                    </div>
                </div>
                <div className="absolute bottom-1/3 right-10 animate-bounce duration-[4000ms]">
                    <div className="w-14 h-14 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center transform -rotate-12">
                        <FiDollarSign className="w-8 h-8 text-yellow-400" />
                    </div>
                </div>
            </div>

            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay pointer-events-none"></div>

            <div className="relative z-10 w-full max-w-md p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl">
                <div className="text-center mb-8">
                    <div className="mx-auto w-20 h-20 mb-4 drop-shadow-2xl filter hover:scale-105 transition-transform duration-300">
                        <img src={appIcon} alt="Payment Splitter" className="w-full h-full object-contain" />
                    </div>
                    <h2 className="text-3xl font-bold text-white tracking-tight">Welcome Back</h2>
                    <p className="text-slate-400 mt-2">Securely access your payment dashboard</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1 ml-1">Email or Username</label>
                        <div className={`relative group transition-all duration-300 ${focusedField === 'email' ? 'scale-[1.02]' : ''}`}>
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <FiUser className={`h-5 w-5 transition-colors duration-300 ${focusedField === 'email' ? 'text-blue-400' : 'text-slate-500'}`} />
                            </div>
                            <input
                                type="text"
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
                                {formData.password.length > 0 ? (
                                    <FiUnlock className={`h-5 w-5 transition-colors duration-300 ${focusedField === 'password' ? 'text-emerald-400' : 'text-slate-500'}`} />
                                ) : (
                                    <FiLock className={`h-5 w-5 transition-colors duration-300 ${focusedField === 'password' ? 'text-blue-400' : 'text-slate-500'}`} />
                                )}
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
                            <span className="flex items-center gap-2"><FiCheckCircle /> Sign In Secured</span>
                        )}
                    </button>

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white dark:bg-slate-800 text-slate-500">Or continue with</span>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <a href="http://localhost:5000/api/v1/users/google" className="flex-1 py-2 px-4 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-2 text-slate-700 dark:text-slate-300 font-medium">
                            <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
                            Google
                        </a>
                        <a href="http://localhost:5000/api/v1/users/github" className="flex-1 py-2 px-4 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-2 text-slate-700 dark:text-slate-300 font-medium">
                            <img src="https://www.svgrepo.com/show/512317/github-142.svg" className="w-5 h-5 dark:invert" alt="GitHub" />
                            GitHub
                        </a>
                    </div>

                    <p className="text-center text-slate-400 text-sm mt-6">
                        Don't have an account?{" "}
                        <Link to="/register" className="text-blue-400 hover:text-blue-300 font-semibold underline-offset-4 hover:underline transition-colors">
                            Create Account
                        </Link>
                    </p>
                </form>

                <div className="mt-8 pt-6 border-t border-slate-700/30 text-center">
                    <p className="flex items-center justify-center gap-1 text-xs text-slate-500">
                        <FiShield className="text-emerald-500" />
                        256-bit SSL Encrypted Payment Gateway
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
