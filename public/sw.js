let tokenPromise;
let resolveTokenPromise;

self.addEventListener('install', (event) => {
  console.log('Service Worker installed.');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker activated.');
  self.clients.claim();

  // Tạo Promise để theo dõi token
  tokenPromise = new Promise((resolve) => {
    resolveTokenPromise = resolve;
  });

  const getDataFromFacebook = () => {
    console.log('Starting...')
    tokenPromise.then(token => {
      if (!token) {
        console.error('No token available.');
        setTimeout(getDataFromFacebook, 10000); // Lặp lại sau 10 giây nếu không có token
        return;
      }

      console.log('Fetching data from Facebook API!');
      fetch('https://ads.versethin.net/api/datafacebook', {
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

      // Lặp lại quá trình fetch sau 10 giây
      setTimeout(getDataFromFacebook, 60 * 10 * 1000);
    }).catch((err) => console.log('Error in token promise:', err));
  };

  // Chỉ bắt đầu gọi API sau khi token được nhận
  tokenPromise.then(() => {
    getDataFromFacebook();
  });
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.token) {
    console.log('Token received!');
    if (resolveTokenPromise) {
      console.log('Resolving with token:', event.data.token);
      resolveTokenPromise(event.data.token); // Giải quyết Promise với token
      resolveTokenPromise = null; // Đảm bảo Promise chỉ được giải quyết một lần
    }
  }
});