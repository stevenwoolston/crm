var spaInvoiceItems = Vue.component("InvoiceItems", {
    template: `
    <div role="tabpanel" class="tab-pane active" id="invoiceItems">

        <h2>
            Invoice Items
            <button type="button" data-toggle="modal" v-on:click="this.resetInvoiceItem" data-target="#manageInvoiceItem" 
                class="pull-right btn btn-success">Create Invoice Item</button>
        </h2>

        <div class="table-responsive">
            <table class="table table-bordered">
                <thead>
                    <tr>
                        <th>Description</th>
                        <th>Cost</th>
                        <th>&nbsp;</th>
                    </tr>
                </thead>
                <tbody v-if="invoiceItems.length > 0">
                    <tr v-for="invoiceItem in invoiceItems" :key="invoiceItem.Id">
                        <td class="clickable" v-on:click="getSingleInvoiceItem(invoiceItem.Id);" 
                            data-toggle="modal" data-target="#manageInvoiceItem"
                            v-html="toHtml(invoiceItem.Description)">
                        </td>
                        <td>{{ invoiceItem.Cost | money }}</td>
                        <td class="text-center">
                            <span class="glyphicon glyphicon-pencil" data-toggle="modal" data-target="#manageInvoiceItem" 
                                v-on:click="getSingleInvoiceItem(invoiceItem.Id);"></span>
                            <span style="cursor: pointer" v-on:click="deleteInvoiceItem(invoiceItem.Id)" class="glyphicon glyphicon-trash"></span>
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
        
        <div id="manageInvoiceItem" class="modal fade" tabindex="-1" role="dialog">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <form class="form-horizontal" @submit.prevent="saveInvoiceItem">
                        <div class="modal-header">
                            <button type="button" class="close" data-dismiss="modal" v-on:click="resetInvoiceItem" 
                                aria-label="Close"><span aria-hidden="true">&times;</span></button>
                            <h4 class="modal-title">Manage Invoice Item</h4>
                        </div>
                        <div class="modal-body">
                            <div class="form-group">
                                <label for="Sequence" class="col-sm-2 control-label">Sequence</label>
                                <div class="col-sm-4">
                                    <input type="number" required class="form-control" name="Sequence" id="Sequence" 
                                        v-model="invoiceItem.Sequence">
                                </div>
                            </div>                            
                            <div class="form-group">
                                <label for="Cost" class="col-sm-2 control-label">Cost</label>
                                <div class="col-sm-4">
                                    <input type="number" min="0" step="any" required class="form-control" name="Cost" id="Cost" 
                                        v-model="invoiceItem.Cost">
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="Description" class="col-sm-2 control-label">Description</label>
                                <div class="col-sm-10">
                                    <textarea rows="8" required class="form-control col-xs-12 richtext" name="Description" id="Description" 
                                        v-model="invoiceItem.Description"></textarea>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-default" v-on:click="resetInvoiceItem" data-dismiss="modal">Close</button>
                            <button type="submit" class="btn btn-primary">Save</button>
                        </div>
                    </form>
                </div><!-- /.modal-content -->
            </div><!-- /.modal-dialog -->
        </div><!-- /.modal -->

    </div>
`,
    props: ["invoiceId"],
    data() {
        return {
            invoiceItems: [], invoiceItem: {},
            loading: false
        }
    },
    created() {
        if (this.invoiceId > 0) {
            this.getInvoiceItems();
        } else {
            this.resetInvoiceItem();    
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
        toHtml: function(html) {
            let txt = document.createElement('textarea');
            txt.innerHTML = html;
            return txt.value;
        },
        resetInvoiceItem() {
            this.invoiceItem = {
                Id: null,
                InvoiceId: this.invoiceId,
                Description: null,
                Cost: 0,
                Sequence: 0
            }
        },
        getInvoiceItems() {
            this.loading = true;
            fetch(`${config.url}invoices/${this.invoiceId}/invoiceitems`)
                .then(response => response.json())
                .then((response) => {
                    this.invoiceItems = response.data;
                    $("textarea#Description").summernote({ height: 300 });
                })
                .catch(error => console.log(error))
                .finally(() => {
                    this.loading = false;
                })
        },
        getSingleInvoiceItem(id) {
            this.invoiceItem = this.invoiceItems.filter((invoiceItem) => { return invoiceItem.Id == id })[0];
            $("textarea#Description").summernote({ height: 300 });
        },
        saveInvoiceItem() {
            this.loading = true;
            let url = `${config.url}invoiceitem/${this.invoiceItem.Id}`,
                request_method = "PUT";

            if (this.invoiceItem.Id == null) {
                url = `${config.url}invoiceitem`;
                request_method = "POST";
            }

            this.invoiceItem.Description = $("textarea#Description + .note-editor .note-editable").html();

            fetch(url, {
                method: request_method,
                body: JSON.stringify(this.invoiceItem)
            })
            .then(response => response.json())
            .then((response) => {
                if (this.invoiceItem.Id == null) {
                    this.invoiceItem.Id = response.data.Id;
                }
                toastr.success("Save was successful.");
                this.getInvoiceItems();
                this.resetInvoiceItem();
                this.$emit('refresh-invoice');
            })
            .catch(error => console.log(error))
            .finally(() => {
                $("textarea#Description")
                    .val(null)
                    .summernote('destroy');

                $("textarea#Description").summernote({ height: 300 });

                $("#manageInvoiceItem").modal("hide");
                this.loading = false;
            })
        },
        deleteInvoiceItem(id) {
            this.loading = true;
            fetch(`${config.url}invoiceitem/${id}`, {
                method: "DELETE"
            })
                .then((data) => {
                    toastr.success("Delete was successful.");
                })
                .catch(error => console.log(error))
                .finally(() => {
                    this.getInvoiceItems();
                    this.$emit('refresh-invoice');
                    this.loading = false;
                })
        }
    }
});