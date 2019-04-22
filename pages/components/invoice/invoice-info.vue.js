var spaInvoiceInfo = Vue.component("InvoiceInfo", {
    template: `
    <div class="col-xs-12 form-container">
        <form class="form-horizontal" style="margin-bottom: 10px;" @submit.prevent="saveInvoice()">
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
                <button type="submit" class="btn btn-success btnSave pull-right">Save</button>
                <button type="button" class="btn btn-default pull-right">Cancel</button>
                <input type="hidden" id="Id" name="Id" v-model="invoice.Id" />
                <input type="hidden" id="CustomerId" name="CustomerId" v-model="invoice.CustomerId" value="{this.customerId}" />
            </div>
        </form>
    </div>
`,
    props: ["title", "loading", "customerId", "invoice"],
    data() {
        return {
            customer: {}
        }
    },
    created() {
        this.getCustomer(this.customerId)
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
        cancel: function() {
            this.$emit('cancel');
        },
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
        getInvoices() {
            fetch(`https://api.woolston.com.au/crm/v3/customers/${this.customerId}/invoices`, {
                method: "GET"
            })
                .then(response => response.json())
                .then((response) => {
                    this.contacts = response.data;
                })
                .catch(error => console.log(error))
                .finally(() => {
                    // this.loading = false
                })
        },
        getSingleInvoice(id) {
            this.invoice = this.invoices.filter((invoice) => { return invoice.Id == id })[0];
        },
        saveInvoice() {
            let url = `https://api.woolston.com.au/crm/v3/invoice/${this.invoice.Id}`;

            if (this.invoice.Id == null) {
                url = `https://api.woolston.com.au/crm/v3/invoice`;
            }

            fetch(url, {
                method: "POST",
                body: JSON.stringify(this.invoice)
            })
            .then(response => response.json())
            .then((response) => {
                this.invoice.Id = response.data.Id;
                toastr.success("Save was successful.");
            })
            .catch(error => console.log(error))
            .finally(() => {
                this.$emit("invoice-saved", this.invoice);
            })
        }
    }
});