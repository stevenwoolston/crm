var config = {
    url: 'https://api.woolston.com.au/crm/v2/'
    // url: 'http://localhost/crm/api/v2/'
}

$(function() {

    $("textarea.richtext").summernote({
        height: 300
    });

    $("#manageInvoiceItem").on('shown.bs.modal', function(){
        $(this).find('#Cost').select();
    });

    $("#manageInvoicePayment").on('shown.bs.modal', function(){
        $(this).find('#Amount').select();
    });

    $("#navbar ul a").on("click", function(e) {
        $("#navbar").removeClass("in");
    })
});

if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js?v2.14")
        .then(registration => {
            // toastr.success("Service worker registered");
            // toastr.success(registration);
        }).catch(error => {
            toastr.error("Service worker failed.");
            toastr.error("CRM: " + error);
        });
}

Notification.requestPermission(result => {
    if (result === 'granted') {
        // pollForCustomers();
    }
});

function pollForCustomers() {
    setInterval(
        function() {
            fetch(`${config.url}reports/invoicesdue`)
                .then(response => response.json())
                .then((response) => {
                    response.data.forEach(invoice => {
                        var notificationString = `${invoice.CustomerName} has invoice #${invoice.Id} due today.`;
                        showNotification("Invoices due.", notificationString);
                    })
                })
                .catch(error => console.log(error))
        }, 60000
    );
}

function showNotification(title, message) {
    if ('Notification' in window) {
        navigator.serviceWorker.ready.then(registration => {
            registration.showNotification(title, {
                body: message,
                tag: 'vibration-sample',
                renotify: true,
                requireInteraction: true,
                vibrate: [200, 100, 200],
                icon: '../crm/img/icons/wwd-icon-512.png'
            });
        });
    }
}