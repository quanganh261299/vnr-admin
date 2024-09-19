let resolveTokenAndBaseUrlPromise;
const tokenAndBaseUrlPromise = new Promise((resolve) => {
  resolveTokenAndBaseUrlPromise = resolve;
});

self.addEventListener('install', (event) => {
  console.log('Service Worker installed.');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker activated.');
  self.clients.claim();

  const getDataFromFacebook = (token, baseUrl) => {
    console.log('Starting...');
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

    // Lặp lại quá trình fetch sau 10 phút
    setInterval(() => {
      tokenAndBaseUrlPromise.then(({ token, baseUrl }) => {
        getDataFromFacebook(token, baseUrl);
      });
    }, 60 * 10 * 1000);
  };

  // Bắt đầu gọi API sau khi token và baseUrl đều có sẵn
  tokenAndBaseUrlPromise.then(({ token, baseUrl }) => {
    getDataFromFacebook(token, baseUrl);
  }).catch((err) => console.log('Error in token and baseUrl promise:', err));
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.token && event.data.baseUrl) {
    console.log('Token and BaseUrl received!');
    if (resolveTokenAndBaseUrlPromise) {
      console.log('Resolving with token and baseUrl:', event.data.token, event.data.baseUrl);
      resolveTokenAndBaseUrlPromise({ token: event.data.token, baseUrl: event.data.baseUrl });
      resolveTokenAndBaseUrlPromise = null;
    }
  }
});