/**
 * PaymentSuccess Component
 * 
 * Displays payment success confirmation page after successful Razorpay payment.
 * Shows order details, payment confirmation, and provides navigation back to products.
 * 
 * Features:
 * - Displays success message with animation
 * - Shows order ID, payment ID, and reference ID
 * - Extracts payment details from URL query parameters
 * - Provides button to return to products
 * - Responsive design matching app theme
 * - Error handling for missing order details
 * - Copy-to-clipboard functionality for all IDs
 * - Print receipt feature
 * 
 * URL Parameters:
 * - orderId: Razorpay order ID
 * - paymentId: Razorpay payment ID
 * - reference: Razorpay payment reference ID
 */

import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

function PaymentSuccess() {
  // Get navigation function
  const navigate = useNavigate()
  
  // Get location object to access URL search parameters
  const location = useLocation()
  
  // Track order details from URL
  const [orderDetails, setOrderDetails] = useState({
    orderId: null,
    paymentId: null,
    reference: null
  })

  /**
   * Extract payment details from URL query parameters on component mount
   * 
   * Uses URLSearchParams to parse the query string and extract:
   * - orderId: Razorpay order ID
   * - paymentId: Razorpay payment ID
   * - reference: Razorpay payment reference ID
   */
  useEffect(() => {
    // Parse URL search parameters
    const query = new URLSearchParams(location.search)
    
    // Extract payment details from query parameters
    const orderId = query.get('orderId')
    const paymentId = query.get('paymentId')
    const reference = query.get('reference')

    // Update state with extracted details
    if (orderId || paymentId || reference) {
      setOrderDetails({
        orderId,
        paymentId,
        reference
      })
      console.log('Payment Success - Order ID:', orderId)
      console.log('Payment Success - Payment ID:', paymentId)
      console.log('Payment Success - Reference ID:', reference)
    }
  }, [location.search])

  /**
   * Handles navigation back to products page
   */
  const handleBackToProducts = () => {
    navigate('/')
  }

  return (
    <div className="payment-success-container">
      {/* Background gradient */}
      <div className="success-background"></div>

      {/* Success Content */}
      <div className="success-content">
        {/* Success Icon */}
        <div className="success-icon">
          <svg
            width="80"
            height="80"
            viewBox="0 0 80 80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="40" cy="40" r="40" fill="#4CAF50" />
            <path
              d="M32 40L36 44L48 32"
              stroke="white"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* Success Message */}
        <h1 className="success-title">Payment Successful!</h1>
        <p className="success-subtitle">
          Thank you for your purchase. Your order has been confirmed.
        </p>

        {/* Order Details Card */}
        <div className="order-details-card">
          <h2 className="details-title">Order Details</h2>

          {/* Order ID */}
          <div className="detail-item">
            <span className="detail-label">Order ID:</span>
            <span className="detail-value">
              {orderDetails.orderId || 'N/A'}
            </span>
            {orderDetails.orderId && (
              <button
                className="copy-btn"
                onClick={() => {
                  navigator.clipboard.writeText(orderDetails.orderId)
                  alert('Order ID copied to clipboard')
                }}
                aria-label="Copy order ID"
              >
                📋
              </button>
            )}
          </div>

          {/* Payment ID */}
          <div className="detail-item">
            <span className="detail-label">Payment ID:</span>
            <span className="detail-value">
              {orderDetails.paymentId || 'N/A'}
            </span>
            {orderDetails.paymentId && (
              <button
                className="copy-btn"
                onClick={() => {
                  navigator.clipboard.writeText(orderDetails.paymentId)
                  alert('Payment ID copied to clipboard')
                }}
                aria-label="Copy payment ID"
              >
                📋
              </button>
            )}
          </div>

          {/* Reference ID */}
          {orderDetails.reference && (
            <div className="detail-item">
              <span className="detail-label">Reference ID:</span>
              <span className="detail-value">
                {orderDetails.reference}
              </span>
              <button
                className="copy-btn"
                onClick={() => {
                  navigator.clipboard.writeText(orderDetails.reference)
                  alert('Reference ID copied to clipboard')
                }}
                aria-label="Copy reference ID"
              >
                📋
              </button>
            </div>
          )}

          {/* Status */}
          <div className="detail-item">
            <span className="detail-label">Status:</span>
            <span className="detail-value status-success">✓ Completed</span>
          </div>

          {/* Date */}
          <div className="detail-item">
            <span className="detail-label">Date:</span>
            <span className="detail-value">
              {new Date().toLocaleDateString('en-IN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
          </div>
        </div>

        {/* Information Message */}
        <div className="info-message">
          <p>
            A confirmation email has been sent to your registered email address.
            You can track your order status anytime.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          <button
            className="btn-primary"
            onClick={handleBackToProducts}
          >
            Continue Shopping
          </button>
          <button
            className="btn-secondary"
            onClick={() => window.print()}
          >
            Print Receipt
          </button>
        </div>

        {/* Additional Info */}
        <div className="additional-info">
          <p>
            Need help? <a href="mailto:support@razorpaystore.com">Contact Support</a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default PaymentSuccess
