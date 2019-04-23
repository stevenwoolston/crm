var spaCustomerInvoices = Vue.component("CustomerInvoices", {
    template: `
    <div role="tabpanel" class="tab-pane" id="invoices">

        <div style="margin: 10px 0">
            <div class="col-xs-12 table-controls">
                <router-link class="btn btn-primary pull-right" :to="{name: 'Invoice', params: { customerId: this.customerId }}">Create Invoice</router-link>
            </div>
        </div>

        <table class="table table-bordered">
            <colgroup>
                <col style="text-align: left"/>
                <col style="text-align: left; width: 40%;"/>
                <col style="text-align: left"/>
                <col style="text-align: left"/>
                <col style="text-align: left"/>																								
                <col style="text-align: center; width: 10%;" />
            </colgroup>
            <thead>
                <tr>
                    <th>Invoice Date</th>
                    <th style="width: 50%">Email Subject</th>
                    <th>Date Sent</th>
                    <th>Date Due</th>
                    <th>Total Cost</th>
                    <th>Total Payments</th>
                    <th>&nbsp;</th>
                </tr>
            </thead>
            <tbody v-if="invoices.length > 0">
                <tr v-for="invoice in invoices" :key="invoice.Id">
                    <td>{{ invoice.InvoiceDate | moment }}</td>
                    <td>
                        <router-link :to="{name: 'Invoice', params: {id: invoice.Id}}">{{ invoice.EmailSubject }}</router-link>
                    </td>
                    <td>{{ invoice.DateSent | moment }}</td>
                    <td>{{ invoice.InvoiceDueDate | moment }}</td>
                    <td>{{ invoice.TotalCost | money }}</td>
                    <td>{{ invoice.TotalPayments | money }}</td>
                    <td class="text-center">
                        <span class="glyphicon" title="Is this invoice canceled?" v-bind:class="[invoice.IsCanceled ? 'text-success glyphicon-ok' : 'text-danger glyphicon-remove']"></span>
                        <span style="cursor: pointer" v-on:click="deleteInvoice(invoice.Id)" class="glyphicon glyphicon-trash"></span>
                    </td>
                </tr>
            </tbody>
            <tbody v-else>
                <tr>
                    <td colspan="7" class="text-center">No matching records</td>
                </tr>
            </tbody>
        </table>
    </div>
`,
props: ["title", "loading", "customerId"],
    data () {
        return {
            invoices: [], invoice: {}
        }
    },
    computed: {
        invoiceId() {
            return this.invoice ? this.invoice.Id : 0
        }
    },
    mounted() {
        this.getInvoices();
        this.resetInvoice();
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
            fetch(`https://api.woolston.com.au/crm/v3/customers/${this.customerId}/invoices`, {
                method: "GET"
            })
            .then(response => response.json())
            .then((response) => {
                this.invoices = response.data;
            })
            .catch(error => console.log(error))
            .finally(() => {
                // this.loading = false
            })
        },
        getSingleInvoice(id) {
            this.invoice = this.invoices.filter((invoice) => { return invoice.Id == id })[0];
        },
        deleteInvoice(id) {
            fetch(`https://api.woolston.com.au/crm/v3/invoice/${id}`, {
                method: "DELETE"
            })
                .then((data) => {
                    toastr.success("Delete was successful.");
                })
                .catch(error => console.log(error))
                .finally(() => {
                    this.getInvoices(this.customer.Id);
                })
        }
    }
});