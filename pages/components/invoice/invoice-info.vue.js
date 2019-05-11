var spaInvoiceInfo = Vue.component("InvoiceInfo", {
    template: `
    <div class="col-xs-12 form-container">
        <form class="form-horizontal" style="margin-bottom: 10px;" @submit.prevent="saveInvoice()">
            <div class="col-xs-12">
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
            </div>
            <div class="col-xs-12 table-controls">
                <button type="button" class="btn pull-left btn-primary">Send This Invoice</button>
                <button type="button" :class="invoice.IsCanceled ? 'btn-primary' : 'btn-danger'" class="btn pull-right" 
                    v-on:click="cancelInvoice(!invoice.IsCanceled)">{{ invoice.IsCanceled ? 'Activate' : 'Cancel' }} This Invoice</button>
                <button type="submit" class="btn btn-success btnSave pull-right">Save</button>
                <router-link class="btn btn-default pull-right" :to="{name: 'Customer', params: { id: this.customerId, tabName: 'invoices' }}">Cancel</router-link>
                <input type="hidden" id="Id" name="Id" v-model="invoice.Id" />
                <input type="hidden" id="CustomerId" name="CustomerId" v-model="invoice.CustomerId" value="{this.customerId}" />
            </div>
        </form>
    </div>
`,
    props: ["invoice", "customerId"],
    data() {
        return {
            loading: false
        }
    },
    created() {
        
    },
    computed: {
        invoiceId() {
            return this.invoice.Id;
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
    methods: {
        refreshInvoice () {
            this.$emit('refresh-invoice', this.invoice);
        },
        cancelInvoice(willBeCanceled) {
            this.invoice.IsCanceled = willBeCanceled;
            this.saveInvoice();
        },
        saveInvoice() {
            this.loading = true;
            let url = `http://localhost/api/v4/invoice/${this.invoiceId}`,
                request_method = "PUT";

            if (this.invoice.Id == null) {
                url = `http://localhost/api/v4/invoice`;
                request_method = "POST";
            }

            fetch(url, {
                method: request_method,
                body: JSON.stringify(this.invoice)
            })
            .then(response => response.json())
            .then((response) => {
                if (this.invoice.Id == null) {
                    this.invoice.Id = response.data.Id;
                }
                toastr.success("Save was successful.");
            })
            .catch(error => console.log(error))
            .finally(() => {
                this.refreshInvoice();
            })
        }
    }
});