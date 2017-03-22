importScripts('/src/js/sw-lib.min.js');
/*
const cdnCacheStrategy = goog.swlib.cacheFirst({cacheableResponse: {statuses: [0],}});
goog.swlib.router.registerRoute(new RegExp('^https://unpkg.com/compromise@latest/builds/compromise.min.js'), cdnCacheStrategy);
goog.swlib.router.registerRoute(new RegExp('^https://cdn.jsdelivr.net/lodash'), cdnCacheStrategy);
goog.swlib.router.registerRoute(new RegExp('^https://www.gstatic.com/firebasejs/3.7.0/firebase.js'), cdnCacheStrategy);
goog.swlib.router.registerRoute('/sw.js', goog.swlib.networkFirst());         //.staleWhileRevalidate() ??
goog.swlib.router.registerRoute('/', goog.swlib.networkFirst());              //.staleWhileRevalidate() ??
goog.swlib.router.registerRoute('/index.html', goog.swlib.networkFirst());    //.staleWhileRevalidate() ??
goog.swlib.router.registerRoute(new RegExp('.html|.css|.js'), goog.swlib.cacheFirst());
*/