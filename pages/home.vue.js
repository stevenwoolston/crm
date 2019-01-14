var spahome = Vue.component("Home", {
    template: `
	<div id="customer-list">
		<div class="col-xs-12 table-controls">
			<button type="button" class="btn btn-primary pull-right" id="btnCreateCustomer">Create Customer</button>
		</div>
		<table class="table table-bordered">
			<colgroup>
				<col style="text-align: left"/>
				<col style="text-align: center; width: 180px;" />
			</colgroup>
			<thead><tr><th>Customer Name</th><th class="text-center">Active?</th></tr></thead>
			<tbody>
				<tr v-for="customer in customers" :key="customer.Id">
					<td>
						<router-link :to="{name: 'Customer', params: {id: customer.Id}}">{{customer.Name}}</router-link>
					</td>
					<td>{{ customer.IsVisible == -1 ? "Yes" : "No" }}</td>
				</tr>
			</tbody>
		</table>
		<hr />
		{{ customers }}
	</div>
    `,
    data: function () {
		return { 
			loading: false,
			customers: []
		}
    },
    created() {
        this.getCustomers()
    },
    methods: {
		getCustomers() {
			this.loading = true;
			fetch(`https://api.woolston.com.au/crm/v2/customer/read.php`)
			.then(response => response.json())
			.then((data) => {
				this.customers = data;
			})
			.catch(error => console.log(error))
			.finally(() => {
				this.loading = false;
			})
		}
    },
    props: ["title"]
});