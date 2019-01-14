var spaCustomers = Vue.component("Customers", {
    template: `
	<div class="col-xs-12" id="customer-list">
		<div class="col-xs-12 table-controls">
			<button type="button" class="btn btn-primary pull-right" id="btnCreateCustomer">Create Customer</button>
		</div>
		<table class="table table-bordered">
			<colgroup>
				<col style="text-align: left"/>
				<col style="text-align: center; width: 10%;" />
			</colgroup>
			<thead><tr><th>Customer Name</th><th class="text-center">Active?</th></tr></thead>
			<tbody>
				<tr v-for="customer in customers" :key="customer.Id">
					<td>
						<router-link :to="{name: 'Customer', params: {id: customer.Id}}">{{customer.Name}}</router-link>
					</td>
					<td class="text-center">
						<span class="glyphicon" v-bind:class="[customer.IsVisible ? 'text-success glyphicon-ok' : 'text-danger glyphicon-remove']"></span>
					</td>
				</tr>
			</tbody>
		</table>
		
	</div>
    `,
    data: function () {
		return { 
			loading: this.loading,
			customers: []
		}
	},
	props: ["loading"],
    created() {
        this.getCustomers()
    },
    methods: {
		getCustomers() {
			this.loading = true;
			fetch(`https://api.woolston.com.au/crm/v2/customer/read.php`)
			.then(response => response.json())
			.then((response) => {
				this.customers = response.data;
			})
			.catch(error => console.log(error))
			.finally(() => {
				this.loading = false;
			})
		}
    },
    props: ["title"]
});