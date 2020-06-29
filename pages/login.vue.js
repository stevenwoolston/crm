var spaLogin = Vue.component("Login", {
	template: `
<div>
	<div id="login">

		<form class="col-xs-8 col-md-6 col-lg-3" @submit.prevent="login">
			<div v-show="this.error.alert" class="alert" :class="this.error.alert" role="alert">{{ this.error.message }}</div>
			<div class="form-group">
				<label for="exampleInputEmail1">Email address</label>
				<input type="email" class="form-control" v-model="emailAddress" placeholder="Email">
			</div>
			<div class="form-group">
				<label for="exampleInputPassword1">Password</label>
				<input type="password" class="form-control" v-model="password" placeholder="Password">
			</div>
			<button type="submit" class="btn btn-success btn-block">Submit</button>
		</form>	

	</div>

	<Loading :loading="this.loading"></Loading>
	<Debug :debugData="this.debugData"></Debug>

</div>
`,
	data() {
		return {
			emailAddress: null,
			password: null,
			user: {},
			error: {},
			debugData: null,
			loading: false
		}
	},
	methods: {
		login() {
            let url = `${config.url}auth/signin`,
                request_method = "POST",
                credentials = {
                    emailaddress: this.emailAddress,
                    password: this.password,
                };
            fetch(url, {
                method: request_method,
                body: JSON.stringify(credentials)
			})
				.then(response => {
					if (response.status != 200) {
						this.error = {
							alert: "alert-danger",
							message: "Bad Credentials. Try again."
						}
						return;
					}

					return response;
				})
				.then(response => response.json())
				.then((response) => {
					this.debugData = response;
					this.user = response.data[0];
					localStorage.setItem("user", JSON.stringify(this.user));
					this.error = {};
					location.href = "/crm";
				})
				.catch(error => {
					console.log(error)
				})
				.finally(() => {
					this.loading = false;
				})
		}
	}
});