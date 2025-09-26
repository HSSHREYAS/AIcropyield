import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { mobileGestureManager } from './lib/mobile-gestures.ts'

// Initialize mobile features
mobileGestureManager.optimizeScrolling();

// Add orientation change handling
mobileGestureManager.onOrientationChange((orientation) => {
  document.body.setAttribute('data-orientation', orientation);
});

// Add skip links for accessibility
const skipLink = document.createElement('a');
skipLink.href = '#main-content';
skipLink.className = 'skip-link';
skipLink.textContent = 'Skip to main content';
document.body.insertBefore(skipLink, document.body.firstChild);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
