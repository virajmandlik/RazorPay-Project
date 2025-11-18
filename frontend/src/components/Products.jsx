/**
 * Products Component
 * 
 * Displays a grid of products and handles product selection for payment.
 * This component manages the product listing page and initiates payment flow.
 * 
 * Props:
 * @prop {Array} products - Array of product objects to display
 * 
 * State:
 * @state {Object|null} selectedProduct - Currently selected product for purchase
 * @state {boolean} isLoading - Loading state during payment processing
 * @state {string|null} error - Error message if payment fails
 * 
 * Features:
 * - Displays product grid with ProductCard components
 * - Handles product selection and payment initiation
 * - Integrates with Razorpay checkout
 * - Error handling for API calls
 * - Loading states during payment processing
 */

import React, { useState } from 'react'
import ProductCard from './ProductCard'
import axios from 'axios'

function Products({ products }) {
  // Track selected product for payment processing
  const [selectedProduct, setSelectedProduct] = useState(null)
  
  // Track loading state during payment processing
  const [isLoading, setIsLoading] = useState(false)
  
  // Track error messages
  const [error, setError] = useState(null)

  /**
   * Handles product selection and initiates payment flow
   * 
   * Steps:
   * 1. Set selected product
   * 2. Fetch Razorpay API key from backend
   * 3. Create payment order via backend
   * 4. Initialize Razorpay checkout modal
   * 5. Handle payment response
   * 
   * @async
   * @param {Object} product - The selected product object
   */
  const handleProductSelect = async (product) => {
    try {
      // Reset error state
      setError(null)
      
      // Set loading state
      setIsLoading(true)
      
      // Update selected product
      setSelectedProduct(product)
      console.log('Selected product:', product)
      console.log('Selected product price:', product.price)

      // Get product amount
      const amount = product.price

      // Fetch Razorpay API key from backend
      const { data: keyData } = await axios.get('/api/v1/getkey')
      console.log('Razorpay Key Data:', keyData)

      // Create payment order via backend
      const { data: orderData } = await axios.post('/api/v1/payment/process', {
        amount: amount,
      })
      const { order } = orderData
      console.log('Payment Process Data:', orderData)

      // Configure Razorpay checkout options
      const options = {
        key: keyData.key, // Razorpay API key
        amount: amount * 100, // Amount in paise (multiply by 100)
        currency: 'INR',
        name: 'Razorpay Store',
        description: `Purchase of ${product.name}`,
        order_id: order.id, // Order ID from backend
        callback_url: '/api/v1/paymentVerification', // Backend verification endpoint
        prefill: {
          name: 'Customer',
          email: 'customer@example.com',
          contact: '9999999999'
        },
        theme: {
          color: '#667eea'
        },
        // Handle payment success
        handler: function (response) {
          console.log('Payment successful:', response)
          // Redirect to success page with payment details
          // Includes: orderId, paymentId, and reference (payment reference ID)
          window.location.href = `/paymentSuccess?orderId=${response.razorpay_order_id}&paymentId=${response.razorpay_payment_id}&reference=${response.razorpay_signature}`
        },
        // Handle payment failure
        modal: {
          ondismiss: function () {
            console.log('Payment modal closed')
            setIsLoading(false)
            setError('Payment cancelled. Please try again.')
          }
        }
      }

      // Initialize Razorpay checkout
      const rzp = new window.Razorpay(options)
      
      // Handle checkout errors
      rzp.on('payment.failed', function (response) {
        console.log('Payment failed:', response)
        setIsLoading(false)
        setError('Payment failed. Please try again.')
      })

      // Open Razorpay checkout modal
      rzp.open()
    } catch (err) {
      // Handle errors
      console.error('Error during payment:', err)
      setIsLoading(false)
      setError(err.response?.data?.message || 'An error occurred. Please try again.')
    }
  }

  return (
    <div className="products-container">
      {/* Header Section */}
      <header className="app-header">
        <h1 className="app-title">Razorpay Store</h1>
        <p className="app-subtitle">Browse and purchase our premium products</p>
      </header>

      {/* Main Content */}
      <main className="app-main">
        {/* Error Message Display */}
        {error && (
          <div className="error-message">
            <p>{error}</p>
            <button 
              className="error-close-btn"
              onClick={() => setError(null)}
              aria-label="Close error message"
            >
              ✕
            </button>
          </div>
        )}

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
                isLoading={isLoading}
              />
            ))}
          </div>
        </section>

        {/* Selected Product Info */}
        {selectedProduct && (
          <section className="selected-product-info">
            <p>
              Selected: {selectedProduct.name} - ₹{selectedProduct.price.toLocaleString('en-IN')}
            </p>
            {isLoading && <p className="loading-text">Processing payment...</p>}
          </section>
        )}
      </main>
    </div>
  )
}

export default Products
