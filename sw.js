/**
 * Service Worker para funcionamiento 100% autónomo y Offline
 * Asistente Clínico para Médico Rural (Primer Nivel)
 */

const CACHE_NAME = "asistente-rural-v1";
const ASSETS_TO_CACHE = [
  "./",
  "./index.html",
  "./manifest.json",
  "./css/main.css",
  "./css/components.css",
  "./css/print.css",
  "./js/app.js",
  "./js/store.js",
  "./js/search.js",
  "./js/data/diseases.js",
  "./js/data/sivigila.js"
];

// Instalación: Precarga de recursos esenciales
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

// Activación: Limpieza de caches antiguos
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Estrategia de respuesta: Cache First con fallback de red
self.addEventListener("fetch", (event) => {
  // Ignorar peticiones no GET o de esquemas distintos (ej. extensiones)
  if (event.request.method !== "GET" || !event.request.url.startsWith("http")) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== "basic") {
          return networkResponse;
        }
        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });
        return networkResponse;
      }).catch(() => {
        // Si falla red y no hay cache, devolver index.html si es navegación HTML
        if (event.request.headers.get("accept")?.includes("text/html")) {
          return caches.match("./index.html");
        }
      });
    })
  );
});
