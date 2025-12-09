import React, { useEffect } from 'react';

const PaymentSuccess = ({ show, onClose }) => {
    useEffect(() => {
        if (show) {
            const timer = setTimeout(() => {
                onClose();
            }, 4000);
            return () => clearTimeout(timer);
        }
    }, [show, onClose]);

    if (!show) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm transition-opacity duration-300">
            <div className="bg-slate-800 border border-slate-700 p-8 rounded-2xl shadow-2xl transform scale-100 animate-bounce-short flex flex-col items-center max-w-sm w-full mx-4">

                {/* Visual Circle & Checkmark */}
                <div className="relative mb-6">
                    <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/50 animate-pulse-slow">
                        <svg
                            className="w-12 h-12 text-white drop-shadow-md checkmark-draw"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                        </svg>
                    </div>
                    {/* Floating Particles */}
                    <div className="absolute top-0 left-0 w-full h-full">
                        <span className="absolute top-0 left-1/4 w-2 h-2 bg-emerald-400 rounded-full animate-ping" style={{ animationDelay: '0.1s' }}></span>
                        <span className="absolute bottom-1/4 right-0 w-2 h-2 bg-emerald-300 rounded-full animate-ping" style={{ animationDelay: '0.3s' }}></span>
                        <span className="absolute bottom-0 left-0 w-3 h-3 bg-emerald-500 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></span>
                    </div>
                </div>

                <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">Payment Successful!</h2>
                <p className="text-slate-400 text-center text-sm mb-6">
                    Your transaction has been verified and settled securely.
                </p>

                <button
                    onClick={onClose}
                    className="w-full py-2 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl transition-all shadow-md focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-800"
                >
                    Done
                </button>
            </div>

            <style>{`
                @keyframes bounce-short {
                    0% { transform: scale(0.8); opacity: 0; }
                    50% { transform: scale(1.05); opacity: 1; }
                    100% { transform: scale(1); opacity: 1; }
                }
                .animate-bounce-short {
                    animation: bounce-short 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
                }
                
                @keyframes draw {
                    to { stroke-dashoffset: 0; }
                }
                .checkmark-draw {
                    stroke-dasharray: 100;
                    stroke-dashoffset: 100;
                    animation: draw 0.6s 0.3s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default PaymentSuccess;
