Vue.component('Debug', {
    template: `
	<div class="debug-info">{{ this.debugData }}</div>
`,
    props: ['debugData']
})