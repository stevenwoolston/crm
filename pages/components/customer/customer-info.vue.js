var spaCustomerInfo = Vue.component("CustomerInfo", {
	template: `
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
`,
    props: {
		customerId: {
			type: Number
		}
	},
    data() {
        return {
            customerId: this.$route.params.id,
            customer: []
        }
    },
    created() {
        this.loading = true;
        this.getCustomer(this.$route.params.id);
    },
    methods: {
        cancelEdit() {
            this.customerId = null;
            this.contact = null;
        },
        getCustomer(id) {
            fetch(`https://api.woolston.com.au/crm/v3/customers/${id}`)
                .then(response => response.json())
                .then((response) => {
                    this.customer = response.data[0];
                })
                .catch((error) => console.log(error))
                .finally(() => {
                    this.loading = false
                })
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
        }
    },
    props: ["title"]
});