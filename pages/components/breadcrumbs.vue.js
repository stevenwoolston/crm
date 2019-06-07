Vue.component('Breadcrumb', {
    template: `
	<ol class="breadcrumb">
		<li v-for="(crumb, index) in breadcrumb" :class="crumb.active">
			<span v-if="(index + 1) == breadcrumb.length">{{ crumb.LinkText }}</span>
			<router-link v-else :to="{ name: crumb.routeName, params: crumb.routeParams }">{{ crumb.LinkText }}</router-link>
		</li>
	</ol>
`,
	props: ['breadcrumb']
})