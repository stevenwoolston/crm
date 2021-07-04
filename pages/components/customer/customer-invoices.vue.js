var spaCustomerInvoices = Vue.component("CustomerInvoices", {
    template: `
    <div role="tabpanel" :class="tabName == 'invoices' ? 'active' : ''" class="tab-pane" id="invoices">

        <div style="margin: 10px 0">
            <div class="col-xs-12 table-controls">
                <router-link class="btn btn-primary pull-right" :to="{name: 'Invoice', params: { customerId: this.customerId, id: 0 }}">Create Invoice</router-link>
            </div>
        </div>

        <div class="table-responsive">
            <table class="table table-bordered" id="customer-invoice-table">
                <thead>
                    <tr>
                        <th>Invoice Id</th>
                        <th>Invoice Date</th>
                        <th>Email Subject</th>
                        <th>Date Sent</th>
                        <th>Date Due</th>
                        <th>Total Cost</th>
                        <th>Total Payments</th>
                        <th>&nbsp;</th>
                    </tr>
                </thead>
                <tbody v-if="invoices.length > 0">
                    <tr v-for="invoice in invoices" :key="invoice.Id">
                        <td>{{ invoice.Id }}</td>
                        <td>{{ invoice.InvoiceDate | moment }}</td>
                        <td>
                            <router-link :to="{name: 'Invoice', params: {id: invoice.Id, customerId: customerId}}">{{ invoice.EmailSubject }}</router-link>
                        </td>
                        <td>{{ invoice.DateSent | moment }}</td>
                        <td>{{ invoice.InvoiceDueDate | moment }}</td>
                        <td>{{ invoice.TotalCost | money }}</td>
                        <td>{{ invoice.TotalPayments | money }}</td>
                        <td class="action-column two-actions">
                            <span class="glyphicon" title="Is this invoice active?" 
                                v-bind:class="[!invoice.IsCanceled ? 'text-success glyphicon-ok' : 'text-danger glyphicon-remove']"></span>
                            <span style="cursor: pointer" v-on:click="deleteInvoice(invoice.Id)" class="glyphicon glyphicon-trash"></span>
                        </td>
                    </tr>
                </tbody>
                <tbody v-else>
                    <tr>
                        <td colspan="8" class="text-center">No matching records</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
`,
props: ["customerId", "tabName"],
    data () {
        return {
            invoices: [], invoice: {},
            loading: true
        }
    },
    computed: {
        invoiceId() {
            return this.invoice ? this.invoice.Id : 0
        }
    },
    mounted() {
        if (this.customerId > 0) {
            this.getInvoices();
            this.resetInvoice();
        }
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
        resetInvoice() {
            this.invoice = {
                CustomerId: this.customerId,
                InvoiceDate: moment().format("YYYY-MM-DD"),
                InvoiceDueDate: moment().endOf("month").format("YYYY-MM-DD"),
                DatePaid: null,
                DateSent: null,
                EmailSubject: null,
                IsCanceled: false
            }
        },
        getInvoices() {
            this.loading = true;
            fetch(`${config.url}customers/${this.customerId}/invoices`, {
                method: "GET"
            })
            .then(response => response.json())
            .then((response) => {
                this.invoices = response.data;
            })
            .catch(error => console.log(error))
            .finally(() => {
                this.loading = false
            })
        },
        getSingleInvoice(id) {
            this.invoice = this.invoices.filter((invoice) => { return invoice.Id == id })[0];
        },
        deleteInvoice(id) {
            this.loading = true;
            fetch(`${config.url}invoice/${id}`, {
                method: "DELETE"
            })
                .then((data) => {
                    toastr.success("Delete was successful.");
                })
                .catch(error => console.log(error))
                .finally(() => {
                    this.getInvoices(this.customerId);
                })
        }
    }
});