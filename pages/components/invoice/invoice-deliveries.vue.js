var spaInvoiceDeliveries = Vue.component("InvoiceDeliveries", {
    template: `
    <div role="tabpanel" class="tab-pane" id="invoiceDeliveries">
        <h2>Deliveries</h2>
        <div class="table-responsive">
            <table class="table table-bordered">
                <thead>
                    <tr>
                        <th>Date Delivered</th>
                        <th>Delivered To</th>
                        <th>Comments</th>
                    </tr>
                </thead>
                <tbody v-if="invoiceDeliveries.length > 0">
                    <tr v-for="invoiceDelivery in invoiceDeliveries" :key="invoiceDelivery.Id">
                        <td>{{ invoiceDelivery.DateDelivered | moment }}</td>
                        <td>{{ invoiceDelivery.DeliveredTo }}</td>
                        <td>{{ invoiceDelivery.DeliveryComment }}</td>
                    </tr>
                </tbody>
                <tbody v-else>
                    <tr>
                        <td colspan="2" class="text-center">No matching records</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
`,
    props: ["invoiceId"],
    data() {
        return {
            invoiceDeliveries: [],
            loading: false
        }
    },
    created() {
        this.getInvoiceDeliveries();
    },
    filters: {
        moment: function (date) {
            if (moment(date).isValid()) {
                return moment(date).format("YYYY-MM-DD");
            }
            return null;
        },
        money: function (value) {
            var moneyValue = parseInt(value);
            if (typeof moneyValue !== "number") {
                return value;
            }
            var formatter = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 0
            });
            return formatter.format(value);
        },
        datePicker: function () {
            this.datetimepicker();
        }
    },
    methods: {
        getInvoiceDeliveries() {
            if (this.invoiceId == 0) {
                this.invoiceDeliveries = [];
                return;
            }
            
            this.loading = true;
            fetch(`${config.url}invoices/${this.invoiceId}/deliveries`)
                .then(response => response.json())
                .then((response) => {
                    this.invoiceDeliveries = response.data;
                })
                .catch(error => console.log(error))
                .finally(() => {
                    this.loading = false;
                })
        }
    }
});