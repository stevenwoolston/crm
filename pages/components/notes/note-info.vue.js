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
                    <label for="Notes" class="col-sm-2 control-label">Note</label>
                    <div class="col-sm-10">
                        <textarea rows="5" required class="form-control col-xs-12" name="Notes" id="Notes" v-model="note.Notes"></textarea>
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
            </div>
        </form>
    </div>
`,
    props: ["customerId", "note"],
    data() {
        return {
            customer: {},
            loading: true
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
                    this.loading = false
                })
        },
        saveNote() {
            this.loading = true;
            let url = `${config.url}note`,
                request_method = "POST";

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
                })
                .catch(error => console.log(error))
                .finally(() => {
                    this.$emit("note-saved", this.note);
                    this.loading = false;
                })
        }
    }
});