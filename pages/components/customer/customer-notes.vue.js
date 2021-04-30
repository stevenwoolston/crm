var spaCustomerNotes = Vue.component("CustomerNotes", {
    template: `
    <div role="tabpanel" :class="tabName == 'notes' ? 'active' : ''" class="tab-pane" id="notes">

        <NoteInfo :customerId="customerId" :note="selectedNote" @note-saved="getNotes" @cancel="resetNote"></NoteInfo>

        <div class="table-responsive">
            <table class="table table-bordered">
                <thead>
                    <tr>
                        <th class="col-narrow">Date</th>
                        <th>Description</th>
                        <th>Notes</th>
                        <th class="col-narrow col-center">Billable?</th>
                        <th class="col-narrow col-center">Time</th>
                        <th class="col-narrow col-center">&nbsp;</th>
                    </tr>
                </thead>
                <tbody v-if="notes.length > 0">
                    <tr v-for="note in notes" 
                        :key="note.Id" 
                        :class="{ highlighted: isSelectedNote(note) }">
                        <td>{{ note.CreatedDate | moment }}</td>
                        <td>{{ note.Description }}</td>
                        <td v-html="toHtml(note.Notes)"></td>
                        <td>{{ note.Billable | bool }}</td>
                        <td class="col-center">{{ note.TimeTaken | showTime }}</td>
                        <td class="col-center">
                            <span style="cursor: pointer" v-on:click="deleteNote(note.Id)" class="glyphicon glyphicon-trash"></span>
                        </td>
                    </tr>
                </tbody>
                <tbody v-else>
                    <tr>
                        <td colspan="6" class="text-center">No matching records</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
`,
    props: ["customerId", "tabName"],
    data () {
        return {
            notes: [], selectedNote: {},
            loading: true
        }
    },
    created() {
        this.getNotes();
        this.resetNote();
    },
    computed: {
        noteId() {
            return this.selectedNoteId ? this.selectedNoteId.Id : 0
        },
        totalTime: function() {
            var total = this.notes.reduce(function(prev, note) {
                return prev + note.TimeTaken;
            }, 0);

            return total > 60 ? `${parseFloat(total / 60)} hrs` : `${total} mins`;
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
        },
        showTime: function(value) {
            return value ? `${value} mins` : '';
        },
        bool: function(value) {
            return value == 0 ? "No" : 'Yes';
        }
    },
    methods: {
        toHtml: function(html) {
            let txt = document.createElement('textarea');
            txt.innerHTML = html;
            return txt.value;
        },
        isSelectedNote(note) {
            return note == this.selectedNote;
        },
        resetNote() {
            this.selectedNote = {
                CustomerId: this.customerId,
                CreatedDate: moment().format("YYYY-MM-DD"),
                Description: null,
                Notes: null,
                TimeTaken: null,
                Billable: false
            };
        },
        getNotes() {
            if (this.customerId == 0) {
                this.resetNote();
                return;
            }

            this.loading = true;
            fetch(`${config.url}customers/${this.customerId}/notes`, {
                method: "GET"
            })
                .then(response => response.json())
                .then((response) => {
                    this.notes = response.data;
                })
                .catch(error => console.log(error))
                .finally(() => {
                    this.loading = false;
                })
        },
        deleteNote(id) {
            this.loading = true;
            fetch(`${config.url}note/${id}`, {
                method: "DELETE"
            })
                .then((data) => {
                    toastr.success("Delete was successful.");
                })
                .catch(error => console.log(error))
                .finally(() => {
                    this.getNotes(this.customerId);
                    this.resetNote();
                })
        }
    }
});