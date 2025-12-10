import React, { useEffect, useState } from 'react';
import { analyticsService } from '../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, ReferenceDot } from 'recharts';

const Analytics = () => {
    const [monthlyStats, setMonthlyStats] = useState([]);
    const [predictionData, setPredictionData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsRes, predRes] = await Promise.all([
                    analyticsService.getGroupWiseMonthlySpending(),
                    analyticsService.getSpendingPrediction()
                ]);

                setMonthlyStats(statsRes.data.data);
                setPredictionData(predRes.data.data);
            } catch (err) {
                console.error("Failed to fetch analytics:", err);
                setError("Failed to load analytics data.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <div className="p-8 text-center">Loading Analytics...</div>;
    if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

    // Process data for Bar Chart (Group-wise spending)
    // We need to group by Month-Year and have keys for each group
    const processedChartData = [];
    const groupNames = new Set();

    monthlyStats.forEach(stat => {
        const label = `${stat.month}/${stat.year}`;
        let existing = processedChartData.find(d => d.name === label);
        if (!existing) {
            existing = { name: label };
            processedChartData.push(existing);
        }
        existing[stat.groupName] = stat.totalMySpending; // Or totalGroupSpending depending on view
        groupNames.add(stat.groupName);
    });

    // Ensure chronological order
    processedChartData.sort((a, b) => {
        const [m1, y1] = a.name.split('/').map(Number);
        const [m2, y2] = b.name.split('/').map(Number);
        return y1 - y2 || m1 - m2;
    });

    // Process data for Line Chart (Prediction)
    let lineChartData = [];
    if (predictionData?.history) {
        lineChartData = predictionData.history.map((h, index) => ({
            index,
            name: `${h._id.month}/${h._id.year}`,
            amount: h.totalSpent
        }));
    }

    const predictionPoint = predictionData?.prediction ? {
        index: predictionData.prediction.nextMonthIndex,
        name: 'Next Month (Pred)',
        amount: predictionData.prediction.predictedAmount
    } : null;

    if (predictionPoint) {
        // lineChartData.push(predictionPoint); // Optional: if we want to connect the line
    }

    const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00C49F'];

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">Spending Analytics</h1>

            {/* Prediction Card or Insufficient Data Message */}
            {predictionData?.prediction ? (
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border-l-4 border-indigo-500">
                    <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200">
                        AI Prediction (Linear Regression)
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="p-4 bg-indigo-50 dark:bg-slate-700 rounded-lg">
                            <p className="text-sm text-gray-500 dark:text-gray-400">Next Month Forecast</p>
                            <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                                ${Math.round(predictionData.prediction.predictedAmount)}
                            </p>
                        </div>
                        <div className="p-4 bg-indigo-50 dark:bg-slate-700 rounded-lg">
                            <p className="text-sm text-gray-500 dark:text-gray-400">Trend</p>
                            <p className={`text-2xl font-bold ${predictionData.prediction.trend === 'Increasing' ? 'text-red-500' : 'text-green-500'}`}>
                                {predictionData.prediction.trend}
                            </p>
                        </div>
                        <div className="p-4 bg-indigo-50 dark:bg-slate-700 rounded-lg">
                            <p className="text-sm text-gray-500 dark:text-gray-400">Confidence (R²)</p>
                            <p className="text-2xl font-bold text-gray-700 dark:text-gray-300">
                                {predictionData.prediction.confidence}
                            </p>
                        </div>
                    </div>
                    <p className="mt-4 text-gray-600 dark:text-gray-300 italic">
                        "{predictionData.prediction.explanation}"
                    </p>
                </div>
            ) : (
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border-l-4 border-yellow-500">
                    <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200">
                        AI Prediction Unavailable
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300">
                        {predictionData?.message || "Not enough data to generate a prediction (need at least 2 separate months of spending history)."}
                    </p>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Chart 1: Group Wise Spending */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg">
                    <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-200">Group-wise Monthly Spending</h3>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={processedChartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip contentStyle={{ backgroundColor: '#1f2937', color: '#fff' }} />
                                <Legend />
                                {[...groupNames].map((group, index) => (
                                    <Bar key={group} dataKey={group} stackId="a" fill={colors[index % colors.length]} />
                                ))}
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Chart 2: Prediction Trend */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg">
                    <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-200">Spending Trend & Prediction</h3>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={lineChartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip contentStyle={{ backgroundColor: '#1f2937', color: '#fff' }} />
                                <Legend />
                                <Line type="monotone" dataKey="amount" stroke="#8884d8" strokeWidth={2} name="History" />
                                {/* We render the prediction point separately effectively by using ReferenceDot or ComposedChart, 
                                    but simpler here: just note it in text or we can try to append data mostly.
                                */}
                                {predictionPoint && (
                                    <ReferenceDot x={lineChartData.length - 1} y={predictionPoint.amount} r={6} fill="red" stroke="none" />
                                )}
                            </LineChart>
                        </ResponsiveContainer>
                        {predictionPoint && (
                            <div className="text-center mt-2 text-sm text-gray-500">
                                (Red dot indicates projected path end, see card for value)
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
