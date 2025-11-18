import React from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Products from './components/Products'
import PaymentSuccess from './components/PaymentSuccess'
import { products } from './data/products'

/**
 * App Component
 * 
 * Main application component for the Razorpay Payment Integration project.
 * 
 * Project Context:
 * - This is a React + Vite frontend application integrated with a Node.js/Express backend
 * - Backend runs on PORT 8000 and provides payment processing endpoints:
 *   - POST /api/v1/payment/process - Creates a Razorpay order
 *   - GET /api/v1/getkey - Retrieves the Razorpay API key for frontend
 * - Backend uses Razorpay SDK to handle payment order creation
 * - Frontend will communicate with backend to initiate payments
 * 
 * Current State:
 * - Uses React Router for client-side routing
 * - Displays products on home page (/)
 * - Shows payment success page on (/paymentSuccess)
 * - Uses React 19.2.0 with Vite as the build tool
 * - Styled with App.css which provides responsive layout
 * 
 * Routes:
 * - / - Products listing page
 * - /paymentSuccess - Payment success confirmation page
 * 
 * Features:
 * - Client-side routing with React Router
 * - Product grid display with product cards
 * - Product selection and payment initiation
 * - Payment success page with order details
 * - Responsive layout for mobile and desktop
 * - Clean, modern UI with animations
 * 
 * Dependencies:
 * - react-router-dom: Client-side routing
 * - axios: HTTP requests to backend
 * - razorpay: Payment gateway integration
 */
function App() {
  return (
    <Router>
      <Routes>
        {/* Home Route - Products Listing */}
        <Route
          path="/"
          element={<Products products={products} />}
        />

        {/* Payment Success Route */}
        <Route
          path="/paymentSuccess"
          element={<PaymentSuccess />}
        />
      </Routes>
    </Router>
  )
}

export default App
