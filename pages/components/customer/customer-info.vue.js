var spaCustomerInfo = Vue.component("CustomerInfo", {
	template: `
	<div role="tabpanel" class="tab-pane" id="customer-details"
		:class="!tabName || tabName == '' || tabName == 'details' ? 'active' : ''">

		<div class="col-xs-12 form-container">
			<form class="form-horizontal" style="margin-bottom: 10px;" @submit.prevent="saveCustomer()">
				<div class="col-xs-12">
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
				</div>
				<div style="margin: 10px 0">
					<div class="col-xs-12 table-controls">
						<button type="button" v-show="this.customerId > 0" :class="!customer.IsVisible ? 'btn-primary' : 'btn-danger'" class="btn pull-right" 
							v-on:click="cancelCustomer(!customer.IsVisible)">{{ customer.IsVisible ? 'Cancel' : 'Activate' }} This Customer</button>
						<button type="submit" class="btn btn-success btnSave pull-right">Save</button>
						<router-link class="btn btn-default pull-right" :to="{name: 'Customers'}">Cancel</router-link>
						<input type="hidden" id="Id" name="Id" v-model="customer.Id" />
					</div>
				</div>
			</form>
		</div>
	</div>
`,
	props: ["tabName"],
    data() {
        return {
			customerId: this.$route.params.id,
			customer: {},
			loading: true
        }
    },
    created() {
        if (this.customerId > 0) {
            this.getCustomer(this.customerId);
        } else {
            this.resetCustomer();
        }
    },
    methods: {
        resetCustomer() {
            this.customer = {
                IsVisible: true,
                InvoicingText: "Invoicing is on 14 day terms."
			}
			this.loading = false;
		},
		cancelCustomer(willBeCanceled) {
			this.customer.IsVisible = willBeCanceled;
			this.saveCustomer();
		},
        getCustomer(id) {
			this.loading = true;
            fetch(`${config.url}customer/${id}`)
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
			let url = `${config.url}customer/${this.customer.Id}`,
				request_method = "PUT";

            if (this.customer.Id == null) {
				url = `${config.url}customer`;
				request_method = "POST";
            }

            fetch(url, {
                method: request_method,
                body: JSON.stringify(this.customer)
            })
            .then(response => response.json())
            .then((response) => {
                if (this.customer.Id == null) {
					this.customer.Id = response.data.Id;
					this.customerId = response.data.Id;
                }
                toastr.success("Save was successful.");
            })
            .catch(error => console.log(error))
            .finally(() => {
				this.loading = false;
                this.$emit("customer-saved", this.customer.Id);
            })
        }
    }
});