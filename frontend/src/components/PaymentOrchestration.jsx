import { useState, useEffect } from "react";
import { FiServer, FiCheckCircle, FiShield, FiActivity } from "react-icons/fi";

const PaymentOrchestration = ({ onComplete }) => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const startTime = Date.now();
        const duration = 3000; // 3 seconds total

        const interval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            if (elapsed >= duration) {
                setProgress(100);
                clearInterval(interval);
                setTimeout(onComplete, 800);
            } else {
                setProgress((elapsed / duration) * 100);
            }
        }, 16);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900 pb-20">
            {/* Visual Tunnel Effect */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200vw] h-[200vw] rounded-full border-[100px] border-emerald-500/10 animate-[spin_8s_linear_infinite] opacity-50"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150vw] h-[150vw] rounded-full border-[80px] border-blue-500/10 animate-[spin_6s_linear_reverse_infinite] opacity-60"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100vw] h-[100vw] rounded-full border-[60px] border-purple-500/10 animate-[spin_4s_linear_infinite] opacity-70"></div>
            </div>

            <div className="relative z-10 flex flex-col items-center">
                <div className="w-24 h-24 mb-8 bg-slate-800 rounded-2xl flex items-center justify-center border border-slate-700 shadow-2xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/20 to-transparent"></div>
                    <FiShield className="w-12 h-12 text-emerald-400 animate-pulse" />
                </div>

                <div className="text-center space-y-2">
                    <h2 className="text-2xl font-bold text-white tracking-widest uppercase">Secure Tunnel</h2>
                    <p className="text-slate-400 font-mono text-sm">Encrypting & Routing Transaction...</p>
                </div>

                <div className="w-64 h-1 bg-slate-800 rounded-full mt-8 overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500 rounded-full transition-all duration-100 ease-out"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>

                <div className="mt-4 flex gap-4 text-xs font-mono text-slate-500">
                    <span className={progress > 30 ? "text-emerald-400" : ""}>TLS 1.3</span>
                    <span className={progress > 60 ? "text-emerald-400" : ""}>256-BIT AES</span>
                    <span className={progress > 90 ? "text-emerald-400" : ""}>TOKENIZED</span>
                </div>
            </div>
        </div>
    );
};

export default PaymentOrchestration;
