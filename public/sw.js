self.addEventListener('install', (event) => {
  console.log('Service Worker installed.');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker activated.');
  self.clients.claim();

  // Hàm để lấy dữ liệu từ Facebook API, sử dụng token từ biến toàn cục
  const getDataFromFacebook = () => {
    const token = self.token; // Sử dụng token đã lưu trong Service Worker
    console.log('Fetching data from Facebook API');
    fetch('https://ads.versethin.net/api/datafacebook', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
      }
    })
      .then(res => console.log('Fetch successfully!'))
      .catch(error => {
        console.error('Error fetching data from Facebook:', error);
      });
    setTimeout(getDataFromFacebook, 60 * 10 * 1000);
  };

  getDataFromFacebook();
  self.clients.claim();
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.token) {
    self.token = event.data.token;
    console.log('Token received in Service Worker:', self.token);
  }
});

self.addEventListener('fetch', (event) => {
});
