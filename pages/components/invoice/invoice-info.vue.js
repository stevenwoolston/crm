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
                    <label for="InvoiceScheduledDeliveryDate" class="col-sm-2 control-label">Delivery Schedule Date</label>
                    <div class="col-sm-4 col-md-3 col-lg-2">
                        <div class="input-group date">
                            <DatePicker v-model="invoice.InvoiceScheduledDeliveryDate"></DatePicker>
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
                <button type="button" v-on:click="duplicate" class="btn btn-primary pull-right">Copy</button>
                <button type="button" :class="sendButtonClass" class="btn pull-left btn-primary"
                    :disabled="invoice.IsCanceled" data-toggle="modal" data-target="#selectContactForDelivery">Send This Invoice</button>
                <button type="button" :class="cancelButtonClass" class="btn pull-right" 
                    v-on:click="cancelInvoice(!invoice.IsCanceled)">{{ invoice.IsCanceled ? 'Activate' : 'Cancel' }} This Invoice</button>
                <button type="submit" class="btn btn-success btnSave pull-right">Save</button>
                <router-link class="btn btn-default pull-right" :to="{name: 'Customer', params: { id: this.customerId, tabName: 'invoices' }}">Cancel</router-link>
                <input type="hidden" id="Id" name="Id" v-model="invoice.Id" />
                <input type="hidden" id="DateSent" name="DateSent" v-model="invoice.DateSent" />
                <input type="hidden" id="CustomerId" name="CustomerId" v-model="invoice.CustomerId" value="{this.customerId}" />
            </div>
        </form>

        <div id="selectContactForDelivery" class="modal fade" tabindex="-1" role="dialog">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <form class="form-horizontal" @submit.prevent="sendInvoice">
                        <div class="modal-header">
                            <button type="button" class="close" data-dismiss="modal" 
                                aria-label="Close"><span aria-hidden="true">&times;</span></button>
                            <h4 class="modal-title">Select Contact For Invoice Delivery</h4>
                        </div>
                        <div class="modal-body">
                            <table class="table table-bordered">
                                <colgroup>
                                    <col style="text-align: left"/>
                                    <col style="text-align: left"/>
                                    <col style="text-align: center; width: 10%;" />
                                </colgroup>
                                <thead><tr><th>Contact Name</th><th>Contact Email</th><th class="text-center">&nbsp;</th></tr></thead>
                                <tbody v-if="this.contacts.length > 0">
                                    <tr v-for="contact in this.contacts" :key="contact.Id">
                                        <td>{{ contact.FirstName + " " + contact.Surname }}</td>
                                        <td>{{ contact.EmailAddress }}</td>
                                        <td class="text-center">
                                            <input type="checkbox" :value="contact.EmailAddress" 
                                                v-model="selectedEmailAddresses" />
                                        </td>
                                    </tr>
                                </tbody>
                                <tbody v-else>
                                    <tr>
                                        <td colspan="3" class="text-center">No matching records</td>
                                    </tr>
                                </tbody>
                            </table>
                            <div class="form-group">
                                <label for="deliveryComment" class="col-xs-2 control-label text-left">Comments</label>
                                <div class="col-xs-10">
                                    <textarea id="deliveryComment" class="col-xs-12 form-control" rows="3" v-model="deliveryComment"></textarea>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                            <button type="submit" class="btn btn-primary">Queue To Send</button>
                        </div>
                    </form>
                </div><!-- /.modal-content -->
            </div><!-- /.modal-dialog -->
        </div><!-- /.modal -->

    </div>
`,
    props: ["invoice", "customerId"],
    data() {
        return {
            loading: false,
            contacts: [],
            selectedEmailAddresses: [],
            deliveryComment: null,
            newInvoice: null
        }
    },
    created() {
        this.getContacts();
    },
    computed: {
        invoiceId() {
            return this.invoice.Id;
        },
        cancelButtonClass() {
            let classes;
            classes = !this.invoice.Id ? 'hidden' : '';
            classes += this.invoice.IsCanceled ? ' btn-primary' : ' btn-danger';
            return classes;
        },
        sendButtonClass() {
            let classes;
            classes = !this.invoice.Id ? 'hidden' : '';
            return classes;
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
        refreshInvoice(invoice) {
            this.$emit('refresh-invoice', invoice);
        },
        cancelInvoice(willBeCanceled) {
            this.invoice.IsCanceled = willBeCanceled;
            this.saveInvoice();
        },
        getContacts() {
            fetch(`${config.url}customers/${this.customerId}/contacts`, {
                method: "GET"
            })
                .then(response => response.json())
                .then((response) => {
                    this.contacts = response.data;
                })
                .catch(error => console.log(error))
                .finally(() => {
                })
        },
        sendInvoice() {
            this.loading = true;
            let url = `${config.url}delivery`,
                request_method = "POST",
                delivery = {
                    DateDelivered: null,
                    DeliveredTo: this.selectedEmailAddresses.toString(),
                    DeliveryComment: this.deliveryComment,
                    InvoiceId: this.invoice.Id
                };
            fetch(url, {
                method: request_method,
                body: JSON.stringify(delivery)
            })
                .then(response => response.json())
                .then((response) => {
                    if (response.data.Id == null) {
                        toastr.error("There was a problem queueing the invoice to be sent.");
                        throw response.message;
                    }
                    toastr.success("Invoice was successfully queued to send.");
                })
                .catch(error => console.log(error))
                .finally(() => {
                    this.selectedEmailAddresses = [];
                    this.deliveryComment = "";
                    $("#selectContactForDelivery").modal("hide");
                })
        },
        saveInvoice() {
            this.loading = true;
            let url = `${config.url}invoice/${this.invoiceId}`,
                request_method = "PUT";

            if (this.invoice.Id == null) {
                url = `${config.url}invoice`;
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
                    this.refreshInvoice(this.invoice);
                })
        },
        duplicate() {
            this.loading = true;
            this.newInvoice = this.invoice;
            this.newInvoice.InvoiceDate = moment().format("YYYY-MM-DD");
            this.newInvoice.InvoiceDueDate = moment().add(14, "day").format("YYYY-MM-DD");
            this.newInvoice.InvoiceScheduledDeliveryDate = null;
            this.newInvoice.DateSent = null;
            this.newInvoice.IsCanceled = 0;
            this.newInvoice.DatePaid = null;

            let url = `${config.url}invoice`;
            request_method = "POST";

            fetch(url, {
                method: request_method,
                body: JSON.stringify(this.newInvoice)
            })
                .then(response => response.json())
                .then((response) => {
                    this.newInvoice.Id = response.data.Id;
                    toastr.success(`Invoice copy was successful as #${this.newInvoice.Id}. Invoice refreshed.`);
                    router.push({ name: "Customer", params: { id: this.newInvoice.CustomerId } });
                })
                .catch(error => console.log(error))
        }
    }
});