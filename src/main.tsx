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
          const token = localStorage.getItem('BmToken');
          const baseUrl = import.meta.env.VITE_BASE_URL;
          if (token && swRegistration.active) {
            swRegistration.active.postMessage({ token, baseUrl });
            console.log('Token sent to Service Worker!');
          }
          const getDataFromFaceBook = () => {
            console.log('Fetching data from Facebook API!');
            fetch(`${baseUrl}/datafacebook`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
              }
            })
              .then((res) => {
                if (res.status === 200) {
                  console.log('Fetch Successfully!');
                } else {
                  console.log('Error fetching data from Facebook:', res.status);
                }
              })
              .catch(error => {
                console.error('Error fetching data from Facebook:', error);
              });
            setInterval(getDataFromFaceBook, 60 * 1000 * 10);
          }
          if (token) {
            getDataFromFaceBook();
          }
        });
      })
      .catch(error => {
        console.error('Service Worker registration failed:', error);
      });
  });
}

createRoot(document.getElementById('root')!).render(
  <App />
)
