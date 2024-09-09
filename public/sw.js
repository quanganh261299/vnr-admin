self.addEventListener('install', (event) => {
  console.log('Service Worker installed.');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker activated.');
  self.clients.claim();

  // const logMessage = () => {
  //   console.log('Logging from Service Worker every 1 second');
  //   setTimeout(logMessage, 1000);
  // };

  // logMessage();
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
});
