# 🎨 Splittr Frontend

The React-based user interface for the Splittr application. Built with Vite for speed and Tailwind CSS for styling.

## 📱 Tech Stack
*   **React 19**: Latest React features.
*   **Vite**: Next-gen frontend tooling.
*   **Tailwind CSS**: Utility-first CSS framework.
*   **Recharts**: Composable charting library for Analytics.
*   **Socket.io-client**: For real-time event listening.
*   **Axios**: HTTP client with interceptors for auth.

## 🚀 Setup & Run

1.  **Install Dependencies**
    ```bash
    npm install
    ```

2.  **Environment Variables**
    Create a `.env` file:
    ```env
    VITE_API_URL=http://localhost:5000/api/v1
    VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
    ```

3.  **Start Development Server**
    ```bash
    npm run dev
    ```

## 📂 Key Components

*   **`pages/Dashboard.jsx`**: Main hub. Summaries, sidebar, group lists.
*   **`pages/Analytics.jsx`**: *[New]* Visualizes spending trends and AI predictions.
*   **`components/PaymentOrchestration.jsx`**: Handles the UI flow for settling debts.
*   **`context/AuthContext.jsx`**: Manages user session state laterally.

## 📊 Analytics Features
The frontend fetches data from the backend and renders:
*   **Bar Charts**: For comparing group spending.
*   **Trend Lines**: For visualizing history.
*   **Prediction Cards**: Displaying the backend's linear regression forecast.
