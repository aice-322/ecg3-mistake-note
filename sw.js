const CACHE = "ecg3-v2.0.1";

const ASSETS = [

  "./",

  "./index.html",

  "./manifest.webmanifest"

];

/* インストール */

self.addEventListener("install", event => {

  self.skipWaiting();

  event.waitUntil(

    caches.open(CACHE)

      .then(cache => cache.addAll(ASSETS))

  );

});

/* 有効化・古いキャッシュ削除 */

self.addEventListener("activate", event => {

  event.waitUntil(

    caches.keys()

      .then(keys => {

        return Promise.all(

          keys

            .filter(key => key !== CACHE)

            .map(key => caches.delete(key))

        );

      })

      .then(() => self.clients.claim())

  );

});

/* ページ・ファイル取得 */

self.addEventListener("fetch", event => {

  event.respondWith(

    fetch(event.request)

      .then(response => {

        if (response && response.status === 200) {

          const copy = response.clone();

          caches.open(CACHE)

            .then(cache => {

              cache.put(event.request, copy);

            });

        }

        return response;

      })

      .catch(() => {

        return caches.match(event.request);

      })

  );

});