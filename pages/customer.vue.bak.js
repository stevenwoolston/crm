var spaCustomer = Vue.component("Customer", {
    template: `
	<div class="col-xs-12" id="customer">
		<!-- Nav tabs -->
		<ul class="nav nav-tabs" role="tablist">
			<li role="presentation" class="active">
				<a href="#customer" aria-controls="customer" role="tab" data-toggle="tab">Customer Information</a>
			</li>
			<li role="presentation">
				<a href="#invoices" aria-controls="invoices" role="tab" data-toggle="tab">Invoices</a>
			</li>
			<li role="presentation">
				<a href="#contacts" aria-controls="contacts" role="tab" data-toggle="tab">Contacts</a>
			</li>
			<li role="presentation">
				<a href="#debug" aria-controls="debug" role="tab" data-toggle="tab">Debug</a>
			</li>
		</ul>

		<div class="tab-content">
			<div role="tabpanel" class="tab-pane active" id="customer">
				<div class="col-xs-12 form-container">
					<form class="form-horizontal">
						<div class="form-group">
							<label for="Name" class="col-sm-2 control-label">Name</label>
							<div class="col-sm-10">
								<input type="text" required class="form-control" name="Name" id="Name" placeholder="Customer Name" v-model="customer.Name">
							</div>
						</div>
						<div class="form-group">
							<label for="Address" class="col-sm-2 control-label">Address</label>
							<div class="col-sm-10">
								<input type="text" required class="form-control" name="Address" id="Address" placeholder="Customer Address" v-model="customer.Address">
							</div>
						</div>
						<div class="form-group">
							<label for="Suburb" class="col-sm-2 control-label">Suburb</label>
							<div class="col-sm-10">
								<input type="text" required class="form-control" name="Suburb" id="Suburb" placeholder="Customer Suburb" v-model="customer.Suburb">
							</div>
						</div>
						<div class="form-group">
							<label for="Province" class="col-sm-2 control-label">State</label>
							<div class="col-sm-10">
								<input type="text" required class="form-control" name="State" id="State" placeholder="Customer State" v-model="customer.State">
							</div>
						</div>
						<div class="form-group">
							<label for="Postcode" class="col-sm-2 control-label">Postcode</label>
							<div class="col-sm-4">
								<input type="text" required class="form-control" name="Postcode" id="Postcode" placeholder="Customer Postcode" v-model="customer.Postcode">
							</div>
						</div>
						<div class="form-group">
							<label for="InvoicingTermsText" class="col-sm-2 control-label">Invoicing Terms Text</label>
							<div class="col-sm-4">
								<input type="text" class="form-control" name="InvoicingText" id="InvoicingText" placeholder="Customer Invoicing Terms" v-model="customer.InvoicingText">
							</div>
						</div>
						<div class="form-group">
							<label for="IsVisible" class="col-sm-2 control-label">Active?</label>
							<div class="col-sm-4">
								<label class="checkbox">
									<input type="checkbox" name="IsVisible" id="IsActive" v-model="customer.IsVisible">
									<span class="glyphicon"></span>
								</label>
							</div>
						</div>
						<div class="form-commands col-xs-12">
							<button type="button" v-on:click="saveCustomer()" class="btn btn-success btnSave pull-right">Save</button>
							<router-link class="btn btn-default pull-right" :to="{name: 'Customers'}">Cancel</router-link>
							<input type="hidden" id="Id" name="Id" v-model="customer.Id" />
						</div>
					</form>
				</div>
			</div>

			<div role="tabpanel" class="tab-pane" id="invoices">

				<div style="margin: 10px 0">
					<div class="col-xs-12 table-controls">
						<button class="btn btn-primary pull-right" v-on:click="mode.type='createInvoice'; prepareInvoice(); invoice.CustomerId = customerId">Create Invoice</button>
					</div>
				</div>

				<div class="col-xs-12 form-container">
					<form v-show="mode.type == 'createInvoice'" class="form-horizontal" style="margin-bottom: 10px;">
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
							<button type="button" class="btn btn-default pull-right" v-on:click="mode.type=null">Cancel</button>
							<input type="hidden" id="Id" name="Id" v-model="invoice.Id" />
							<input type="hidden" id="CustomerId" name="CustomerId" v-model="invoice.CustomerId" value="{this.customerId}" />
						</div>
					</form>
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

			<div role="tabpanel" class="tab-pane" id="contacts">
				<div style="margin: 10px 0">
					<div class="col-xs-12 table-controls">
						<button type="button" class="btn btn-primary pull-right" v-on:click="mode.type='createContact'; prepareContact()">Create Contact</button>
					</div>
					<form v-show="mode.type == 'editContact' || mode.type == 'createContact'" class="form-horizontal" style="margin-bottom: 10px;">
						<div class="form-group">
							<label for="FirstName" class="col-sm-2 control-label">First Name</label>
							<div class="col-sm-4">
								<input type="text" class="form-control" name="FirstName" id="FirstName" v-model="contact.FirstName">
							</div>
						</div>
						<div class="form-group">
							<label for="Surname" class="col-sm-2 control-label">Last Name</label>
							<div class="col-sm-4">
								<input type="text" class="form-control" name="Surname" id="Surname" v-model="contact.Surname">
							</div>
						</div>
						<div class="form-group">
							<label for="EmailAddress" class="col-sm-2 control-label">Email Address</label>
							<div class="col-sm-4">
								<input type="text" class="form-control" name="EmailAddress" id="EmailAddress" v-model="contact.EmailAddress">
							</div>
						</div>
						<div class="form-group">
							<label for="IsVisible" class="col-sm-2 control-label">Active?</label>
							<div class="col-sm-4">
								<label class="checkbox">
									<input type="checkbox" name="IsVisible" id="IsActive" v-model="contact.IsVisible">
									<span class="glyphicon"></span>
								</label>
							</div>
						</div>
						<div class="col-xs-12 table-controls">
							<button type="button" v-on:click="saveContact()" class="btn btn-success btnSave pull-right">Save</button>
							<button type="button" v-on:click="contact = { CustomerId: customerId };mode.type = null;" class="btn btn-default pull-right">Cancel</button>
							<input type="hidden" id="Id" name="Id" v-model="contact.Id" />
							<input type="hidden" id="CustomerId" name="CustomerId" v-model="contact.CustomerId" />
						</div>
					</form>
				</div>

				<table class="table table-bordered">
					<colgroup>
						<col style="text-align: left"/>
						<col style="text-align: left; />
						<col style="text-align: center; max-width: 10%;" />
					</colgroup>
					<thead>
						<tr>
							<th>Name</th>
							<th>Email Address</th>
							<th>&nbsp;</th>
						</tr>
					</thead>
					<tbody>
						<tr v-if="contacts.length > 0" v-for="contact in contacts" :key="contact.Id">
							<td v-on:click="getSingleContact(contact.Id)"><a href="#">{{ contact.FirstName }} {{ contact.Surname }}</a></td>
							<td>{{ contact.EmailAddress }}</td>
							<td class="text-center">
								<span class="glyphicon" v-bind:class="[contact.IsVisible ? 'text-success glyphicon-ok' : 'text-danger glyphicon-remove']"></span>
								<span style="cursor: pointer" v-on:click="deleteContact(contact.Id)" class="glyphicon glyphicon-trash"></span>
							</td>
						</tr>
						<tr v-else>
							<td colspan="3" class="text-center">No matching records</td>
						</tr>
					</tbody>
				</table>
			</div>

			<div role="tabpanel" class="tab-pane" id="debug">

				<div class="well col-xs-12"><h2>Customer</h2>{{ customer }}</div>
				<div class="well col-xs-12"><h2>Contacts</h2>{{ contacts }}</div>
				<div class="well col-xs-12"><h2>Single Contact</h2>{{ contact }}</div>
				<div class="well col-xs-12"><h2>Invoices</h2>{{ invoices }}</div>
				<div class="well col-xs-12"><h2>Single Invoice</h2>{{ invoice }}</div>
	
			</div>

		</div>
	</div>
`,
    props: ["title", "loading"],
    data: function () {
        return {
            customerId: this.$route.params.id,
            mode: {
                type: null
            },
            customer: [],
            contacts: [], contact: {},
            invoices: [], invoice: {}
        }
    },
    created() {
        this.loading = true;
        this.invoice = { CustomerId: this.customerId };
        this.getCustomer(this.$route.params.id);
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
        cancelEdit() {
            this.customerId = null;
            this.contact = null;
        },
        prepareInvoice() {
            this.invoice = {
                InvoiceDate: moment().format("YYYY-MM-DD"),
                InvoiceDueDate: moment().endOf("month").format("YYYY-MM-DD"),
                DatePaid: null,
                DateSent: null,
                EmailSubject: null,
                CustomerId: this.customerId,
                IsCanceled: false
            }
        },
        prepareContact() {
            this.contact = {
                CustomerId: customerId,
                FirstName: null,
                Surname: null,
                EmailAddress: null,
                IsVisible: true
            }
        },
        getCustomer(id) {
            fetch(`https://api.woolston.com.au/crm/v3/customers/${id}`)
                .then(response => response.json())
                .then((response) => {
                    this.customer = response.data[0];
                    this.getInvoices(id);
                })
                .catch((error) => console.log(error))
                .finally(() => {
                    this.loading = false
                })
        },
        getInvoices() {
            fetch(`https://api.woolston.com.au/crm/v3/customers/${this.customerId}/invoices`, {
                method: "GET"
            })
                .then(response => response.json())
                .then((response) => {
                    this.invoices = response.data;
                    this.getContacts(this.customerId);
                })
                .catch(error => console.log(error))
                .finally(() => {
                    this.loading = false
                })
        },
        getContacts() {
            fetch(`https://api.woolston.com.au/crm/v3/customers/${this.customerId}/contacts`, {
                method: "GET"
            })
                .then(response => response.json())
                .then((response) => {
                    this.contacts = response.data;
                })
                .catch(error => console.log(error))
                .finally(() => {
                    this.loading = false
                })
        },
        getSingleContact(id) {
            this.contact = this.contacts.filter((contact) => { return contact.Id == id })[0];
            this.mode.type = "editContact";
        },
        getSingleInvoice(id) {
            this.invoice = this.invoices.filter((invoice) => { return invoice.Id == id })[0];
            this.mode.type = "editInvoice";
        },
        saveCustomer() {
            this.loading = true;
            fetch(`https://api.woolston.com.au/crm/v3/customer/${this.customerId}`, {
                method: "POST",
                body: JSON.stringify(this.customer)
            })
                .then((data) => {
                    toastr.success("Save was successful.");
                })
                .catch(error => console.log(error))
                .finally(() => {
                    this.loading = false
                })
        },
        saveContact() {
            this.loading = true;
            let url = `https://api.woolston.com.au/crm/v3/contact/${this.contact.Id}`;

            if (this.contact.Id == null) {
                url = `https://api.woolston.com.au/crm/v3/contact`;
            }

            fetch(url, {
                method: "POST",
                body: JSON.stringify(this.contact)
            })
                .then((data) => {
                    toastr.success("Save was successful.");
                    this.contact = { CustomerId: this.customerId };
                })
                .catch(error => console.log(error))
                .finally(() => {
                    this.getContacts(this.customer.Id);
                    this.mode.type = null;
                    this.loading = false;
                })
        },
        saveInvoice() {
            this.loading = true;
            let url = `https://api.woolston.com.au/crm/v3/invoice/${this.invoice.Id}`;

            if (this.contact.Id == null) {
                url = `https://api.woolston.com.au/crm/v3/invoice`;
            }

            fetch(url, {
                method: "POST",
                body: JSON.stringify(this.invoice)
            })
                .then(response => response.text())
                .then((data) => {
                    toastr.success("Save was successful.");
                    var result = JSON.parse(data);
                    var id = parseInt(result.Id);
                    location.href = `#/invoice/${id}`;
                })
                .catch((error) => {
                    console.log(error);
                })
                .finally(() => {
                    this.getInvoices(this.customer.Id);
                    this.mode.type = null;
                    this.loading = false;
                })
        },
        deleteContact(id) {
            this.loading = true;
            fetch(`https://api.woolston.com.au/crm/v3/contact/${id}`, {
                method: "DELETE"
            })
                .then((data) => {
                    toastr.success("Delete was successful.");
                })
                .catch(error => console.log(error))
                .finally(() => {
                    this.getContacts(this.customer.Id);
                    this.loading = false
                })
        },
        deleteInvoice(id) {
            this.loading = true;
            fetch(`https://api.woolston.com.au/crm/v2/invoice/${id}`, {
                method: "DELETE"
            })
                .then((data) => {
                    toastr.success("Delete was successful.");
                })
                .catch(error => console.log(error))
                .finally(() => {
                    this.getInvoices(this.customer.Id);
                    this.loading = false
                })
        }
    }
});