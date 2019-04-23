var spaToolbar = Vue.component('Toolbar', {
    template: `
		<nav class="navbar navbar-default">
			<div class="container-fluid">
			<div class="navbar-header">
				<button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
					<span class="sr-only">Toggle navigation</span>
					<span class="icon-bar"></span>
					<span class="icon-bar"></span>
					<span class="icon-bar"></span>
				</button>
				<router-link class="navbar-brand" :to="{name: 'Customers'}">{{ this.title }}</router-link>
			</div>
			<div id="navbar" class="navbar-collapse collapse">
				<ul class="nav navbar-nav">
					<li>
						<router-link class="pull-right" :to="{name: 'Customers'}">
							<span class="glyphicon glyphicon-home"></span>
						</router-link>
					</li>
				</ul>
			</div><!--/.nav-collapse -->
			</div><!--/.container-fluid -->
		</nav>
`,
    props: ['title']
})