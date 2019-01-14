var spaInvoice = Vue.component("Invoice", {
	template: `
	<div class="col-xs-12" id="invoice">
		<div class="col-xs-12 form-container">
			<form class="form-horizontal" style="margin-bottom: 10px;">
				<div class="form-group">
					<label for="InvoiceDate" class="col-sm-2 control-label">Invoice Date</label>
					<div class="col-sm-4 col-md-3 col-lg-2">
						<div class="input-group date">
							<DatePicker v-model="invoice.InvoiceDate"></DatePicker>
							<span class="input-group-addon">
								<span class="glyphicon glyphicon-calendar"></span>
							</span>
						</div>
					</div>
				</div>
				<div class="form-group">
					<label for="InvoiceDueDate" class="col-sm-2 control-label">Due Date</label>
					<div class="col-sm-4 col-md-3 col-lg-2">
						<div class="input-group date">
							<DatePicker v-model="invoice.InvoiceDueDate"></DatePicker>
							<span class="input-group-addon">
								<span class="glyphicon glyphicon-calendar"></span>
							</span>
						</div>
					</div>
				</div>
				<div class="form-group">
					<label for="EmailSubject" class="col-sm-2 control-label">Email Subject</label>
					<div class="col-sm-4">
						<input type="text" class="form-control" name="EmailSubject" id="EmailSubject" v-model="invoice.EmailSubject">
					</div>
				</div>
				<div class="form-group">
					<label for="DatePaid" class="col-sm-2 control-label">Date Paid</label>
					<div class="col-sm-4 col-md-3 col-lg-2">
						<div class="input-group date">
							<DatePicker v-model="invoice.DatePaid"></DatePicker>
							<span class="input-group-addon">
								<span class="glyphicon glyphicon-calendar"></span>
							</span>
						</div>
					</div>
				</div>
				<div class="form-group">
					<label for="DatePaid" class="col-sm-2 control-label">Total Amount Due</label>
					<div class="col-sm-4" style="margin-top: 6px">{{ invoice.TotalCost | money }}</div>
				</div>
				<div class="form-group">
					<label for="IsCanceled" class="col-sm-2 control-label">Canceled?</label>
					<div class="col-sm-4">
						<label class="checkbox">
							<input type="checkbox" name="IsCanceled" id="IsCanceled" v-model="invoice.IsCanceled">
							<span class="glyphicon"></span>
						</label>
					</div>
				</div>
				<div class="col-xs-12 table-controls">
					<button type="button" v-on:click="saveInvoice()" class="btn btn-success btnSave pull-right">Save</button>
					<router-link class="btn btn-default pull-right" :to="{name: 'Customer', params: {id: invoice.CustomerId}}">Cancel</router-link>
					<input type="hidden" id="Id" name="Id" v-model="invoice.Id" />
					<input type="hidden" id="CustomerId" name="CustomerId" v-model="invoice.CustomerId" />
				</div>
			</form>
		</div>

		<div class="col-xs-12" style="padding: 20px 0;">
			<!-- Nav tabs -->
			<ul class="nav nav-tabs clearfix" role="tablist">
				<li role="presentation" class="active">
					<a href="#invoiceItems" aria-controls="invoiceItems" role="tab" data-toggle="tab">Invoice Items</a>
				</li>
				<li role="presentation">
					<a href="#paymentItems" aria-controls="paymentItems" role="tab" data-toggle="tab">Payments</a>
				</li>
				<li role="presentation">
					<a href="#deliveryHistory" aria-controls="deliveryHistory" role="tab" data-toggle="tab">Delivery History</a>
				</li>
				<li role="presentation">
					<a href="#debug" aria-controls="debug" role="tab" data-toggle="tab">Debug</a>
				</li>
			</ul>

			<div class="tab-content">
				<div role="tabpanel" class="tab-pane active" id="invoiceItems">

					<h2>
						Invoice Items
						<button type="button" data-toggle="modal" data-target="#manageInvoiceItem" class="pull-right btn btn-success">Create Invoice Item</button>
					</h2>

					<table class="table table-bordered">
						<colgroup>
							<col style="text-align: left"/>
							<col style="text-align: right; width: 10%;"/>																								
							<col style="text-align: center; width: 10%;" />
						</colgroup>
						<thead>
							<tr>
								<th>Description</th>
								<th>Cost</th>
								<th>&nbsp;</th>
							</tr>
						</thead>
						<tbody v-if="invoiceItems.length > 0">
							<tr v-for="invoiceItem in invoiceItems" :key="invoiceItem.Id">
								<td>{{ invoiceItem.Description }}</td>
								<td>{{ invoiceItem.Cost | money }}</td>
								<td class="text-center">
									<span class="glyphicon glyphicon-pencil" data-toggle="modal" data-target="#manageInvoiceItem" 
										v-on:click="getSingleInvoiceItem(invoiceItem.Id);"></span>
									<span class="glyphicon" title="Is this invoice canceled?" v-bind:class="[!invoiceItem.isCanceled ? 'text-success glyphicon-ok' : 'text-danger glyphicon-remove']"></span>
									<span style="cursor: pointer" v-on:click="deleteInvoiceItem(invoiceItem.Id)" class="glyphicon glyphicon-trash"></span>
								</td>
							</tr>
						</tbody>
						<tbody v-else>
							<tr>
								<td colspan="4" class="text-center">No matching records</td>
							</tr>
						</tbody>
					</table>
				</div>

				<div role="tabpanel" class="tab-pane" id="paymentItems">

					<h2>
						Payments
						<button type="button" data-toggle="modal" data-target="#managePaymentItem" class="pull-right btn btn-success">Create Payment</button>
					</h2>

					<table class="table table-bordered">
						<colgroup>
							<col style="text-align: left"/>
							<col style="text-align: right; width: 10%;"/>																								
							<col style="text-align: center; width: 10%;" />
						</colgroup>
						<thead>
							<tr>
								<th>Date Paid</th>
								<th>Amount</th>
								<th>&nbsp;</th>
							</tr>
						</thead>
						<tbody v-if="paymentItems.length > 0">
							<tr v-for="payment in paymentItems" :key="payment.Id">
								<td>{{ payment.DatePaid | moment }}</td>
								<td>{{ payment.Amount | money }}</td>
								<td class="text-center">
									<span class="glyphicon glyphicon-pencil" data-toggle="modal" data-target="#managePaymentItem" 
										v-on:click="getSinglePaymentItem(payment.Id);"></span>
									<span style="cursor: pointer" v-on:click="deletePaymentItem(payment.Id)" class="glyphicon glyphicon-trash"></span>
								</td>
							</tr>
						</tbody>
						<tbody v-else>
							<tr>
								<td colspan="3" class="text-center">No matching records</td>
							</tr>
						</tbody>
					</table>
				</div>

				<div role="tabpanel" class="tab-pane" id="deliveryHistory">

					<h2>Delivery History</h2>

					<table class="table table-bordered">
						<colgroup>
							<col style="text-align: left"/>
							<col style="text-align: right; width: 50%;"/>																								
							<col style="text-align: center; width: 10%;" />
						</colgroup>
						<thead>
							<tr>
								<th>Date Delivered</th>
								<th>Recipient</th>
								<th>&nbsp;</th>
							</tr>
						</thead>
						<tbody v-if="deliveryItems.length > 0">
							<tr v-for="delivery in deliveryItems" :key="delivery.Id">
								<td>&nbsp;</td>
								<td>&nbsp;</td>
								<td>&nbsp;</td>
							</tr>
						</tbody>
						<tbody v-else>
							<tr>
								<td colspan="3" class="text-center">No matching records</td>
							</tr>
						</tbody>
					</table>
				</div>

				<div role="tabpanel" class="tab-pane" id="debug">
					<div class="well col-xs-12"><h2>Invoice</h2>{{ invoice }}</div>
					<div class="well col-xs-12"><h2>Invoice Items</h2>{{ invoiceItems }}</div>
					<div class="well col-xs-12"><h2>Payments</h2>{{ paymentItems }}</div>
					<div class="well col-xs-12"><h2>Single Payment</h2>{{ paymentItem }}</div>
				</div>
			</div>
		</div>

		<div id="manageInvoiceItem" class="modal fade" tabindex="-1" role="dialog">
			<div class="modal-dialog" role="document">
				<div class="modal-content">
					<div class="modal-header">
						<button type="button" class="close" data-dismiss="modal" v-on:click="this.invoiceItem = null" aria-label="Close"><span aria-hidden="true">&times;</span></button>
						<h4 class="modal-title">Manage Invoice Item</h4>
					</div>
					<div class="modal-body">
						<form class="form-horizontal">
							<div class="form-group">
								<label for="Description" class="col-sm-2 control-label">Description</label>
								<div class="col-sm-10">
									<input type="text" class="form-control" name="Description" id="Description" 
										v-model="invoiceItem.Description">
								</div>
							</div>
							<div class="form-group">
								<label for="Cost" class="col-sm-2 control-label">Cost</label>
								<div class="col-sm-4">
									<input type="number" class="form-control" name="Cost" id="Cost" 
										v-model="invoiceItem.Cost">
								</div>
							</div>								
						</form>
					</div>
					<div class="modal-footer">
						<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
						<button type="button" class="btn btn-primary" v-on:click="saveInvoiceItem()" data-dismiss="modal">Save</button>
					</div>
				</div><!-- /.modal-content -->
			</div><!-- /.modal-dialog -->
		</div><!-- /.modal -->

		<div id="managePaymentItem" class="modal fade" tabindex="-1" role="dialog">
			<div class="modal-dialog" role="document">
				<div class="modal-content">
					<div class="modal-header">
						<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
						<h4 class="modal-title">Manage Payment</h4>
					</div>
					<div class="modal-body">
						<form class="form-horizontal">
							<div class="form-group">
								<label for="DatePaid" class="col-sm-2 control-label">Date Paid</label>
								<div class="col-sm-4">
									<div class="input-group date">
										<DatePicker v-model="paymentItem.DatePaid"></DatePicker>
										<span class="input-group-addon">
											<span class="glyphicon glyphicon-calendar"></span>
										</span>
									</div>
								</div>
							</div>
							<div class="form-group">
								<label for="Amount" class="col-sm-2 control-label">Amount</label>
								<div class="col-sm-4">
									<input type="number" class="form-control" name="Amount" id="Amount" 
										v-model="paymentItem.Amount">
								</div>
							</div>								
						</form>
						{{ paymentItem }}
					</div>
					<div class="modal-footer">
						<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
						<button type="button" class="btn btn-primary" v-on:click="savePaymentItem()" data-dismiss="modal">Save</button>
					</div>
				</div><!-- /.modal-content -->
			</div><!-- /.modal-dialog -->
		</div><!-- /.modal -->
	</div>
`,
    data: function () {
		return { 
			invoiceId: this.$route.params.id,
			customerId: null,
			loading: true,
			mode: {
				type: "create"
			},
			invoice: {}, invoiceItem: {}, paymentItem: {},
			invoiceItems: [], paymentItems: [], deliveryItems: []
		}
    },
    created() {
		if (this.$route.params.id > 0) {
			this.getInvoice(this.$route.params.id);
		}
	},
	filters: {
		moment: function(date) {
			if (moment(date).isValid()) {
				return moment(date).format("YYYY-MM-DD");
			}
			return null;
		},
		money: function(value) {
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
		cancelEdit() {
			this.invoiceId = null;
			this.invoiceItem = null;
		},
		getInvoice(id) {
			fetch(`https://api.woolston.com.au/crm/v2/invoice/read.php?id=${id}`)
			.then(response => response.json())
			.then((response) => {
				this.invoice = response.data[0];
				this.customerId = this.invoice.CustomerId;
				this.getInvoiceItems(id);
				this.getPaymentItems(id);
			})
			.then((response) => {
				this.invoiceItem = {
					InvoiceId: this.$route.params.id,
					Sequence: 0,
					Description: this.invoice.EmailSubject
				};

				this.paymentItem = {
					InvoiceId: this.$route.params.id,
					DatePaid: moment().format("YYYY-MM-DD"),
					Amount: this.invoice.TotalCost
				}				
			})
			.catch(error => console.log(error))
			.finally(() => {
				this.loading = false
			})
		},
		getInvoiceItems() {
			fetch(`https://api.woolston.com.au/crm/v2/invoiceitem/read.php`, {
				method: "POST",
				body: JSON.stringify({ InvoiceId: this.invoiceId })
			})
			.then(response => response.json())
			.then((response) => {
				this.invoiceItems = response.data;
			})
			.catch(error => console.log(error))
			.finally(() => {
				this.loading = false
			})
		},
		getPaymentItems() {
			fetch(`https://api.woolston.com.au/crm/v2/payment/read.php`, {
				method: "POST",
				body: JSON.stringify({ InvoiceId: this.invoiceId })
			})
			.then(response => response.json())
			.then((response) => {
				this.paymentItems = response.data;
			})
			.catch(error => console.log(error))
			.finally(() => {
				this.loading = false
			})
		},		
		getSingleInvoiceItem(id) {
			this.invoiceItem = this.invoiceItems.filter((invoiceItem) => { return invoiceItem.Id == id})[0];
		},		
		getSinglePaymentItem(id) {
			this.paymentItem = this.paymentItems.filter((paymentItem) => { return paymentItem.Id == id})[0];
		},
		saveInvoice() {
			this.loading = true;
			this.invoice.InvoiceDate = moment(this.invoice.InvoiceDate).format("YYYY-MM-DD");
			fetch(`https://api.woolston.com.au/crm/v2/invoice/update.php`, {
				method: "POST",
				body: JSON.stringify(this.invoice)
			})
			.then((data) => {
				toastr.success("Save was successful.");
			})
			.catch(error => console.log(error))
			.finally(() => {
				this.loading = false
			})
		},
		saveInvoiceItem() {
			this.loading = true;
			let url = `https://api.woolston.com.au/crm/v2/invoiceitem/update.php`;

			if (this.invoiceItem.Id == null) {
				url = `https://api.woolston.com.au/crm/v2/invoiceitem/create.php`;
			}

			fetch(url, {
				method: "POST",
				body: JSON.stringify(this.invoiceItem)
			})
			.then((data) => {
				toastr.success("Save was successful.");
				this.invoiceItem = { InvoiceId: this.invoiceId, DatePaid: moment()};
			})
			.catch(error => console.log(error))
			.finally(() => {
				this.getInvoice(this.invoice.Id);
				this.loading = false;
			})
		},
		savePaymentItem() {
			this.loading = true;
			let url = `https://api.woolston.com.au/crm/v2/payment/update.php`;

			if (this.paymentItem.Id == null) {
				url = `https://api.woolston.com.au/crm/v2/payment/create.php`;
			}

			fetch(url, {
				method: "POST",
				body: JSON.stringify(this.paymentItem)
			})
			.then((data) => {
				toastr.success("Save was successful.");
				this.paymentItem = { 
					InvoiceId: this.invoiceId,
					DatePaid: moment().format("YYYY-MM-DD"),
					Amount: 0
				};
			})
			.catch(error => console.log(error))
			.finally(() => {
				this.getPaymentItems(this.invoiceId);
			})
		},
		deleteInvoiceItem(id) {
			this.loading = true;
			fetch(`https://api.woolston.com.au/crm/v2/invoiceitem/delete.php`, {
				method: "DELETE",
				body: JSON.stringify({ Id: id})
			})
			.then((data) => {
				toastr.success("Delete was successful.");
			})
			.catch(error => console.log(error))
			.finally(() => {
				this.getInvoice(this.invoice.Id);
				this.getInvoiceItems(this.invoice.Id);
				this.loading = false
			})
		},
		deletePaymentItem(id) {
			this.loading = true;
			fetch(`https://api.woolston.com.au/crm/v2/payment/delete.php`, {
				method: "DELETE",
				body: JSON.stringify({ Id: id})
			})
			.then((data) => {
				toastr.success("Delete was successful.");
			})
			.catch(error => console.log(error))
			.finally(() => {
				this.getPaymentItems(this.invoice.Id);
				this.loading = false
			})
		}
	},
    props: ["title"]
});