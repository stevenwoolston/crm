var spaInvoice = Vue.component("Invoice", {
template: `
	<div class="col-xs-12" id="invoice">
		
		<div style="margin: 10px 0">
			<div class="col-xs-12 table-controls">
				<div class="pull-left">
					<h4 class="text-success">Total Cost: {{ invoice.TotalCost | money }}</h4>
					<h4 class="text-danger">Total Payments: {{ invoice.TotalPayments | money }}</h4>
				</div>
				<button type="button" class="btn btn-primary pull-right" v-on:click="resetInvoice">Create Invoice</button>
			</div>
		</div>

		<InvoiceInfo :invoice="invoice" :customerId="customerId" @refresh-invoice="getInvoice"></InvoiceInfo>

		<div class="col-xs-12" style="padding: 20px 0;">
			<!-- Nav tabs -->
			<ul class="nav nav-tabs clearfix" role="tablist">
				<li role="presentation" class="active">
					<a href="#invoiceItems" aria-controls="invoiceItems" role="tab" data-toggle="tab">Invoice Items</a>
				</li>
				<li role="presentation">
					<a href="#invoicePayments" aria-controls="invoicePayments" role="tab" data-toggle="tab">Payments</a>
				</li>
				<li role="presentation">
					<a href="#deliveryHistory" aria-controls="deliveryHistory" role="tab" data-toggle="tab">Delivery History</a>
				</li>
				<li role="presentation">
					<a href="#debug" aria-controls="debug" role="tab" data-toggle="tab">Debug</a>
				</li>
			</ul>

			<div class="tab-content">
				<InvoiceItems :invoiceId="invoiceId" @refresh-invoice="getInvoice"></InvoiceItems>
				<InvoicePayments :invoiceId="invoiceId" @refresh-invoice="getInvoice"></InvoicePayments>
			</div>
		</div>

	</div>
`,
    data() {
        return {
			invoiceId: this.$route.params.id,
			customerId: this.$route.params.customerId,
			invoice: {}
        }
    },
    created() {
        if (this.invoiceId > 0) {
            this.getInvoice(this.invoiceId);
		} else {
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
        }
    },
    methods: {
		resetInvoice() {
			this.invoice = {
				CustomerId: this.customerId,
				InvoiceDate: moment().format("YYYY-MM-DD"),
				InvoiceDueDate: null,
				EmailSubject: null,
				DateSent: null,
				DatePaid: null,
				IsCanceled: false
			}
		},
        getInvoice() {
            fetch(`https://api.woolston.com.au/crm/v3/invoices/${this.invoiceId}`)
                .then(response => response.json())
                .then((response) => {
                    this.invoice = response.data[0];
                })
                .catch(error => console.log(error))
                .finally(() => {

				})
        }
    }
});