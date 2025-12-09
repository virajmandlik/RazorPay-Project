import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, AreaChart, Area } from 'recharts';
import { useTheme } from '../context/ThemeContext';

const ExpenseChart = ({ groups, user }) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    // 1. Prepare Data for Bar Chart: Total Expenses per Group
    const groupExpensesData = groups.map(group => {
        const totalExpense = group.expenses.reduce((acc, curr) => acc + curr.amount, 0);
        return {
            name: group.name,
            amount: totalExpense
        };
    }).filter(d => d.amount > 0); // Only show groups with expenses

    // 2. Prepare Data for Trend Chart: Last 7 days expenses (User specific or All? Let's do User's Groups)
    // We need to flatten all expenses from all groups and sort by date
    const allExpenses = groups.flatMap(g => g.expenses).map(e => ({
        ...e,
        date: new Date(e.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
        rawDate: new Date(e.createdAt)
    }));

    // Sort by date
    allExpenses.sort((a, b) => a.rawDate - b.rawDate);

    // Aggregate by date
    const trendDataMap = {};
    allExpenses.forEach(e => {
        if (!trendDataMap[e.date]) {
            trendDataMap[e.date] = 0;
        }
        trendDataMap[e.date] += e.amount;
    });

    const trendData = Object.keys(trendDataMap).map(date => ({
        date,
        amount: trendDataMap[date]
    })).slice(-7); // Last 7 data points for cleanliness

    if (groupExpensesData.length === 0) return null;

    // Charts Styles
    const axisColor = isDark ? '#94a3b8' : '#64748b'; // slate-400 : slate-500
    const gridColor = isDark ? '#334155' : '#e2e8f0'; // slate-700 : slate-200
    const tooltipStyle = {
        backgroundColor: isDark ? '#1e293b' : '#ffffff',
        borderColor: isDark ? '#334155' : '#e2e8f0',
        color: isDark ? '#f8fafc' : '#0f172a',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Bar Chart: Spending by Group */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 transition-colors duration-300">
                <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Sharing Overview</h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={groupExpensesData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                            <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} stroke={axisColor} />
                            <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val}`} stroke={axisColor} />
                            <Tooltip
                                contentStyle={tooltipStyle}
                                cursor={{ fill: isDark ? '#334155' : '#f1f5f9', opacity: 0.4 }}
                            />
                            <Bar dataKey="amount" fill="#10b981" radius={[8, 8, 0, 0]} barSize={40} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Area Chart: Spending Trend */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 transition-colors duration-300">
                <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Activity Trend</h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={trendData}>
                            <defs>
                                <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                            <XAxis dataKey="date" fontSize={12} tickLine={false} axisLine={false} stroke={axisColor} />
                            <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val}`} stroke={axisColor} />
                            <Tooltip
                                contentStyle={tooltipStyle}
                            />
                            <Area type="monotone" dataKey="amount" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorAmount)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default ExpenseChart;
