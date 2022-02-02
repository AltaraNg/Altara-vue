<template>
	<div class="card py-4 rounded-circle d-flex">
		<div class="col float-right"><slot name="svg" class="card-img-top rounded-circle float-right">"></slot></div>

		<div
			class="card-body text-white font-weight-bold col"
			style="border-radius: 50%"
		>
			<h3>
				{{ stat }}
			</h3>
			{{ label }}
		</div>
	</div>
</template>

<script>
	export default {
		name: 'StatCard',
		props: {
			stat: {
				required: true,
			},

			label: {
				type: String,
				required: false,
				default: 'Label',
			},
			source: {
				type: String,
				required: false,
			},
		},
	};
</script>

<style lang="scss" scoped>
	p {
		color: #084871;
	}
</style>
