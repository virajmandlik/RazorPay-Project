/**
 * Mock Product Data
 * 
 * Contains sample products with their details for the e-commerce application.
 * Each product has an ID, name, price (in INR), description, image URL, and rating.
 * 
 * Product images are sourced from Unsplash (free stock photos).
 * In a real application, this data would come from a backend API.
 * 
 * Image sources:
 * - Headphones: High-quality wireless audio device
 * - Smart Watch: Wearable technology with health tracking
 * - Wireless Charger: Fast charging pad for devices
 * - USB-C Cable: Premium charging and data cable
 * - Phone Stand: Adjustable mobile device holder
 */

export const products = [
  {
    id: 1,
    name: 'Premium Headphones',
    price: 2999,
    description: 'High-quality wireless headphones with active noise cancellation and 30-hour battery life',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop',
    rating: 4.8,
    reviews: 324
  },
  {
    id: 2,
    name: 'Smart Watch',
    price: 4999,
    description: 'Feature-rich smartwatch with heart rate monitor, sleep tracking, and 7-day battery',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop',
    rating: 4.6,
    reviews: 287
  },
  {
    id: 3,
    name: 'Wireless Charger',
    price: 1499,
    description: 'Fast 15W wireless charging pad compatible with all Qi-enabled devices',
    image: 'https://images.unsplash.com/photo-1591290621749-2c547f1b6298?w=500&h=500&fit=crop',
    rating: 4.7,
    reviews: 156
  },
  {
    id: 4,
    name: 'USB-C Cable',
    price: 599,
    description: 'Durable 2-meter USB-C cable with fast charging and data transfer support',
    image: 'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=500&h=500&fit=crop',
    rating: 4.5,
    reviews: 412
  },
  {
    id: 5,
    name: 'Phone Stand',
    price: 799,
    description: 'Adjustable aluminum phone stand perfect for desk, travel, and video calls',
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&h=500&fit=crop',
    rating: 4.9,
    reviews: 198
  }
]
