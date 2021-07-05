var spaCustomers = Vue.component("Customers", {
    template: `
    <div class="col-xs-12" id="customer-list">
    
        <div style="margin: 10px 0">
            <div class="col-xs-12 table-controls">
                <router-link class="btn btn-primary pull-right" :to="{name: 'Customer', params: { id: 0, tabName: 'details' }}">Create Customer</router-link>
            </div>
        </div>

        <div class="table-responsive">
        <table class="table table-bordered">
            <thead>
                <tr>
                    <th>Customer Name</th>
                    <th>Last Note</th>
                    <th style="width: 10%" class="text-center">Support Customer?</th>
                    <th style="width: 10%" class="text-center">Active?</th>
                </tr>
            </thead>
            <tbody v-if="customers.length > 0">
                <tr v-for="customer in customers" :key="customer.Id">
                    <td>
                        <router-link :to="{name: 'Customer', params: {id: customer.Id, tabName: 'invoices'}}">{{customer.Name}}</router-link>
                        <a style="margin-left: 20px;" class="text-primary"
                            :href="customer.URL" v-if="customer.URL"
                            target="_blank"><span class="glyphicon glyphicon-globe"></span>
                        </a>
                        <a style="margin-left: 10px;" class="text-primary"
                            :href="customer.URL + '/wp-admin'" v-if="customer.URL"
                            target="_blank"><span class="glyphicon glyphicon-cog"></span>
                        </a>                        
                    </td>
                    <td>
                        {{ customer.CreatedDate | moment }} <span v-bind:class="[customer.CreatedDate ? '' : 'hidden']">:</span> {{ customer.Description }}
                    </td>
                    <td class="text-center">
                        <span class="glyphicon" v-bind:class="[customer.IsSupportCustomer ? 'text-success glyphicon-ok' : 'text-danger glyphicon-remove']"></span>
                    </td>
                    <td class="text-center">
                        <span class="glyphicon" v-bind:class="[customer.IsVisible ? 'text-success glyphicon-ok' : 'text-danger glyphicon-remove']"></span>
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

        <Loading :loading="this.loading"></Loading>
        <Debug :debugData="this.debugData"></Debug>
	</div>
    `,
    data() {
        return {
            loading: true,
            debugData: null,
            customers: []
        }
    },
    created() {
        this.getCustomers()
    },
    filters: {
        moment: function (date) {
            if (moment(date).isValid()) {
                return moment(date).format("YYYY-MM-DD");
            }
            return null;
        }
    },
    methods: {
        getCustomers() {
            this.loading = true;
            fetch(`${config.url}customers`)
                .then(response => response.json())
                .then((response) => {
                    this.customers = response.data;
                    this.debugData = response;
                })
                .catch(error => console.log(error))
                .finally(() => {
                    this.loading = false;
                })
        }
    }
});