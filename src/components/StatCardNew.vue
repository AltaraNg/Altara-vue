<template>
	<div class="card py-1 rounded-circle d-flex">
		<div class="col float-right my-auto py-2"><slot name="svg" class="card-img-top rounded-circle float-right my-auto"></slot></div>

		<div
			class="card-body text-black font-weight-bold col"
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
