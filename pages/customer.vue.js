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
			<CustomerInfo></CustomerInfo>
			<CustomerInvoices></CustomerInvoices>
		</div>
	</div>
`,
    props: ["title", "loading"],
    data() {
        return {
            customerId: this.$route.params.id,
            customer: [],
        }
    },
    created() {
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
        getCustomer(id) {
            fetch(`https://api.woolston.com.au/crm/v3/customers/${id}`)
                .then(response => response.json())
                .then((response) => {
                    this.customer = response.data[0];
                })
                .catch((error) => console.log(error))
                .finally(() => {
                    // this.loading = false
                })
        },
        saveCustomer() {
            fetch(`https://api.woolston.com.au/crm/v3/customer/${this.customerId}`, {
                method: "POST",
                body: JSON.stringify(this.customer)
            })
                .then((data) => {
                    toastr.success("Save was successful.");
                })
                .catch(error => console.log(error))
                .finally(() => {
                    // this.loading = false
                })
        }
    }
});