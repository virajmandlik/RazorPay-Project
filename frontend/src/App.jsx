 import React, { useState } from 'react'
import './App.css'
import ProductCard from './components/ProductCard'
import { products } from './data/products'
import axios from 'axios'
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
 * - Displays a list of products with prices
 * - Each product has a "Buy Now" button for payment initiation
 * - Uses React 19.2.0 with Vite as the build tool
 * - Styled with App.css which provides responsive layout
 * 
 * State:
 * @state {Object|null} selectedProduct - Currently selected product for purchase
 * 
 * Features:
 * - Product grid display with product cards
 * - Product selection on "Buy Now" click
 * - Responsive layout for mobile and desktop
 * - Clean, modern UI with product icons
 * 
 * Future Implementation:
 * - Integration with Razorpay checkout modal
 * - API calls to backend endpoints for order creation
 * - Payment success/failure handling
 * - Order confirmation display
 */
function App() {
  // Track selected product for payment processing
  const [selectedProduct, setSelectedProduct] = useState(null)

  /**
   * Handles product selection when "Buy Now" is clicked
   * 
   * @param {Object} product - The selected product object
   */
  const handleProductSelect = async(product) => {
    setSelectedProduct(product)
    console.log('Selected product:', product)
    console.log('Selected product price :', product.price)
    const amount = product.price;
    const {data:keyData}  = await axios.get("/api/v1/getkey")
    console.log("Razorpay Key Data:", keyData);
    const {data:orderData}  = await axios.post("/api/v1/payment/process", {
        amount: amount,
      })
      const {order} = orderData;
    console.log("Payment Process Data:", orderData);

        // Open Razorpay Checkout
      const options = {
        key: keyData.key, // Replace with your Razorpay key_id
        amount: amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
        currency: 'INR',
        name: 'Test Org',
        description: 'RazorPay Integration Payment',
        order_id: order.id, // This is the order_id created in the backend
        callback_url: '/api/v1/paymentVerification', // Your success URL
        prefill: {
          name: 'abc',
          email: 'abc@example.com',
          contact: '9999999999'
        },
        theme: {
          color: '#F37254'
        },
      };

      const rzp = new Razorpay(options);
      rzp.open();

  }

  return (
    <div className="app-container">
      {/* Header Section */}
      <header className="app-header">
        <h1 className="app-title">Razorpay Store</h1>
        <p className="app-subtitle">Browse and purchase our premium products</p>
      </header>

      {/* Main Content */}
      <main className="app-main">
        {/* Products Section */}
        <section className="products-section">
          <h2 className="section-title">Featured Products</h2>

          {/* Products Grid */}
          <div className="products-grid">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onBuyClick={handleProductSelect}
              />
            ))}
          </div>
        </section>

        {/* Selected Product Info (for debugging) */}
        {selectedProduct && (
          <section className="selected-product-info">
            <p>Selected: {selectedProduct.name} - ₹{selectedProduct.price}</p>
          </section>
        )}
      </main>
    </div>
  )
}

export default App
