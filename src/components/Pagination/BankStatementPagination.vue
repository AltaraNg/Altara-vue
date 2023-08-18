<template>
	<div class="mb-5 w-100 px-0 row align-items-center">
		<div class="w-100 mb-4 mt-5 mx-0 hr"></div>
		<div class="clearfix w-100 mt-4 d-flex bd-highlight">
			<div class="col d-flex justify-content-start ml-5 align-items-center pl-0">
				<strong class="light-heading float-left">
					Displaying: {{ fromValue }} - {{ toValue }} <span v-if="pageParam.total">of
					{{ pageParam.total }}</span>
				</strong>
			</div>

			<div class="col d-flex justify-content-center align-items-center">
				<div class="mr-5">
					<span class="d-inline light-heading mr-2">set current Page</span>
					<input
						class="d-inline form-control"
						type="number"
						v-model="pageParam.page"
						style="max-width: 50px"
						@keyup.enter="fetchPage(pageParam.page)"
					/>
				</div>
				<div class="ml-5">
					<span class="d-inline light-heading mr-2">set page-size</span>
					<input
						class="d-inline form-control"
						type="number"
						v-model="pageParam.size"
						style="max-width: 50px"
						@keyup.enter="fetchLimit(pageParam.size)"
					/>
				</div>
			</div>

			<nav class="col d-flex justify-content-end align-items-center pr-0">
				<ul class="pagination pagination-lg mb-0">
					<!---->
					<li
						:class="{ disabled: !pageParam.first_page_url }"
						class="page-item"
					>
						<a href="javascript:" @click="prev(1)" class="page-link">First</a>
					</li>
					<li :class="{ disabled: !pageParam.prev_page_url }" class="page-item">
						<a href="javascript:" @click="prev()" class="page-link">Prev</a>
					</li>
					<!---->
					<li class="page-item">
						<span class="page-link w-100"
							>page:{{ pageParam.current_page }}</span
						>
					</li>
					<!---->
					<li :class="{ disabled: !pageParam.next_page_url }" class="page-item">
						<a href="javascript:" @click="next()" class="page-link">Next</a>
					</li>
					<li :class="{ disabled: !pageParam.last_page_url }" class="page-item">
						<a
							href="javascript:"
							@click="next(pageParam.last_page)"
							class="page-link"
							>Last</a
						>
					</li>
					<!---->
				</ul>
			</nav>
		</div>
	</div>
</template>
<script>
	export default {
		components: {},
		props: {
			pageParam: {
				type: Object,
				required: true,
			},
		},

		methods: {
			next(firstPage = null) {
				if (this.pageParam.next_page_url) {
					this.pageParam.page = firstPage
						? firstPage
						: parseInt(this.pageParam.current_page) + 1;
					this.$router.push({
						path: this.$route.path,
						query: {
							...this.$route.query,
							page: this.pageParam.page,
						},
					});
					this.$emit('fetchData');
				}
			},
			prev(lastPage = null) {
				if (this.pageParam.prev_page_url) {
					this.pageParam.page = lastPage
						? lastPage
						: parseInt(this.pageParam.current_page) - 1;
					this.$router.push({
						path: this.$route.path,
						query: {
							...this.$route.query,
							page: this.pageParam.page,
						},
					});
					this.$emit('fetchData');
				}
			},
			async fetchPage(page) {
				this.pageParam.page = page;

				this.$router.push({
					path: this.$route.path,
					query: {
						...this.$route.query,
						page: this.pageParam.page,
					},
				});

				this.$emit('fetchData');
			},

			async fetchLimit(page) {
				this.pageParam.size = page;

				this.$router.push({
					path: this.$route.path,
					query: {
						...this.$route.query,
						limit: this.pageParam.size,
					},
				});

				this.$emit('fetchData');
			},
		},

		created() {
			this.pageParam.page = this.pageParam.page ? this.pageParam.page : 1;
			this.pageParam.size = this.pageParam.size ? this.pageParam.size : 10;

		},
		computed: {

		fromValue() {
			return  (this.pageParam.page - 1) * this.pageParam.size + 1;
		},
		toValue() {
			return this.fromValue +  this.pageParam.size - 1;
		},
	},
	};
</script>
<
