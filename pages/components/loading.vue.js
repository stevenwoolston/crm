Vue.component('Loading', {
    template: `
	<div v-show="this.loading" class="loader">
		<svg viewBox="0 0 32 32" width="96" height="96">
			<circle id="spinner" cx="16" cy="16" r="14" fill="none"></circle>
		</svg>
	</div>
`,
    props: ['loading']
})