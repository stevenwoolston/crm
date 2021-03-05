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
				<a class="navbar-brand" href="/crm">Woolston Web Design CRM</a>
			</div>
			<div id="navbar" class="navbar-collapse collapse">
				<ul class="nav navbar-nav">
					<li>
						<a href="/crm">
							<span class="glyphicon glyphicon-home"></span>
						</a>
					</li>
                    <li>
						<a href="/crm/customers">Customers</a>
					</li>
				</ul>
				<ul class="nav navbar-nav navbar-right">
					<li><a href="#" id="btnSignout">Sign Out</a></li>
				</ul>
			</div><!--/.nav-collapse -->
		</div><!--/.container-fluid -->
	</nav>
`,
    props: ['title']
})