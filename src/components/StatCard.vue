<template>
	<div class="card hover-zoom hover-shadow">
		<div class="card-body">
			<div class="d-flex media">
				<div class="media-body">
					<h3>
						{{ stat }}
					</h3>
					<span class="text-muted">{{ label }}</span>
				</div>

				<div class="align-self-center">
					<slot name="svg"></slot>
				</div>
			</div>
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
