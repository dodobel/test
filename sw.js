importScripts("https://storage.googleapis.com/workbox-cdn/releases/3.1.0/workbox-sw.js");
var cacheStorageKey = 'minimal-pwa-1'
// 路径是相对于缓存来源，而不是应用程序的目录。
var cacheList=[
  '/test/index.html',
  '/test/main.css',
  '/test/Desert.jpg'
]
self.addEventListener('install',e =>{
  e.waitUntil(
    caches.open(cacheStorageKey)
    // 如果这些资源中有任何资源不能保存，缓存就会失败
    .then(cache => cache.addAll(cacheList))
    .then(() => self.skipWaiting())
  )
})

// 定义一个资源被请求时候会发生什么
// 对于我们的应用，我们以缓存优先的方式
self.addEventListener('fetch',function(e){
    e.respondWith(
       // 试着从缓存中获取.
      caches.match(e.request).then(function(response){
        if(response != null){
          return response
        }
        // 如果资源没有存储在缓存中，就回退到网络
        return fetch(e.request.url)
      })
    )
  })
  self.addEventListener('activate',function(e){
    e.waitUntil(
      //获取所有cache名称
      caches.keys().then(cacheNames => {
        return Promise.all(
          // 获取所有不同于当前版本名称cache下的内容
          cacheNames.filter(cacheNames => {
            return cacheNames !== cacheStorageKey
          }).map(cacheNames => {
            return caches.delete(cacheNames)
          })
        )
      }).then(() => {
        return self.clients.claim()
      })
    )
  })
