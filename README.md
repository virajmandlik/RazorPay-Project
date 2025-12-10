# 💰 Splittr - Smart Expense Splitter & Analytics Platform

**Splittr** is a full-stack MERN application designed to make sharing expenses easy, transparent, and intelligent. It features real-time synchronization, group expense tracking, and a local machine-learning module for analyzing and predicting future spending habits.

## 🚀 Key Features

*   **👥 Group Management**: Create groups, invite members, and manage shared expenses seamlessly.
*   **💸 Smart Splitting**: Automatically calculates "Who owes Who" with an optimized debt simplification algorithm.
*   **⚡ Real-Time Updates**: Powered by **Socket.io**, changes to groups and expenses are reflected instantly across all connected clients.
*   **📊 Advanced Analytics**:
    *   **Group-wise Breakdown**: Visual bar charts showing where your money goes.
    *   **🔮 spending Prediction**: A built-in linear regression model (using `simple-statistics`) predicts your next month's spending based on personal historical data.
*   **💳 Payment Orchestration**: Integrated dummy payment flow with **Razorpay** support for settling debts.
*   **📄 PDF Reports**: Export detailed transaction reports for offline viewing.

## 🛠️ Tech Stack

### Backend
*   **Node.js & Express**: Robust RESTful API architecture.
*   **MongoDB & Mongoose**: Flexible schema design for Users, Groups, and Expenses.
*   **Socket.io**: Real-time bidirectional communication.
*   **Simple-Statistics**: Local, privacy-focused statistical library for predictive modeling.
*   **Passport.js**: Social Authentication strategies (Google, GitHub).

### Frontend
*   **React (Vite)**: Fast, modern UI development.
*   **Tailwind CSS**: Responsive, dark-mode enabled styling.
*   **Recharts**: Interactive data visualization for analytics.
*   **Context API**: State management for Auth and Sockets.

## 🏁 Quick Start Guide

### Prerequisites
*   Node.js (v18+)
*   MongoDB (Local or Atlas URI)

### 1. clone the Repository
```bash
git clone https://github.com/virajmandlik/RazorPay-Project.git
cd RazorPay-Project
```

### 2. Backend Setup
```bash
cd backend
npm install

# Create .env file (see backend/README.md for details)
# Run the seed script to populate data for analytics
npm run seed

# Start Server
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install

# Start React Dev Server
npm run dev
```

## 📂 Project Structure

*   **/backend**: API Server, Database Models, Analytics Logic.
*   **/frontend**: React UI, Components, Pages, Visualizations.

## 🔒 Privacy Note
The "AI Prediction" feature runs entirely on your server using **Linear Regression**. No financial data is sent to external AI providers or LLMs.
