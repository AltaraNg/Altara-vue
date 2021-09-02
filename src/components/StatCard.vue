<template>
	<div class="card pb-0 p-5 hover-zoom hover-shadow w-75">
        <div class="row">
		<div class="col-6 float-right pl-3">
            <div class="mt-3 text-black-50 h3" style="font-weight:900; color:black;">
				{{ stat }}
			</div>
			<p class="mb-0">{{ label }}</p>
		</div>
		<div class="col-6 text-right my-auto">
			<slot name="svg" class=""></slot>
			
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
