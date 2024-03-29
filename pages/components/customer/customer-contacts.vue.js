var spaCustomerContacts = Vue.component("CustomerContacts", {
    template: `
    <div role="tabpanel" :class="tabName == 'contacts' ? 'active' : ''" class="tab-pane" id="contacts">

        <div style="margin: 10px 0">
            <div class="col-xs-12 table-controls">
                <button type="button" class="btn btn-primary pull-right" v-on:click="resetContact">Create Contact</button>
            </div>
        </div>

        <ContactInfo :customerId="customerId" :contact="selectedContact" @contact-saved="getContacts" @cancel="resetContact"></ContactInfo>

        <div class="table-responsive">
            <table class="table table-bordered">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email Address</th>
                        <th>&nbsp;</th>
                    </tr>
                </thead>
                <tbody v-if="contacts.length > 0">
                    <tr v-for="contact in contacts" 
                        :key="contact.Id" 
                        :class="{ highlighted: isSelectedContact(contact) }">
                        <td v-on:click="getSingleContact(contact.Id)"><a href="#">{{ contact.FirstName }} {{ contact.Surname }}</a></td>
                        <td>{{ contact.EmailAddress }}</td>
                        <td class="text-center">
                            <span class="glyphicon" v-bind:class="[contact.IsVisible ? 'text-success glyphicon-ok' : 'text-danger glyphicon-remove']"></span>
                            <span style="cursor: pointer" v-on:click="deleteContact(contact.Id)" class="glyphicon glyphicon-trash"></span>
                        </td>
                    </tr>
                </tbody>
                <tbody v-else>
                    <tr>
                        <td colspan="3" class="text-center">No matching records</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
`,
props: ["customerId", "tabName"],
data () {
    return {
        contacts: [], selectedContact: {},
        loading: true
    }
},
created() {
    if (this.customerId > 0) {
        this.getContacts();
        this.resetContact();
    }
},
computed: {
    contactId() {
        return this.selectedContactId ? this.selectedContactId.Id : 0
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
    isSelectedContact(contact) {
        return contact == this.selectedContact;
    },
    resetContact() {
        this.selectedContact = {
            CustomerId: this.customerId,
            FirstName: null,
            Surname: null,
            EmailAddress: null,
            IsVisible: true
        }
    },
    getContacts() {
        this.loading = true;
        fetch(`${config.url}customers/${this.customerId}/contacts`, {
            method: "GET"
        })
            .then(response => response.json())
            .then((response) => {
                this.contacts = response.data;
            })
            .catch(error => console.log(error))
            .finally(() => {
                this.loading = false;
            })
    },
    getSingleContact(id) {
        this.selectedContact = this.contacts.filter((contact) => { return contact.Id == id })[0];
    },
    deleteContact(id) {
        this.loading = true;
        fetch(`${config.url}contact/${id}`, {
            method: "DELETE"
        })
            .then((data) => {
                toastr.success("Delete was successful.");
            })
            .catch(error => console.log(error))
            .finally(() => {
                this.getContacts(this.customerId);
                this.resetContact();
            })
    }
}
});