var spaInvoice = Vue.component("Invoice", {
	template: `
<div>

	<Breadcrumb :breadcrumb="this.breadcrumb"></Breadcrumb>
	<div class="col-xs-12" id="invoice">
		
		<div v-show="this.invoice.Id > 0">
			<div class="col-xs-12 table-controls">
				<div>
					<h4 style="margin-left: 20px;" class="text-success pull-right">Total Cost: {{ invoice.TotalCost | money }}</h4>
					<h4 class="text-danger pull-right">Total Payments: {{ invoice.TotalPayments | money }}</h4>
				</div>
			</div>
		</div>

		<InvoiceInfo :invoice="invoice" :customerId="customerId" @refresh-invoice="getInvoice"></InvoiceInfo>

		<div v-show="this.invoice.Id > 0" class="col-xs-12" style="padding: 20px 0;">
			<!-- Nav tabs -->
			<ul class="nav nav-tabs clearfix" role="tablist">
				<li role="presentation" class="active">
					<a href="#invoiceItems" aria-controls="invoiceItems" role="tab" data-toggle="tab">Invoice Items</a>
				</li>
				<li role="presentation">
					<a href="#invoicePayments" aria-controls="invoicePayments" role="tab" data-toggle="tab">Payments</a>
				</li>
				<li role="presentation">
					<a href="#invoiceDeliveries" aria-controls="invoiceDeliveries" role="tab" data-toggle="tab">Delivery History</a>
				</li>
			</ul>

			<div class="tab-content">
				<InvoiceItems :invoiceId="invoiceId" @refresh-invoice="getInvoice"></InvoiceItems>
				<InvoicePayments :invoiceId="invoiceId" @refresh-invoice="getInvoice"></InvoicePayments>
				<InvoiceDeliveries :invoiceId="invoiceId" @refresh-invoice="getInvoice"></InvoiceDeliveries>
			</div>
		</div>

        <Loading :loading="this.loading"></Loading>
		<Debug :debugData="this.debugData"></Debug>
	</div>
</div>
`,
	data() {
		return {
			invoiceId: parseInt(this.$route.params.id),
			customerId: parseInt(this.$route.params.customerId),
			invoice: {},
			debugData: null,
			loading: false
		}
	},
	created() {
		if (this.invoiceId > 0) {
			this.invoice.Id = this.invoiceId;
            this.getInvoice();
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
	computed: {
		breadcrumb: function () {
			return [
				{
					routeName: "Customers",
					LinkText: "View All Customers"
				},
				{
					routeName: "Customer",
					routeParams: {
						id: this.customerId,
						tabName: 'invoices'
					},
					LinkText: this.invoice.CustomerName
				},
				{
					routeName: null,
					routeParams: null,
					LinkText: `Invoice #${this.invoice.Id}: ${this.invoice.EmailSubject}`
				}
			]
		}
	},
	methods: {
		resetInvoice() {
			this.invoice = {
				Id: null,
				CustomerId: this.customerId,
				InvoiceDate: moment().format("YYYY-MM-DD"),
				InvoiceDueDate: moment().add(14, "days").format("YYYY-MM-DD"),
				EmailSubject: null,
				DateSent: null,
				DatePaid: null,
				IsCanceled: false
			}
		},
		getInvoice() {
			this.loading = true;
			fetch(`${config.url}invoice/${this.invoice.Id}`)
				.then(response => response.json())
				.then((response) => {
					this.debugData = response;
					this.invoice = response.data[0];
					this.invoiceId = this.invoice.Id;
				})
				.catch(error => console.log(error))
				.finally(() => {
					this.loading = false;
				})
		}
	}
});