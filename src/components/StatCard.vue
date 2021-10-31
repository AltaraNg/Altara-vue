<template>
	<div class="card p-5 hover-zoom hover-shadow">
		<div class="row">
			<div class="col">
				<div
					class="mt-3 text-black-50 h3"
					style="font-weight:900; color:black;"
				>
					{{ stat }}
				</div>
			</div>
			<div class="col text-right my-auto">
				<slot name="svg"></slot>
			</div>
		</div>
		<div>
			<p class="mb-0 overflow-auto" style="font-size: 12px;">{{ label }}</p>
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
