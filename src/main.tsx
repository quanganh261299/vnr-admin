import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './reset.scss'
import './global.scss'
import App from './App'

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('Service Worker registered with scope:', registration.scope);
        navigator.serviceWorker.ready.then(swRegistration => {
          const token = localStorage.getItem('token');
          if (token && swRegistration.active) {
            swRegistration.active.postMessage({ token });
            console.log('Token sent to Service Worker:', token);
          }
        });
      })
      .catch(error => {
        console.error('Service Worker registration failed:', error);
      });
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
