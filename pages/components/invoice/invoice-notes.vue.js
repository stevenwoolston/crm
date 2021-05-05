var spaInvoiceNotes = Vue.component("InvoiceNotes", {
    template: `
    <div role="tabpanel" class="tab-pane" id="invoiceNotes">

        <h2>
            Invoice Notes
            <button type="button" data-toggle="modal" data-target="#manageInvoiceNote" 
                class="pull-right btn btn-success">Assign Invoice Note</button>
        </h2>

        <div class="table-responsive">
            <table class="table table-bordered">
                <thead>
                    <tr>
                        <th>Date Created</th>
                        <th>Description</th>
                        <th>Time Taken</th>
                        <th>&nbsp;</th>
                    </tr>
                </thead>
                <tbody v-if="invoiceNotes.length > 0">
                    <tr v-for="invoiceNote in invoiceNotes" :key="invoiceNote.Id">
                        <td>{{ invoiceNote.CreatedDate | moment }}</td>
                        <td>{{ invoiceNote.Description }}</td>
                        <td>{{ invoiceNote.TimeTaken }} mins</td>
                        <td class="text-center">
                            <span style="cursor: pointer" 
                                v-on:click="deleteInvoiceNote(invoiceNote.Id)"
                                class="glyphicon glyphicon-trash"></span>
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
        
        <div id="manageInvoiceNote" class="modal fade" tabindex="-1" role="dialog">
            <div class="modal-dialog modal-lg" role="document">
                <div class="modal-content">
                    <form class="form-horizontal">
                        <div class="modal-header">
                            <button type="button" class="close" data-dismiss="modal"
                                aria-label="Close"><span aria-hidden="true">&times;</span></button>
                            <h4 class="modal-title">Assign Invoice Notes</h4>
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
                                        <th>Date Created</th>
                                        <th>Description</th>
                                        <th>Time Taken</th>
                                        <th>&nbsp;</th>
                                    </tr>
                                </thead>
                                <tbody v-if="availableInvoiceNotes.length > 0">
                                    <tr v-for="availableInvoiceNote in availableInvoiceNotes" :key="availableInvoiceNote.Id">
                                        <td>{{ availableInvoiceNote.CreatedDate | moment }}</td>
                                        <td>{{ availableInvoiceNote.Description }}</td>
                                        <td>{{ availableInvoiceNote.TimeTaken }} mins</td>
                                        <td class="text-center">
                                            <button type="button" class="btn btn-primary"
                                                v-on:click="updateInvoiceNote(availableInvoiceNote.Id);">Add</button>
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
                        <div class="modal-footer">
                            <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                        </div>
                    </form>
                </div><!-- /.modal-content -->
            </div><!-- /.modal-dialog -->
        </div><!-- /.modal -->

    </div>
`,
    props: ["invoiceId", "customerId"],
    data() {
        return {
            customerNotes: [], invoiceNotes: [], availableInvoiceNotes: [],
            invoiceNote: {},
            loading: false
        }
    },
    created() {
        this.getCustomerNotes();
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
        getCustomerNotes() {
            this.loading = true;
            fetch(`${config.url}customers/${this.customerId}/notes`)
                .then(response => response.json())
                .then((response) => {
                    this.customerNotes = response.data;
                })
                .then(() => {
                    this.invoiceNotes = this.customerNotes.filter((invoiceNote) => { return invoiceNote.InvoiceId == this.invoiceId });
                    this.availableInvoiceNotes = this.customerNotes.filter((invoiceNote) => { return invoiceNote.InvoiceId == null})        
                })
                .catch(error => console.log(error))
                .finally(() => {
                    this.loading = false;
                })
        },
        updateInvoiceNote(customerNoteId) {
            this.invoiceNote.InvoiceId = this.invoiceId;
            this.invoiceNote.CustomerId = this.customerId;
            this.saveInvoiceNote(customerNoteId)
                .then((response) => {
                    this.getCustomerNotes();
                })
                .then(() => {
                    toastr.success("Update was successful.");
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        deleteInvoiceNote(customerNoteId) {
            this.invoiceNote.InvoiceId = null;
            this.invoiceNote.CustomerId = this.customerId;
            this.saveInvoiceNote(customerNoteId)
                .then((response) => {
                    this.getCustomerNotes();
                })
                .then(() => {
                    toastr.success("Delete was successful.");
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        saveInvoiceNote(customerNoteId) {
            this.loading = true;
            let url = `${config.url}note/${customerNoteId}`,
                request_method = "PUT";

            return fetch(url, {
                method: request_method,
                body: JSON.stringify(this.invoiceNote)
            })
            .then(response => response.json())
            .catch(error => console.log(error))
        }
    }
});