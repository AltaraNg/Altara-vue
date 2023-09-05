<template>
	<div>
		<div class="attendance-body my-3">
			<h3 class="attendance-title">Order Requests</h3>
			<div class="card pt-0">
				<h4 class="card-header">Filter</h4>
				<div class="card-body">
					<request-filter @searchParams="search"></request-filter>
				</div>
			</div>
			<div class="" v-if="orderRequests.length > 0">
				<table class="table table-striped w-100">
					<thead class="attendance-head bg-default text-white ">
						<tr class="w-100">
							<th v-for="header in tableHeaders" :key="header" class="mx-3 text-center">
								{{ header }}
							</th>
						</tr>
					</thead>
					<tbody>
						<tr
							v-for="(item, index) in orderRequests" :key="index"
							data-hoverable="true"
							class="  text-center "
						>
							<td @click="viewRequest(item)" class="pointer">
								<span
									class="user text-white"
									:class="
										item.status === 'accepted'
											? 'bg-success'
											: item.status === 'declined'
											? 'bg-danger'
											: 'bg-warning'
									"
									>{{ index + OId }}</span
								>
							</td>
							<td>
								{{
									(item.customer.first_name + ' ' + item.customer.last_name)
										| upper
								}}
							</td>
							<td>{{ item.customer.telephone }}</td>
							<td>{{ formatDate(item.created_at) }}</td>
							<td>{{ item.order_type }}</td>
							<td>{{ item.status }}</td>
							<td>
								<div
									v-if="
										item.status === 'accepted' || item.status === 'declined'
									"
								>
									N/A
								</div>
								<select
									class="custom-select w-50 pointer"
									v-else
									@change="showModal(item.newStat, item)"
									v-model="item.newStat"
								>
									<option value="" selected>--select--</option>
									<option value="decline">Decline</option>
									<option value="accept">Approve</option>
								</select>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
			<div v-else class="mx-4">
				<ZeroState :title="'No Request to display'" :message="'No requests'">
					<template v-slot:image>
						<img src="../../../assets/thumb-up.png" /> </template
				></ZeroState>
			</div>
			<BasePagination
				:pageParam="pageMeta"
				@fetchData="paginationAction"
				v-if="pageMeta.total > 10"
			></BasePagination>
		</div>
	</div>
</template>

<script>
	import moment from 'moment';
	import { get, patch } from '../../../utilities/api';
	import BasePagination from '../../../components/Pagination/BasePagination.vue';
	import RequestFilter from '../../../components/Filters/RequestFilter.vue';
	import queryParam from '../../../utilities/queryParam';
	import ZeroState from '../../../components/ZeroState.vue';

	const init = () => `/api/order-requests`;

	export default {
		components: { BasePagination, RequestFilter, ZeroState },
		data() {
			return {
				tableHeaders: [
					'S/N',
					'Requested By',
					'Phone Number',
					'Date Requested',
					'Type',
					'Status',
					'Action',
				],
				requestOrdersApi: '/api/order-requests',
				orderRequests: [],
				pageMeta: {},
				OId: 0,
			};
		},
		mounted() {
			// this.fetchOrderRequests();
		},
		beforeRouteEnter({ query }, from, next) {
			if (Object.keys(query).length !== 0) {
				get(init() + queryParam(query))
					.then((res) => {
						next((vm) => {
							vm.orderRequests = res.data.data.order_requests.data;
							vm.pageMeta = res.data.data.order_requests;
							vm.OId = vm.pageMeta.from;
						});
					})
					.catch((e) => console.log(e.response.data))
					.finally(() => next(() => {}));
			} else
				next((vm) => {
					vm.fetchOrderRequests();
				});
		},

		// beforeRouteUpdate({ query }, from, next) {
		// 	if (Object.keys(query).length !== 0)
		// 		get(init() + queryParam(query))
		// 			.then((res) => {
		//                 vm.orderRequests = res.data.order_requests.data;
		// 				vm.pageMeta = res.data.order_requests;

		//             })
		// 			.catch((e) => console.log(e.response.data))
		// 			.finally(() => next((vm) => {}));
		// 	else
		// 		next((vm) => {
		// 			vm.fetchOrderRequests();
		// 		});
		// },

		methods: {
			fetchOrderRequests() {
				this.$LIPS(true);
				let date = new Date();
				let firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
				let format = 'yyyy-MM-DD';
				let param = {
					fromDate: moment(firstDay).format(format),
				};
				try {
					this.$router.push('order-request' + queryParam(param));
					get(this.requestOrdersApi + queryParam(param)).then((response) => {
						this.orderRequests = response.data.data.order_requests.data;
						this.pageMeta = response.data.data.order_requests;
						this.OId = this.pageMeta.from;
					});
				} catch (error) {
					// Handle error
				} finally {
					this.$LIPS(false);
				}
			},
			paginationAction() {
				this.$LIPS(true);

				let query = this.$route.query;
				if (Object.keys(query).length !== 0) {
					get(init() + queryParam(query))
						.then((res) => {
							this.orderRequests = res.data.data.order_requests.data;
							this.pageMeta = res.data.data.order_requests;
							this.OId = this.pageMeta.from;
						})
						.catch((e) => console.log(e.response.data))
						.finally(() => this.$LIPS(false));
				}
			},
			formatDate(date) {
				let m = moment(date);
				return m.fromNow();
			},
			viewRequest() {
			},
			search(payload) {
				this.$LIPS(true);
				this.$router.push('order-request' + queryParam(payload));
				get(this.requestOrdersApi + queryParam(payload))
					.then((res) => {
						this.orderRequests = res.data.data.order_requests.data;
						this.pageMeta = res.data.data.order_requests;
						this.OId = this.pageMeta.from;
					})
					.catch((e) => console.log(e.response.data))
					.finally(() => this.$LIPS(false));
			},
			showModal(text, req) {
				this.$swal({
					title: `${text.toUpperCase()} REQUEST`,
					// text: 'Leave a reason',
					input: 'textarea',
					inputValue: '',
					inputAttributes: {
						maxlength: 200
					},
					inputLabel: 'Reason',
					inputPlaceholder: 'Reason',
					showCancelButton: true,
					confirmButtonColor: '#074A74',
					cancelButtonColor: '#d33',
					confirmButtonText: `Yes, ${text} it!`,
					inputValidator: (value) => {
						if(!value){
							return 'Reason field is required'
						}
					},
					width: '50%',
					customClass: {
						container: 'swal2-height',
					},
					heightAuto: false,
				}).then((result) => {
					if (!result.isDismissed) {
						let comment = result.value;
						let url = `api/order-requests/${req.id}/${text}`;
						patch(url, { reason: comment })
							.then(() => {
								this.$swal({
									title: 'Success',
									icon: 'success',
									text: 'Action was successful',
								});
								this.paginationAction();
							})
							.catch((err) => {
								this.$swal({
									title: 'Fail',
									icon: 'error',
									text: err.response.data,
								});
							});
					}
				});
			},
		},
	};
</script>

<style lang="scss" scoped>
	.swal2-height {
		height: 80vh;
	}
</style>
