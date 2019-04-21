var spaCustomerContacts = Vue.component("CustomerContacts", {
    template: `
    <div role="tabpanel" class="tab-pane" id="contacts">

        <div style="margin: 10px 0">
            <div class="col-xs-12 table-controls">
                <button type="button" class="btn btn-primary pull-right" v-on:click="prepareContact()">Create Contact</button>
            </div>
        </div>
        
        <ContactInfo :customerId="customerId"></ContactInfo>

        <table class="table table-bordered">
            <colgroup>
                <col style="text-align: left"/>
                <col style="text-align: left; />
                <col style="text-align: center; max-width: 10%;" />
            </colgroup>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Email Address</th>
                    <th>&nbsp;</th>
                </tr>
            </thead>
            <tbody v-if="contacts.length > 0">
                <tr v-for="contact in contacts" :key="contact.Id">
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
`,
props: ["title", "loading", "customerId"],
data () {
    return {
        contactId: 0,
        contacts: [], contact: {},
    }
},
created() {
    this.contact = { CustomerId: this.customerId };
    this.getContacts()
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
    prepareContact() {
        this.contact = {
            CustomerId: customerId,
            FirstName: null,
            Surname: null,
            EmailAddress: null,
            IsVisible: true
        }
    },
    getContacts() {
        fetch(`https://api.woolston.com.au/crm/v3/customers/${this.customerId}/contacts`, {
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
    getSingleContact(id) {
        this.contact = this.contacts.filter((contact) => { return contact.Id == id })[0];
    },
    saveContact() {
        let url = `https://api.woolston.com.au/crm/v3/contact/${this.contact.Id}`;

        fetch(url, {
            method: "POST",
            body: JSON.stringify(this.contact)
        })
            .then((data) => {
                toastr.success("Save was successful.");
                this.contact = { CustomerId: this.customerId };
            })
            .catch(error => console.log(error))
            .finally(() => {
                this.getContacts(this.customer.Id);
            })
    },
    deleteContact(id) {
        fetch(`https://api.woolston.com.au/crm/v3/contact/${id}`, {
            method: "DELETE"
        })
            .then((data) => {
                toastr.success("Delete was successful.");
            })
            .catch(error => console.log(error))
            .finally(() => {
                this.getContacts(this.customer.Id);
            })
    }
}
});