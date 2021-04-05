self.addEventListener("install", e => {
    e.waitUntil(
        caches.open("static")
            .then(cache => {
                return cache.addAll([
                    "./",

                    "./img/icons/wwd-icon-96.png",
                    "./img/icons/wwd-icon-144.png",
                    "./img/icons/wwd-icon-192.png",
                    "./img/icons/wwd-icon-256.png",
                    "./img/icons/wwd-icon-512.png",

                    "./css/fonts/glyphicons-halflings-regular.eot",
                    "./css/fonts/glyphicons-halflings-regular.svg",
                    "./css/fonts/glyphicons-halflings-regular.ttf",
                    "./css/fonts/glyphicons-halflings-regular.woff",
                    "./css/fonts/glyphicons-halflings-regular.woff2",

                    "./css/fonts/summernote.eot",
                    "./css/fonts/summernote.ttf",
                    "./css/fonts/summernote.woff",
                    "./css/fonts/summernote.woff2",

                    "./css/vendor/bootstrap.min.css",
                    "./css/vendor/summernote.min.css",
                    "./css/vendor/bootstrap-datetimepicker.min.css",
                    "./css/vendor/bootstrap-dialog.min.css",

                    "./css/vendor/toastr.css",
                    "./css/styles.css",

                    "./js/site.js",
                    "./js/vendor/vue.2.6.10.min.js",
                    "./js/vendor/httpVueLoader.min.js",
                    "./js/vendor/vue-router.min.js",
                    "./js/vendor/jquery-3.3.1.min.js",
                    "./js/vendor/bootstrap.min.js",
                    "./js/vendor/moment-with-locales.min.js",
                    "./js/vendor/bootstrap-datetimepicker.min.js",
                    "./js/vendor/bootstrap-dialog.min.js",
                    "./js/vendor/summernote.min.js",
                    "./js/vendor/toastr.min.js",

                    "./pages/components/toolbar.vue.js",
                    "./pages/components/breadcrumbs.vue.js",
                    "./pages/components/datepicker.vue.js",
                    "./pages/components/loading.vue.js",
                    "./pages/components/debug.vue.js",

                    "./pages/login.vue.js",
                    "./pages/home.vue.js",

                    "./pages/customers.vue.js",
                    "./pages/customer.vue.js",
                    "./pages/components/customer/customer-info.vue.js",
                    "./pages/components/customer/customer-invoices.vue.js",
                    "./pages/components/customer/customer-contacts.vue.js",
                    "./pages/components/customer/customer-notes.vue.js",
                
                    "./pages/invoice.vue.js",
                    "./pages/components/invoice/invoice-info.vue.js",
                    "./pages/components/invoice/invoice-items.vue.js",
                    "./pages/components/invoice/invoice-payments.vue.js",
                    "./pages/components/invoice/invoice-deliveries.vue.js",
                    "./pages/components/contact/contact-info.vue.js",
                    "./pages/components/notes/note-info.vue.js",
                ]);
            })
    )
});

 self.addEventListener("fetch", e => {
    //console.log(`Intercepting fetch request for: ${e.request.url}`);
    e.respondWith(
        caches.match(e.request)
            .then(response => {
                return response || fetch(e.request);
            })
    );
 });

 self.addEventListener('notificationclick', function(event) {
    let url = 'https://apps.woolston.com.au/crm';
    event.notification.close(); // Android needs explicit close.
    event.waitUntil(
        clients.matchAll({type: 'window'}).then( windowClients => {
            // Check if there is already a window/tab open with the target URL
            for (var i = 0; i < windowClients.length; i++) {
                var client = windowClients[i];
                // If so, just focus it.
                if (client.url === url && 'focus' in client) {
                    return client.focus();
                }
            }
            // If not, then open the target URL in a new window/tab.
            if (clients.openWindow) {
                return clients.openWindow(url);
            }
        })
    );
});