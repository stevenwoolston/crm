var spaHome = Vue.component("Home", {
    template: `
<div class="col-xs-12" style="margin: 10px 0" id="invoice-list">
    
        <table class="table table-bordered">
        <colgroup>
            <col style="text-align: left; width: 25%;" />
            <col style="text-align: left;" />
            <col style="text-align: right; width: 15%;" />
            <col style="text-align: right; width: 15%;" />
            <col style="text-align: right; width: 15%;" />
        </colgroup>
        <thead>
            <tr>
                <th>Customer</th>
                <th>Description</th>
                <th>Inv Date</th>
                <th>Due Date</th>
                <th>Cost</th>
            </tr>
        </thead>
        <tbody v-if="invoices.length > 0">
            <tr v-for="invoice in invoices" :key="invoice.Id" :class="{ 'bg-danger': invoice.isOverDue }">
                <td>
                    <router-link :to="{ name: 'Customer', params: { id: invoice.CustomerId, tabName: 'invoices' }}">{{ invoice.CustomerName }}</router-link>
                </td>
                <td>
                    <router-link :to="{name: 'Invoice', params: {id: invoice.Id, customerId: invoice.CustomerId}}">{{ invoice.Id }} - {{ invoice.EmailSubject }}</router-link>
                </td>
                <td>{{ invoice.InvoiceDate | moment }}</td>
                <td>{{ invoice.InvoiceDueDate | moment }}</td>
                <td>{{ invoice.TotalCost | money }}</td>
            </tr>
        </tbody>
        <tbody v-else>
            <tr>
                <td colspan="5" class="text-center">No matching records</td>
            </tr>
        </tbody>
    </table>

        <Loading :loading="this.loading"></Loading>
        <Debug :debugData="this.debugData"></Debug>
</div>
    `,
    data() {
        return {
            loading: true,
            debugData: null,
            invoices: []
        }
    },
    created() {
        this.getInvoices()
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
        }
    },    
    methods: {
        getInvoices() {
            this.loading = true;
            fetch(`${config.url}reports/invoicesdue`)
                .then(response => response.json())
                .then((response) => {
                    this.invoices = response.data;
                    this.debugData = response;
                })
                .catch(error => console.log(error))
                .finally(() => {
                    this.loading = false;
                })
        }
    }
});