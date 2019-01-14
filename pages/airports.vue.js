var spaAirports = Vue.component("Airports", {
    template: `
    <v-jumbotron color="grey lighten-2">
        <v-container fill-height>
            <v-layout align-center>
                <v-flex>
                    <h3 class="display-3">Airports</h3>
                </v-flex>
            </v-layout>
        </v-container>
    </v-jumbotron>
  `,
    props: ["title"],
    $_veeValidate: {
        validator: "new"
    }
});