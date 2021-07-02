var spaNoteInfo = Vue.component("NoteInfo", {
    template: `
    <div class="col-xs-12 form-container">
        <form class="form-horizontal" style="margin-bottom: 10px;" @submit.prevent="saveNote()">
            <div class="col-xs-12">
                <div class="form-group">
                    <label for="CreatedDate" class="col-sm-2 control-label">Date</label>
                    <div class="col-sm-4 col-md-3 col-lg-2">
                        <div class="input-group date">
                            <DatePicker v-model="note.CreatedDate"></DatePicker>
                            <span class="input-group-addon">
                                <span class="glyphicon glyphicon-calendar"></span>
                            </span>
                        </div>
                    </div>
                </div>
                <div class="form-group">
                    <label for="TimeTaken" class="col-sm-2 control-label">Time Taken (mins)</label>
                    <div class="col-sm-2">
                        <input type="number" class="form-control" name="TimeTaken" id="TimeTaken" v-model="note.TimeTaken">
                    </div>
                </div>
                <div class="form-group">
                    <label for="Description" class="col-sm-2 control-label">Description</label>
                    <div class="col-sm-10">
                        <input type="text" required class="form-control" name="Description" id="Description" v-model="note.Description">
                    </div>
                </div>
                <div class="form-group">
                    <label for="Billable" class="col-sm-2 control-label">Billable?</label>
                    <div class="col-sm-10">
                        <input type="checkbox" name="Billable" id="Billable" v-model="note.Billable">
                    </div>
                </div>
                <div class="form-group">
                    <label for="Notes" class="col-sm-2 control-label">Note</label>
                    <div class="col-sm-10">
                        <textarea rows="5" required class="form-control col-xs-12 richtext" name="Notes" id="Notes" v-model="note.Notes"></textarea>
                    </div>
                </div>
            </div>
            <div style="margin: 10px 0">
                <div class="col-xs-12 table-controls">
                    <button type="submit" class="btn btn-success btnSave pull-right">Save</button>
                    <button type="button" v-on:click="cancel" class="btn btn-default pull-right">Cancel</button>
                    <input type="hidden" id="Id" name="Id" v-model="note.Id" />
                    <input type="hidden" id="CustomerId" name="CustomerId" v-model="note.CustomerId" />
                </div>
            </div>

            <div id="customerInvoices" class="modal fade" tabindex="-1" role="dialog">
                <div class="modal-dialog modal-lg" role="document">
                    <div class="modal-content">
                        <form class="form-horizontal">
                            <div class="modal-header">
                                <button type="button" class="close" data-dismiss="modal"
                                    aria-label="Close"><span aria-hidden="true">&times;</span></button>
                                <h4 class="modal-title">Assign Invoice</h4>
                            </div>
                            <div class="modal-body" style="max-height: 75vh; overflow-y: scroll;">
                                <table class="table table-bordered">
                                    <colgroup>
                                        <col style="text-align: left; width: 20%;" />
                                        <col style="text-align: left;" />
                                        <col style="text-align: left; width: 15%;" />
                                        <col style="text-align: center; width: 15%;" />
                                    </colgroup>
                                    <thead>
                                        <tr>
                                            <th>Invoice Date</th>
                                            <th>Email Subject</th>
                                            <th>Total Cost</th>
                                            <th>Due Date</th>
                                            <th>&nbsp;</th>
                                        </tr>
                                    </thead>
                                    <tbody v-if="customerInvoices.length > 0">
                                        <tr v-for="customerInvoice in customerInvoices" :key="customerInvoice.Id">
                                            <td>{{ customerInvoice.InvoiceDate | moment }}</td>
                                            <td>{{ customerInvoice.EmailSubject }}</td>
                                            <td>{{ customerInvoice.TotalCost | money }}</td>
                                            <td>{{ customerInvoice.InvoiceDueDate | moment }}</td>
                                            <td class="text-center">
                                                <button type="button" class="btn btn-primary"
                                                    v-on:click="updateInvoiceNote(customerInvoice.Id);">Link</button>
                                            </td>
                                        </tr>
                                    </tbody>
                                    <tbody v-else>
                                        <tr>
                                            <td colspan="5" class="text-center">No matching records</td>
                                        </tr>
                                    </tbody>
                                </table>
                
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-default" 
                                    v-on:click="cancelUpdateInvoiceNote();" data-dismiss="modal">No Thanks</button>
                            </div>
                        </form>
                    </div><!-- /.modal-content -->
                </div><!-- /.modal-dialog -->
            </div><!-- /.modal -->

        </form>
    </div>
`,
    props: ["customerId", "note"],
    data() {
        return {
            customer: {},
            customerInvoices: [],
            loading: true
        }
    },
    created() {
        this.getCustomer(this.customerId);
        this.cancel();
        this.getCustomerInvoices();
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
        cancel: function () {
            this.$emit('cancel');
        },
        getCustomer(id) {
            this.loading = true;
            fetch(`${config.url}customers/${id}`)
                .then(response => response.json())
                .then((response) => {
                    this.customer = response.data[0];
                })
                .catch(error => console.log(error))
                .finally(() => {
                    $("textarea#Notes").summernote({ height: 300 });
                    this.loading = false
                })
        },
        getCustomerInvoices() {
            fetch(`${config.url}customers/${this.customerId}/invoices`, {
                method: "GET"
            })
            .then(response => response.json())
            .then((response) => {
                this.customerInvoices = response.data.filter(invoice => !invoice.DateSent);
            })
            .catch(error => {
                toastr.error('There was some problem getting the customer invoices. Check the console.');
                console.log(error);                
            })
            .finally(() => {
                this.loading = false
            })
        },
        saveNote() {
            this.loading = true;
            let url = `${config.url}note`,
                request_method = "POST";

            this.note.Notes = $("textarea#Notes + .note-editor .note-editable").html();
            this.note.Billable = $("#Billable").is(":checked");

            fetch(url, {
                method: request_method,
                body: JSON.stringify(this.note)
            })
                .then(response => response.json())
                .then((response) => {
                    if (this.note.Id == null) {
                        this.note.Id = response.data.Id;
                    }
                    toastr.success("Save was successful.");
                    $("textarea#Notes")
                        .val(null)
                        .summernote('destroy');

                    $("textarea#Notes").summernote({ height: 300 });
                    
                    if (this.customerInvoices.length > 0) {
                        $("#customerInvoices").modal('show');
                    }
                })
                .catch(error => {
                    toastr.error(error);
                    console.log(error);
                })
                .finally(() => {
                    this.loading = false;
                })
        },
        updateInvoiceNote(invoiceId) {
            this.loading = true;
            let url = `${config.url}note/${this.note.Id}`,
                request_method = "PUT";

            fetch(url, {
                method: request_method,
                body: JSON.stringify({
                    InvoiceId: invoiceId,
                    CustomerId: this.customerId
                })
            })
            .then(response => response.json())
            .then(response =>  {
                this.$emit("note-saved");
                this.cancel();
                $("#customerInvoices").modal('hide');
                toastr.success("Note linked to invoice.");
            })
            .catch(error => {
                toastr.error(error);
                console.log(error);
            })
        },
        cancelUpdateInvoiceNote() {
            this.$emit("note-saved");
            this.cancel();
        }
    }
});