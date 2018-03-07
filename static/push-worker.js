self.addEventListener('push', event => {
  const text = event.data.text();
  console.log('[Service Worker] Push Received.');
  console.log(`[Service Worker] Push had this data: "${text}"`);

  const title = 'Notes PWA';
  const options = {
    body: text,
  };

  event.waitUntil(self.registration.showNotification(title, options));
});
