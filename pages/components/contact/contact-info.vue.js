var spaContactInfo = Vue.component("ContactInfo", {
    template: `
    <div class="col-xs-12 form-container">
        <form class="form-horizontal" style="margin-bottom: 10px;" @submit.prevent="saveContact()">
            <div class="col-xs-12">
                <div class="form-group">
                    <label for="FirstName" class="col-sm-2 control-label">First Name</label>
                    <div class="col-sm-4">
                        <input type="text" required class="form-control" name="FirstName" id="FirstName" v-model="contact.FirstName">
                    </div>
                </div>
                <div class="form-group">
                    <label for="Surname" class="col-sm-2 control-label">Last Name</label>
                    <div class="col-sm-4">
                        <input type="text" required class="form-control" name="Surname" id="Surname" v-model="contact.Surname">
                    </div>
                </div>
                <div class="form-group">
                    <label for="EmailAddress" class="col-sm-2 control-label">Email Address</label>
                    <div class="col-sm-4">
                        <input type="text" required class="form-control" name="EmailAddress" id="EmailAddress" v-model="contact.EmailAddress">
                    </div>
                </div>
                <div class="form-group">
                    <label for="IsVisible" class="col-sm-2 control-label">Active?</label>
                    <div class="col-sm-4">
                        <label class="checkbox">
                            <input type="checkbox" name="IsVisible" id="IsActive" v-model="contact.IsVisible">
                            <span class="glyphicon"></span>
                        </label>
                    </div>
                </div>
            </div>
            <div style="margin: 10px 0">
                <div class="col-xs-12 table-controls">
                    <button type="submit" class="btn btn-success btnSave pull-right">Save</button>
                    <button type="button" v-on:click="cancel" class="btn btn-default pull-right">Cancel</button>
                    <input type="hidden" id="Id" name="Id" v-model="contact.Id" />
                    <input type="hidden" id="CustomerId" name="CustomerId" v-model="contact.CustomerId" />
                </div>
            </div>
        </form>
    </div>
`,
    props: ["customerId", "contact"],
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
        cancel: function() {
            this.$emit('cancel');
        },
        getCustomer(id) {
            this.loading = true;
            fetch(`http://localhost/api/v4/customers/${id}`)
                .then(response => response.json())
                .then((response) => {
                    this.customer = response.data[0];
                })
                .catch((error) => console.log(error))
                .finally(() => {
                    this.loading = false
                })
        },
        getContacts() {
            this.loading = true;
            fetch(`http://localhost/api/v4/customers/${this.customerId}/contacts`, {
                method: "GET"
            })
                .then(response => response.json())
                .then((response) => {
                    this.contacts = response.data;
                })
                .catch(error => console.log(error))
                .finally(() => {
                    this.loading = false
                })
        },
        getSingleContact(id) {
            this.contact = this.contacts.filter((contact) => { return contact.Id == id })[0];
        },
        saveContact() {
            this.loading = true;
            let url = `http://localhost/api/v4/contact/${this.contact.Id}`,
                request_method = "PUT";

            if (this.contact.Id == null) {
                url = `http://localhost/api/v4/contact`;
                request_method = "POST";
            }

            fetch(url, {
                method: request_method,
                body: JSON.stringify(this.contact)
            })
            .then(response => response.json())
            .then((response) => {
                if (this.contact.Id == null) {
                    this.contact.Id = response.data.Id;
                }
                toastr.success("Save was successful.");
            })
            .catch(error => console.log(error))
            .finally(() => {
                this.$emit("contact-saved", this.contact);
                this.loading = false;
            })
        }
    }
});