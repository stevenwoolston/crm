Vue.component('Debug', {
    template: `
	<div>{{ this.debugData }}</div>
`,
    props: ['debugData']
})