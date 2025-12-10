# 🔙 Splittr Backend API

This is the Node.js/Express backend for the Splittr application. It handles user authentication, group management, expense tracking, and analytics processing.

## 🛠️ Features
*   **Authentication**: JWT-based auth (Access/Refresh tokens) + Social Auth (Passport.js).
*   **Database**: Mongoose models for robust data validation.
*   **Real-time**: Socket.io integration for instant client updates.
*   **Analytics Engine**: Custom controller utilizing `simple-statistics` for linear regression predictions.

## 🔧 Setup & Installation

1.  **Install Dependencies**
    ```bash
    npm install
    ```

2.  **Environment Variables**
    Create a `.env` file in this directory with the following:
    ```env
    PORT=5000
    MONGODB_URI=your_mongodb_connection_string
    CORS_ORIGIN=http://localhost:5173
    
    # JWT Secrets
    ACCESS_TOKEN_SECRET=your_access_secret
    ACCESS_TOKEN_EXPIRY=1d
    REFRESH_TOKEN_SECRET=your_refresh_secret
    REFRESH_TOKEN_EXPIRY=10d
    
    # Social Auth (Optional)
    GOOGLE_CLIENT_ID=...
    GOOGLE_CLIENT_SECRET=...
    GITHUB_CLIENT_ID=...
    GITHUB_CLIENT_SECRET=...
    
    # Payment (Razorpay)
    RAZORPAY_KEY_ID=...
    RAZORPAY_KEY_SECRET=...
    ```

3.  **Run Data Seeder (Important for Analytics)**
    Populate the DB with dummy data to test the prediction model.
    ```bash
    npm run seed
    ```

4.  **Start Server**
    ```bash
    # Development (Nodemon)
    npm run dev
    
    # Production
    npm start
    ```

## 📡 API Endpoints

### Analytics
*   `GET /api/v1/analytics/monthly-group-stats` - Get spending broken down by group & month.
*   `GET /api/v1/analytics/prediction` - Get future spending forecast based on history.

### Groups
*   `POST /api/v1/groups` - Create a new group.
*   `GET /api/v1/groups` - List user's groups.
*   `POST /api/v1/groups/:groupId/expenses` - Add an expense.

### Auth
*   `POST /api/v1/users/register`
*   `POST /api/v1/users/login`

## 🔮 Analytics Logic
The analytics controller (`controllers/analytics.controller.js`) fetches a user's expenses, aggregates them by month, and trains a local **Linear Regression** model on the fly to predict the next month's total.
