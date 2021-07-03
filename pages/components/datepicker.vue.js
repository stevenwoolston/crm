var spaDatePicker = Vue.component('DatePicker', {
    template: `
		<input type="input" class="form-control" v-model="value" />
	`,
	props: ["value"],
	mounted() {
		var vm = this;
		var selectedDate;
		if (!this.value) {
			selectedDate = null;
		} else {
			selectedDate = moment(this.value).format("YYYY-MM-DD");
		}

		$(this.$el)
			.val(selectedDate)
			.datetimepicker({
				format: 'YYYY-MM-DD'
			})
			.on("blur", function() { 
				var selectedDate;
				if (this.value == "") {
					selectedDate = null
				} else {
					selectedDate = moment(this.value).format("YYYY-MM-DD");
				}
				vm.$emit("dateChanged", selectedDate);
			});
	}
})