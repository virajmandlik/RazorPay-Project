import { useState, useEffect } from "react";
import { FiBell, FiX } from "react-icons/fi";

const Toast = ({ message, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 5000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className="fixed top-4 right-4 z-[100] bg-white dark:bg-slate-800 border-l-4 border-emerald-500 shadow-xl rounded-lg p-4 flex items-start gap-3 w-80 animate-slide-in">
            <div className="text-emerald-500 mt-0.5">
                <FiBell />
            </div>
            <div className="flex-1">
                <h4 className="font-bold text-sm text-slate-800 dark:text-white">Notification</h4>
                <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">{message}</p>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <FiX />
            </button>
        </div>
    );
};

export default Toast;
