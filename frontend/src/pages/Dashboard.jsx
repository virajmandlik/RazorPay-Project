import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { groupService, paymentService } from "../services/api";
import AddExpenseModal from "../components/AddExpenseModal";
import CreateGroupModal from "../components/CreateGroupModal";
import AddMemberModal from "../components/AddMemberModal";
import PaymentSuccess from "../components/PaymentSuccess";
import ExpenseChart from "../components/ExpenseChart";
import appIcon from "../assets/app_icon.png";
import { FiLogOut, FiPlus, FiUsers, FiDollarSign, FiCreditCard, FiActivity, FiBox } from "react-icons/fi";

const Dashboard = () => {
    const { user, logout } = useAuth();
    const [groups, setGroups] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [showAddExpense, setShowAddExpense] = useState(false);
    const [showCreateGroup, setShowCreateGroup] = useState(false);
    const [showAddMember, setShowAddMember] = useState(false);
    const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
    const [loading, setLoading] = useState(true);

    const fetchGroups = async () => {
        try {
            const { data } = await groupService.getUserGroups();
            if (data.success) {
                setGroups(data.data);
            }
        } catch (error) {
            console.error("Failed to fetch groups", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGroups();
    }, []);

    const calculateBalance = (group) => {
        if (!group || !user) return 0;
        let balance = 0;

        group.expenses.forEach(expense => {
            const amISettled = expense.settledBy && expense.settledBy.includes(user._id);
            if (amISettled) return;

            const mySplit = expense.splitDetails[user._id] || 0;

            if (expense.payer._id === user._id) {
                let owedToMe = 0;
                Object.keys(expense.splitDetails).forEach(memberId => {
                    if (memberId !== user._id && !expense.settledBy?.includes(memberId)) {
                        owedToMe += expense.splitDetails[memberId];
                    }
                });
                balance += owedToMe;
            } else {
                if (!amISettled) {
                    balance -= mySplit;
                }
            }
        });

        return balance;
    };

    const handleSettleUp = async (group) => {
        const balance = calculateBalance(group);
        if (balance >= 0) {
            alert("You do not owe anything!");
            return;
        }

        const amountToPay = Math.abs(balance);

        try {
            const { data: orderData } = await paymentService.createOrder({ amount: amountToPay });

            if (!orderData.success) {
                alert("Failed to initiate payment: " + orderData.message);
                return;
            }

            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: orderData.data.amount,
                currency: "INR",
                name: "Payment Splitter",
                description: `Settle debt for ${group.name}`,
                image: "https://cdn-icons-png.flaticon.com/512/2169/2169854.png",
                order_id: orderData.data.id,
                handler: async function (response) {
                    try {
                        const verifyData = {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            groupId: group._id
                        };

                        const { data: verifyRes } = await paymentService.verifyPayment(verifyData);
                        if (verifyRes.success) {
                            fetchGroups();
                            setShowSuccessAnimation(true);
                        }
                    } catch (err) {
                        console.error(err);
                        alert("Payment Verification Failed");
                    }
                },
                prefill: {
                    name: user.username,
                    email: user.email,
                    contact: "9999999999"
                },
                theme: {
                    color: "#0284c7" // Sky Blue 600
                }
            };

            const rzp1 = new window.Razorpay(options);
            rzp1.open();

        } catch (error) {
            console.error("Payment failed", error);
            alert("Payment flow error");
        }
    };

    return (
        <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
            {/* Sidebar - Fixed Colors */}
            <aside className="w-64 bg-slate-900 text-white flex-shrink-0 hidden md:flex flex-col">
                <div className="p-6 flex items-center space-x-3">
                    <div className="w-10 h-10">
                        <img src={appIcon} alt="Splittr Logo" className="w-full h-full object-contain filter drop-shadow-md" />
                    </div>
                    <span className="text-xl font-bold tracking-wide">Splittr</span>
                </div>

                <nav className="flex-1 mt-6 px-4 space-y-2">
                    <a href="#" className="flex items-center space-x-3 px-4 py-3 bg-white/10 rounded-xl text-white font-medium">
                        <FiActivity className="w-5 h-5" />
                        <span>Dashboard</span>
                    </a>
                </nav>

                <div className="p-4 border-t border-slate-700">
                    <button onClick={logout} className="w-full flex items-center space-x-3 px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white rounded-xl transition-colors">
                        <FiLogOut className="w-5 h-5" />
                        <span>Logout</span>
                    </button>
                    <div className="mt-4 flex items-center px-4">
                        <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center font-bold text-white uppercase">
                            {user?.username?.charAt(0)}
                        </div>
                        <span className="ml-3 text-sm font-medium">{user?.username}</span>
                    </div>
                </div>
            </aside>

            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 w-full bg-slate-900 text-white z-50 flex justify-between items-center p-4">
                <div className="flex items-center space-x-2">
                    <div className="w-8 h-8">
                        <img src={appIcon} alt="Splittr Logo" className="w-full h-full object-contain" />
                    </div>
                    <span className="font-bold text-lg">Splittr</span>
                </div>
                <button onClick={logout}>
                    <FiLogOut className="w-6 h-6" />
                </button>
            </div>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto pt-16 md:pt-0">
                <header className="hidden md:flex bg-white border-b border-slate-200 px-8 py-6 justify-between items-center sticky top-0 z-20">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">Overview</h1>
                        <p className="text-slate-500">Manage your shared expenses</p>
                    </div>
                    <button
                        onClick={() => setShowCreateGroup(true)}
                        className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg shadow-md transition-all font-medium"
                    >
                        <FiPlus className="w-5 h-5" />
                        <span>New Group</span>
                    </button>
                </header>

                <div className="p-4 md:p-8 pb-32">
                    {/* Visualizations Logic */}
                    {!loading && groups.length > 0 && (
                        <ExpenseChart groups={groups} user={user} />
                    )}

                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                            {groups.map(group => {
                                const balance = calculateBalance(group);
                                const isOwed = balance >= 0;

                                return (
                                    <div key={group._id} className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-lg transition-all duration-300 flex flex-col h-full">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className="text-lg font-bold text-slate-800">{group.name}</h3>
                                                <div className="flex items-center text-xs text-slate-500 mt-1 gap-1">
                                                    <FiUsers className="w-3 h-3" />
                                                    <span>{group.members.length} members</span>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => { setSelectedGroup(group); setShowAddMember(true); }}
                                                className="text-xs font-semibold bg-slate-100 text-slate-600 px-3 py-1 rounded-full hover:bg-slate-200"
                                            >
                                                + Add
                                            </button>
                                        </div>

                                        <div className="bg-slate-50 rounded-lg p-4 mb-4 border border-slate-100">
                                            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Your Balance</p>
                                            <div className="flex items-center justify-between">
                                                <span className={`text-2xl font-bold ${isOwed ? 'text-emerald-600' : 'text-red-600'}`}>
                                                    {isOwed ? '+' : '-'}₹{Math.abs(balance).toFixed(2)}
                                                </span>
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${isOwed ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                                                    {isOwed ? 'Receiving' : 'Paying'}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex-1 mb-6">
                                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Recent</h4>
                                            <div className="space-y-2">
                                                {group.expenses.slice(-2).map(expense => (
                                                    <div key={expense._id} className="flex justify-between items-center text-sm">
                                                        <span className="text-slate-600 truncate max-w-[120px]">{expense.description}</span>
                                                        <span className="font-medium text-slate-900">₹{expense.amount}</span>
                                                    </div>
                                                ))}
                                                {group.expenses.length === 0 && <p className="text-xs text-slate-400 italic">No expenses recorded.</p>}
                                            </div>
                                        </div>

                                        <div className="flex gap-2 mt-auto">
                                            <button
                                                onClick={() => { setSelectedGroup(group); setShowAddExpense(true); }}
                                                className="flex-1 py-2 px-3 bg-white border border-slate-300 text-slate-700 text-sm font-semibold rounded-lg hover:bg-slate-50"
                                            >
                                                Add Exp
                                            </button>
                                            {!isOwed && Math.abs(balance) > 0.01 && (
                                                <button
                                                    onClick={() => handleSettleUp(group)}
                                                    className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-lg shadow-md hover:shadow-lg transition-all"
                                                >
                                                    Settle Up
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>
            </main>

            {showAddExpense && selectedGroup && (
                <AddExpenseModal
                    group={selectedGroup}
                    onClose={() => setShowAddExpense(false)}
                    onExpenseAdded={fetchGroups}
                />
            )}

            {showCreateGroup && (
                <CreateGroupModal
                    onClose={() => setShowCreateGroup(false)}
                    onGroupCreated={fetchGroups}
                />
            )}

            {showAddMember && selectedGroup && (
                <AddMemberModal
                    group={selectedGroup}
                    onClose={() => setShowAddMember(false)}
                    onMemberAdded={fetchGroups}
                />
            )}

            <PaymentSuccess
                show={showSuccessAnimation}
                onClose={() => setShowSuccessAnimation(false)}
            />
        </div>
    );
};

export default Dashboard;
