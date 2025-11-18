/**
 * React Application Entry Point
 * 
 * This file is the bootstrap file for the React application.
 * It initializes the React DOM and mounts the root App component.
 * 
 * Key Concepts:
 * - StrictMode: Development tool that highlights potential issues
 * - createRoot: React 18+ API for rendering (replaces ReactDOM.render)
 * - Document root element: #root in index.html
 */

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

/**
 * Initialize React Application
 * 
 * Steps:
 * 1. Find the root DOM element (#root) in index.html
 * 2. Create a React root using createRoot API
 * 3. Render the App component wrapped in StrictMode
 * 4. StrictMode will:
 *    - Identify components with unsafe lifecycles
 *    - Warn about legacy string ref API usage
 *    - Warn about deprecated findDOMNode usage
 *    - Validate that components follow best practices
 */
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
