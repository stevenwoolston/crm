var spaInvoicePayments = Vue.component("InvoicePayments", {
    template: `
    <div role="tabpanel" class="tab-pane" id="invoicePayments">

        <h2>
            Payments
            <button type="button" data-toggle="modal" v-on:click="this.resetInvoicePayment" data-target="#manageInvoicePayment" 
                class="pull-right btn btn-success">Create Payment</button>
        </h2>

        <table class="table table-bordered">
            <colgroup>
                <col style="text-align: left"/>
                <col style="text-align: right; width: 10%;"/>																								
                <col style="text-align: center; width: 10%;" />
            </colgroup>
            <thead>
                <tr>
                    <th>Date Paid</th>
                    <th>Amount</th>
                    <th>&nbsp;</th>
                </tr>
            </thead>
            <tbody v-if="invoicePayments.length > 0">
                <tr v-for="invoicePayment in invoicePayments" :key="invoicePayment.Id">
                    <td>{{ invoicePayment.DatePaid | moment }}</td>
                    <td>{{ invoicePayment.Amount | money }}</td>
                    <td class="text-center">
                        <span class="glyphicon glyphicon-pencil" data-toggle="modal" data-target="#manageInvoicePayment" 
                            v-on:click="getSingleInvoicePayment(invoicePayment.Id);"></span>
                        <span style="cursor: pointer" v-on:click="deleteInvoicePayment(invoicePayment.Id)" class="glyphicon glyphicon-trash"></span>
                    </td>
                </tr>
            </tbody>
            <tbody v-else>
                <tr>
                    <td colspan="3" class="text-center">No matching records</td>
                </tr>
            </tbody>
        </table>

        <div id="manageInvoicePayment" class="modal fade" tabindex="-1" role="dialog">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <form class="form-horizontal" @submit.prevent="saveInvoicePayment">
                        <div class="modal-header">
                            <button type="button" class="close" data-dismiss="modal" v-on:click="resetInvoicePayment" 
                                aria-label="Close"><span aria-hidden="true">&times;</span></button>
                            <h4 class="modal-title">Manage Payment</h4>
                        </div>
                        <div class="modal-body">
                            <div class="form-group">
                                <label for="DatePaid" class="col-sm-2 control-label">Date Paid</label>
                                <div class="col-sm-4">
                                    <div class="input-group date">
                                        <DatePicker v-model="invoicePayment.DatePaid"></DatePicker>
                                        <span class="input-group-addon">
                                            <span class="glyphicon glyphicon-calendar"></span>
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="Amount" class="col-sm-2 control-label">Amount</label>
                                <div class="col-sm-4">
                                    <input type="number" class="form-control" name="Amount" id="Amount" 
                                        v-model="invoicePayment.Amount">
                                </div>
                            </div>								
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-default" v-on:click="resetInvoicePayment" data-dismiss="modal">Close</button>
                            <button type="submit" class="btn btn-primary">Save</button>
                        </div>
                    </form>
                </div><!-- /.modal-content -->
            </div><!-- /.modal-dialog -->
        </div><!-- /.modal -->

    </div>
`,
    props: ["title", "loading", "invoiceId"],
    data() {
        return {
            invoicePayments: [], invoicePayment: {}
        }
    },
    created() {
        if (this.invoiceId > 0) {
            this.getInvoicePayments();
        } else {
            this.resetInvoicePayment();    
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
        resetInvoicePayment() {
            this.invoicePayment = {
                Id: null,
                InvoiceId: this.invoiceId,
                DatePaid: null,
                Amount: 0
            }
        },
        getInvoicePayments() {
            fetch(`https://api.woolston.com.au/crm/v3/invoices/${this.invoiceId}/payments`)
                .then(response => response.json())
                .then((response) => {
                    this.invoicePayments = response.data;
                })
                .catch(error => console.log(error))
                .finally(() => {

                })
        },
        getSingleInvoicePayment(id) {
            this.invoicePayment = this.invoicePayments.filter((invoicePayment) => { return invoicePayment.Id == id })[0];
        },
        saveInvoicePayment() {
            let url = `https://api.woolston.com.au/crm/v3/payment/${this.invoicePayment.Id}`;

            if (this.invoicePayment.Id == null) {
                url = `https://api.woolston.com.au/crm/v3/payment`;
            }

            fetch(url, {
                method: "POST",
                body: JSON.stringify(this.invoicePayment)
            })
                .then((data) => {
                    toastr.success("Save was successful.");
                    this.getInvoicePayments();
                    this.resetInvoicePayment();
                    this.$emit('refresh-invoice');
                })
                .catch(error => console.log(error))
                .finally(() => {
                    $("#manageInvoicePayment").modal("hide");
                })
        },
        deleteInvoicePayment(id) {
            fetch(`https://api.woolston.com.au/crm/v3/payment/${id}`, {
                method: "DELETE"
            })
                .then((data) => {
                    toastr.success("Delete was successful.");
                })
                .catch(error => console.log(error))
                .finally(() => {
                    this.getInvoicePayments();
                    this.$emit('refresh-invoice');
                })
        }
    }
});