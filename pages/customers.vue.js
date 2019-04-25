var spaCustomers = Vue.component("Customers", {
    template: `
    <div class="col-xs-12" id="customer-list">
    
        <div style="margin: 10px 0">
            <div class="col-xs-12 table-controls">
                <router-link class="btn btn-primary pull-right" :to="{name: 'Customer', params: { id: 0 }}">Create Customer</router-link>
            </div>
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
						<router-link :to="{name: 'Customer', params: {id: customer.Id, tabName: 'details'}}">{{customer.Name}}</router-link>
					</td>
					<td class="text-center">
						<span class="glyphicon" v-bind:class="[customer.IsVisible ? 'text-success glyphicon-ok' : 'text-danger glyphicon-remove']"></span>
					</td>
				</tr>
			</tbody>
		</table>
        
        <Loading :loading="this.loading"></Loading>
	</div>
    `,
    data () {
        return {
            loading: true,
            customers: []
        }
    },
    created() {
        this.getCustomers()
    },
    methods: {
        getCustomers() {
            this.loading = true;
            fetch(`https://api.woolston.com.au/crm/v3/customers`)
                .then(response => response.json())
                .then((response) => {
                    this.customers = response.data;
                })
                .catch(error => console.log(error))
                .finally(() => {
                    this.loading = false;
                })
        }
    }
});