var spaCustomer = Vue.component("Customer", {
    template: `
    <div>
        <Breadcrumb :breadcrumb="this.breadcrumb"></Breadcrumb>
        <div class="col-xs-12" title="customer-information">
            <!-- Nav tabs -->
            <ul class="nav nav-tabs" role="tablist">
                <li role="presentation" :class="(this.tabName == 'details' || !this.tabName) ? 'active' : ''">
                    <a href="#customer-details" aria-controls="customer" role="tab" data-toggle="tab">Info</a>
                </li>
                <li role="presentation" v-show="this.customerId > 0" :class="this.tabName == 'invoices' ? 'active' : ''">
                    <a href="#invoices" aria-controls="invoices" role="tab" data-toggle="tab">Invoices</a>
                </li>
                <li role="presentation" v-show="this.customerId > 0" :class="this.tabName == 'contacts' ? 'active' : ''">
                    <a href="#contacts" aria-controls="contacts" role="tab" data-toggle="tab">Contacts</a>
                </li>
                <li role="presentation" v-show="this.customerId > 0" :class="this.tabName == 'notes' ? 'active' : ''">
                    <a href="#notes" aria-controls="notes" role="tab" data-toggle="tab">Notes</a>
                </li>
            </ul>

            <div class="tab-content">
                <CustomerInfo :tabName="tabName" :customerId="this.customerId" @customer-saved="refreshCustomer"></CustomerInfo>
                <CustomerInvoices v-show="this.customerId > 0" :tabName="tabName" :customerId="customerId"></CustomerInvoices>
                <CustomerContacts v-show="this.customerId > 0" :tabName="tabName" :customerId="customerId"></CustomerContacts>
                <CustomerNotes v-show="this.customerId > 0" :tabName="tabName" :customerId="customerId"></CustomerNotes>
            </div>

            <Loading :loading="this.loading"></Loading>
            <Debug :debugData="this.debugData"></Debug>
        </div>
    </div>
`,
    props: ["tabName"],
    data() {
        return {
            customerId: this.$route.params.id,
            customer: {},
            debugData: null,
            loading: true
        }
    },
    created() {
        if (this.customerId > 0) {
            this.customer.Id = this.customerId;
            this.getCustomer();
        } else {
            this.resetCustomer();
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
        },
        datePicker: function () {
            this.datetimepicker();
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
                    routeName: null,
                    routeParams: null,
                    LinkText: this.customer.Name
                }
            ]
        }
    },
    methods: {
        resetCustomer() {
            this.customer = {
                IsVisible: false,
                IsSupportCustomer: false,
                SupportEndDate: null,
                URL: null,
                InvoicingText: "Invoicing is on 14 day terms."
            }
            this.loading = false;
        },
        refreshCustomer(customerId) {
            // this.customer.Id = customerId;
            // this.customerId = customerId;
            // this.getCustomer();
            router.push({ path: '/customers/'} );
        },
        getCustomer() {
            if (this.customerId == 0 || this.customer.Id == 0) {
                this.resetNote();
                return;
            }

            this.loading = true;
            fetch(`${config.url}customers/${this.customer.Id}`)
                .then(response => response.json())
                .then((response) => {
                    this.customer = response.data[0];
                    this.debugData = response;
                })
                .catch(error => console.log(error))
                .finally(() => {
                    this.breadcrumb[1].name = this.customer.Name;
                    this.loading = false
                })
        },
        saveCustomer() {
            this.loading = true;
            if (this.customer.Id == null) {
                toastr.error("The customer cannot be saved.");
                this.loading = false
                return false;
            }
            fetch(`${config.url}customer/${this.customerId}`, {
                method: "PUT",
                body: JSON.stringify(this.customer)
            })
                .then((data) => {
                    toastr.success("Save was successful.");
                    this.debugData = data;
                })
                .catch(error => console.log(error))
                .finally(() => {
                    this.loading = false
                })
        }
    }
});