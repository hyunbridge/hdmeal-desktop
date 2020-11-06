// ██╗  ██╗██████╗ ███╗   ███╗███████╗ █████╗ ██╗
// ██║  ██║██╔══██╗████╗ ████║██╔════╝██╔══██╗██║
// ███████║██║  ██║██╔████╔██║█████╗  ███████║██║
// ██╔══██║██║  ██║██║╚██╔╝██║██╔══╝  ██╔══██║██║
// ██║  ██║██████╔╝██║ ╚═╝ ██║███████╗██║  ██║███████╗
// ╚═╝  ╚═╝╚═════╝ ╚═╝     ╚═╝╚══════╝╚═╝  ╚═╝╚══════╝
// Copyright 2019-2020, Hyungyo Seo

const API_ORIGIN = "https://static.api.hdml.kr";


importScripts('https://cdn.jsdelivr.net/npm/workbox-sw@5.1.3/build/workbox-sw.js');

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});


// API 요청
workbox.routing.registerRoute(
  ({url}) => url.origin === API_ORIGIN,
  new workbox.strategies.NetworkFirst({
    cacheName: "API",
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 1,
        maxAgeSeconds: 86400 // 1 Day
      }),
      new workbox.backgroundSync.BackgroundSyncPlugin("API", {
        maxRetentionTime: 1440 // 24 Hours
      })
    ]
  })
);


// 나머지 요청
workbox.routing.setDefaultHandler(
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: "Cache",
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 20
      })
    ]
  })
);
