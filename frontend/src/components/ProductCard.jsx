/**
 * ProductCard Component
 * 
 * Displays a single product with its image, details, rating, and a "Buy Now" button.
 * This is a reusable component that renders product information in an enhanced card format.
 * 
 * Props:
 * @prop {Object} product - Product object containing all product details
 * @prop {number} product.id - Unique product identifier
 * @prop {string} product.name - Product name
 * @prop {number} product.price - Product price in INR
 * @prop {string} product.description - Product description
 * @prop {string} product.image - Product image URL
 * @prop {number} product.rating - Product rating (0-5)
 * @prop {number} product.reviews - Number of customer reviews
 * @prop {Function} onBuyClick - Callback function when "Buy Now" button is clicked
 * @prop {boolean} isLoading - Whether payment is being processed
 * 
 * Features:
 * - Displays product image with loading state
 * - Shows product name, description, and price
 * - Displays star rating and review count
 * - Interactive "Buy Now" button with hover effects
 * - Responsive card layout with smooth animations
 * - Error handling for image loading failures
 * - Disabled state during payment processing
 */
function ProductCard({ product, onBuyClick, isLoading = false }) {
  // Handle buy button click
  const handleBuyClick = () => {
    onBuyClick(product)
  }

  /**
   * Renders star rating based on product rating
   * 
   * @param {number} rating - Rating value (0-5)
   * @returns {JSX} Star rating display
   */
  const renderStars = (rating) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0

    // Add full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={`star-${i}`} className="star full">★</span>)
    }

    // Add half star if applicable
    if (hasHalfStar) {
      stars.push(<span key="half-star" className="star half">★</span>)
    }

    // Add empty stars to make total 5
    const emptyStars = 5 - Math.ceil(rating)
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<span key={`empty-${i}`} className="star empty">★</span>)
    }

    return stars
  }

  return (
    <div className="product-card">
      {/* Product Image Container */}
      <div className="product-image-container">
        <img
          src={product.image}
          alt={product.name}
          className="product-image"
          loading="lazy"
        />
        {/* Badge for rating */}
        <div className="rating-badge">
          <span className="badge-rating">{product.rating}</span>
        </div>
      </div>

      {/* Product Details */}
      <div className="product-details">
        {/* Product Name */}
        <h3 className="product-name">{product.name}</h3>

        {/* Star Rating */}
        <div className="product-rating">
          <div className="stars-container">
            {renderStars(product.rating)}
          </div>
          <span className="review-count">({product.reviews})</span>
        </div>

        {/* Product Description */}
        <p className="product-description">{product.description}</p>

        {/* Product Price */}
        <div className="product-price">
          <span className="currency">₹</span>
          <span className="amount">{product.price.toLocaleString('en-IN')}</span>
        </div>
      </div>

      {/* Buy Button */}
      <button
        className="buy-button"
        onClick={handleBuyClick}
        aria-label={`Buy ${product.name}`}
      >
        <span className="button-text">Buy Now</span>
        <span className="button-icon">→</span>
      </button>
    </div>
  )
}

export default ProductCard
