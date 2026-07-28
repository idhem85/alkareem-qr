/* ===== Al Kareem — Service Worker v3 =====
 * Stratégies :
 *   - Install : pré-cache des ressources statiques (polices, icônes, manifeste)
 *   - Activate : nettoyage des anciens caches
 *   - Fetch (navigations) : Network First, Cache Fallback (SPA-aware)
 *   - Fetch (assets statiques) : Cache First
 *   - Offline : page de secours avec app shell SPA
 */

const CACHE_NAME = "al-kareem-v3";
const STATIC_CACHE = "al-kareem-static-v3";
const FONT_CACHE = "al-kareem-fonts-v3";
const PAGE_CACHE = "al-kareem-pages-v3";

const PRECACHE_URLS = [
  "/",
  "/manifest.json",
  "/favicon.ico",
  "/favicon.png",
  "/fonts/UthmanicHafs.woff2",
  "/icon-192.png",
  "/icon-512.png",
  "/logo.png",
];

// ===== INSTALL =====
self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(STATIC_CACHE);
      // Pre-cache known static assets
      await cache.addAll(PRECACHE_URLS).catch((err) => {
        console.warn("[SW] Pre-cache partial failure:", err);
      });

      // Also try to cache the Google Fonts stylesheet
      try {
        const fontCssResponse = await fetch(
          "https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Plus+Jakarta+Sans:wght@200..800&display=swap",
          { mode: "cors" }
        );
        if (fontCssResponse.ok) {
          const fontCache = await caches.open(FONT_CACHE);
          await fontCache.put(
            "https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Plus+Jakarta+Sans:wght@200..800&display=swap",
            fontCssResponse.clone()
          );

          // Parse the CSS for font URLs and cache them too
          const cssText = await fontCssResponse.text();
          const fontUrlRegex = /url\(([^)]+)\)/g;
          let match;
          const fontUrls = [];
          while ((match = fontUrlRegex.exec(cssText)) !== null) {
            const url = match[1].replace(/['"]/g, "");
            if (url.startsWith("https://")) fontUrls.push(url);
          }
          await fontCache.addAll(fontUrls).catch(() => {});
        }
      } catch {
        // Non-critical
      }

      // Skip waiting to activate immediately
      self.skipWaiting();
    })()
  );
});

// ===== ACTIVATE =====
self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      // Delete old caches
      const cacheNames = await caches.keys();
      const validCaches = [CACHE_NAME, STATIC_CACHE, FONT_CACHE, PAGE_CACHE];
      await Promise.all(
        cacheNames
          .filter((name) => !validCaches.includes(name))
          .map((name) => caches.delete(name))
      );
      // Take control of all clients immediately
      await clients.claim();
    })()
  );
});

// ===== FETCH =====
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  const isSameOrigin = url.origin === self.location.origin;
  const isGoogleFont =
    url.hostname === "fonts.googleapis.com" || url.hostname === "fonts.gstatic.com";
  const isAladhan = url.hostname === "api.aladhan.com";

  // Navigation requests: Network First with SPA-aware offline fallback
  if (request.mode === "navigate") {
    event.respondWith(navigationStrategy(request));
    return;
  }

  // Google Fonts: Cache First
  if (isGoogleFont) {
    event.respondWith(cacheFirstStrategy(request, FONT_CACHE));
    return;
  }

  // Same-origin static assets: Cache First
  if (isSameOrigin) {
    const pathname = url.pathname;

    // Static files: images, fonts, manifest, favicon
    if (/\.(png|ico|svg|woff2?|ttf|json|txt)$/.test(pathname)) {
      event.respondWith(cacheFirstStrategy(request, STATIC_CACHE));
      return;
    }

    // JS/CSS bundles: Cache First (hash-based filenames)
    if (/\.(js|css)$/.test(pathname)) {
      event.respondWith(cacheFirstStrategy(request, CACHE_NAME));
      return;
    }

    // HTML documents: Network First
    if (request.destination === "document") {
      event.respondWith(navigationStrategy(request));
      return;
    }
  }

  // AlAdhan API: Network First with 1-hour TTL
  if (isAladhan && request.method === "GET") {
    event.respondWith(networkFirstStrategy(request, PAGE_CACHE, 3600));
    return;
  }

  // Everything else: let the browser handle it
  return;
});

// ===== STRATEGIES =====

/**
 * Navigation Strategy: Network First, Cache Fallback.
 *
 * For SPAs, all routes serve the same index.html. When offline and
 * navigating to a URL not yet cached, we serve the cached root "/"
 * which contains the full React app shell. This allows the SPA to
 * bootstrap and render the OfflinePage component client-side.
 */
async function navigationStrategy(request) {
  try {
    const response = await fetch(request);

    if (response.ok && response.headers.get("Content-Type")?.includes("text/html")) {
      const cache = await caches.open(PAGE_CACHE);
      cache.put(request, response.clone()).catch(() => {});
    }

    return response;
  } catch {
    // 1. Try the exact URL first
    const cached = await caches.match(request);
    if (cached) return cached;

    // 2. SPA fallback: serve the cached root index.html
    //    The React app will render the OfflinePage component client-side.
    const root = await caches.match("/");
    if (root) return root;

    // 3. Last resort: minimal inline HTML
    return new Response(
      "<!DOCTYPE html><html dir=\"rtl\" lang=\"ar\"><head><meta charset=\"UTF-8\"><meta name=\"viewport\" content=\"width=device-width,initial-scale=1.0\"><title>Hors ligne</title><style>body{font-family:sans-serif;display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;margin:0;padding:2rem;text-align:center;background:#faf8f3;color:#1a3c2a}h1{font-size:1.5rem;margin-bottom:0.5rem}p{color:#666;max-width:20rem}</style></head><body><p style=\"font-size:3rem;margin-bottom:0\">\u{1F54C}</p><h1>\u062E\u0627\u0631\u062C \u0627\u0644\u062E\u0637</h1><p>\u0623\u0646\u062A \u063A\u064A\u0631 \u0645\u062A\u0635\u0644 \u0628\u0627\u0644\u0625\u0646\u062A\u0631\u0646\u062A. \u062D\u0627\u0648\u0644 \u0627\u0644\u0627\u062A\u0635\u0627\u0644 \u0644\u0627\u0633\u062A\u0626\u0646\u0627\u0641 \u0627\u0644\u0642\u0631\u0627\u0621\u0629.</p><p>Vous \u00EAtes hors ligne. Connectez-vous pour reprendre la lecture.</p></body></html>",
      {
        status: 200,
        statusText: "OK",
        headers: { "Content-Type": "text/html; charset=utf-8" },
      }
    );
  }
}

/**
 * Network First: try network, fall back to cache.
 * Optionally set a TTL-based expiry for cached items.
 * Never throws.
 */
async function networkFirstStrategy(request, cacheName, maxAgeSeconds) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone()).catch(() => {});
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    if (cached) {
      if (maxAgeSeconds !== undefined && maxAgeSeconds !== null) {
        const cachedDate = new Date(cached.headers.get("date") || 0);
        const age = (Date.now() - cachedDate.getTime()) / 1000;
        if (age < maxAgeSeconds) return cached;
      } else {
        return cached;
      }
    }
    return new Response(null, { status: 204 });
  }
}

/**
 * Cache First (stale-while-revalidate): serve from cache first,
 * update cache in background. Never throws.
 */
async function cacheFirstStrategy(request, cacheName) {
  const cached = await caches.match(request);
  if (cached) {
    fetch(request)
      .then((response) => {
        if (response.ok) {
          caches.open(cacheName).then((cache) => cache.put(request, response));
        }
      })
      .catch(() => {});
    return cached;
  }

  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone()).catch(() => {});
    }
    return response;
  } catch {
    return new Response(null, { status: 204 });
  }
}

// ===== PUSH NOTIFICATIONS =====
self.addEventListener("push", (event) => {
  if (!event.data) return;

  try {
    const data = event.data.json();
    const options = {
      body: data.body || "Il est temps de lire quelques versets du Coran \uD83D\uDCD6",
      icon: "/icon-192.png",
      badge: "/icon-192.png",
      vibrate: [100, 50, 100],
      dir: "auto",
      data: data.data || { url: "/" },
      actions: [
        { action: "open", title: "Lire maintenant" },
        { action: "close", title: "Plus tard" },
      ],
    };

    event.waitUntil(
      self.registration.showNotification(
        data.title || "Al Kareem \u2014 Verset du jour",
        options
      )
    );
  } catch {
    event.waitUntil(
      self.registration.showNotification("Al Kareem \u2014 Verset du jour", {
        body: event.data.text(),
        icon: "/icon-192.png",
      })
    );
  }
});

// ===== NOTIFICATION CLICK =====
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  if (event.action === "close") return;

  const url = event.notification.data?.url || "/";

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if (client.url.includes(self.location.origin) && "focus" in client) {
            client.navigate(url);
            return client.focus();
          }
        }
        return clients.openWindow(url);
      })
  );
});
