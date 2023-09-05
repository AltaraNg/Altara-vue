<template>
	<div>
		<div class=" mb-3 attendance-head">
			<resueable-search
				:url="renewal ? url + '?renewalList=true' : url"
				@childToParent="searchResponse"
				:showBranch="true"
				:showDate="true"
			>
				<template #default="{ searchQuery }">
					<div class="col-md">
						<div>
							<label class="form-control-label">Business Type: </label>
						</div>
						<select
							name="category"
							id="category"
							class="custom-select"
							v-model="searchQuery.businessType"
						>
							<option :value="type.id" v-for="type in businessTypes" :key="type.id">
								{{ type.name }}
							</option>
						</select>
					</div>
					<div class="col-md">
						<div>
							<label class="form-control-label">Status: </label>
						</div>
						<select
							name="category"
							id="category"
							class="custom-select"
							v-model="searchQuery.status"
						>
							<option :value="type.status" v-for="type in renewalStatus" :key="type.status">
								{{ type.status }}
							</option>
						</select>
					</div>
				</template>
			</resueable-search>
			<div class="w-100 my-5 mx-0 hr"></div>
			<div class="row px-4 pt-3 pb-4 text-center">
				<div class="col light-heading" style="max-width: 120px">S/N</div>
				<div class="col light-heading" v-for="header in headings" :key="header">
					{{ header }}
				</div>
				<div class="col light-heading" v-if="renewal === false">
					Reminder History
				</div>
				<div class="col light-heading" v-if="renewal">Status</div>
				<div class="col light-heading" v-if="renewal">Date-Time</div>
				<div class="col light-heading" v-if="renewal">Feedback</div>
			</div>
		</div>
		<div class="tab-content mt-1 attendance-body">
			<template v-if="orders">
			<div
				class="mb-3 row attendance-item"
				:key="index"
				v-for="(order, index) in orders"
			>
				<div class="col d-flex align-items-center" style="max-width: 120px">
					<span class="user mx-auto" @click="submitFeedback(order)">{{
						index + OId
					}}</span>
				</div>
				<div
					class="col-12 col-xs-3 col-md col-lg d-flex align-items-center justify-content-center"
				>
					{{ order.order_number }}
				</div>
				<div
					class="col-12 col-xs-3 col-md col-lg d-flex align-items-center justify-content-center"
					data-hoverable="true"
					@click="viewStuffs(order, 'order')"
				>
					{{ order.order_date }}
				</div>
				<div
					class="col-12 col-xs-3 col-md col-lg d-flex align-items-center justify-content-center"
					data-hoverable="true"
					@click="viewStuffs(order.customer, 'customer')"
				>
					ID: {{ order.customer.id }}-{{ order.customer.employment_status }}
				</div>
				<div
					class="col-12 col-xs-3 col-md col-lg d-flex align-items-center justify-content-center"
					data-hoverable="true"
					@click="viewStuffs(order, 'amortization')"
				>
					{{ (order.repayment - calcDebt(order.amortization)) | currency('₦') }}
					| {{ order.repayment | currency('₦') }}
				</div>
				<div
					class="col-12 col-xs-3 col-md col-lg d-flex align-items-center justify-content-center"
					data-hoverable="true"
					@click="viewStuffs(order.notifications, 'notification')"
					v-if="renewal === false"
				>
					{{ order.notifications[0] ? order.notifications.length : '0' }}
					reminder(s) sent
				</div>
				<div
					class="col-12 col-xs-3 col-md col-lg d-flex align-items-center justify-content-center"
					data-hoverable="true"
					v-if="renewal"
				>
					<select
						v-model="order.renewal_status"
						name="status"
						class="custom-select"
					>
						<option :value="option.status" v-for="option in renewalStatus" :key="option.status">
							{{ option.status }}
						</option>
					</select>
				</div>
				<div
					class="col-12 col-xs-3 col-md col-lg d-flex align-items-center justify-content-center"
					data-hoverable="true"
					v-if="renewal"
				>
					<input
						type="date"
						v-model="order.renewal_date"
						class="form-control"
						:disabled="order.renewal_status !== 'callback'"
					/>
				</div>
				<div
					class="col-12 col-xs-3 col-md col-lg d-flex align-items-center justify-content-center"
					data-hoverable="true"
					v-if="renewal"
				>
					<input type="text" v-model="order.feedback" class="form-control" />
				</div>
			</div>
		</template>
		</div>

		<div class="modal fade repayment" id="viewStuffs">
			<div class="modal-dialog modal-xl" role="document">
				<div class="modal-content " v-if="showModalContent">
					<div v-if="mode === 'order'">
						<div class="modal-header py-2">
							<h4>Order Summary</h4>
							<a aria-label="Close" class="close py-1" data-dismiss="modal">
								<span aria-hidden="true" class="modal-close text-danger">
									<i class="fas fa-times"></i>
								</span>
							</a>
						</div>
						<div class="modal-body px-5">
							<div class="table-responsive">
								<table class="table table-bordered table-striped">
									<tbody>
										<tr>
											<th>Order Number</th>
											<td>{{ modalItem.order_number || 'Not Available' }}</td>
										</tr>
										<tr>
											<th>Order Date</th>
											<td>{{ modalItem.order_date }}</td>
										</tr>

										<tr>
											<th>Product</th>
											<td>{{ modalItem.product.name }}</td>
										</tr>
										<tr>
											<th>Business Type</th>
											<td>{{ modalItem.business_type }}</td>
										</tr>
										<tr>
											<th>Repayment</th>
											<td>{{ modalItem.repayment | currency('₦') }}</td>
										</tr>
										<tr>
											<th>Downpayment</th>
											<td>{{ modalItem.down_payment | currency('₦') }}</td>
										</tr>
										<tr>
											<th>Total Amount to Pay</th>
											<td>{{ modalItem.product_price | currency('₦') }}</td>
										</tr>
									</tbody>
								</table>
							</div>
						</div>
						<div class="modal-footer justify-content-center"></div>
					</div>
					<div v-else-if="mode === 'amortization'">
						<new-order-amortization
							:standAlone="true"
							:order="modalItem"
							:customer="modalItem.customer"
						></new-order-amortization>
					</div>
					<div v-else-if="mode === 'notification'" class="table-responsive">
						<div class="modal-header py-2">
							<h4>Notification Summary</h4>
							<a aria-label="Close" class="close py-1" data-dismiss="modal">
								<span aria-hidden="true" class="modal-close text-danger">
									<i class="fas fa-times"></i>
								</span>
							</a>
						</div>
						<div class="modal-body px-5">
							<div class="table-responsive">
								<div v-if="modalItem.length === 0">
									No Notifications to see!!!
								</div>
								<table class="table table-bordered table-striped" v-else>
									<thead>
										<tr>
											<th>S/N</th>
											<th>Date</th>
											<th>Notification Type</th>
											<th>SMS/Feedback</th>
										</tr>
									</thead>
									<tbody>
										<tr v-for="(object, index) in modalItem" :key="index">
											<td>{{ index + 1 }}</td>
											<td>{{ convertDate(object.created_at) }}</td>
											<td>
												{{
													object.type === 'App\\Notifications\\SmsReminderSent'
														? 'SMS'
														: object.type === 'App\\Notifications\\CallReminder'
														? 'Call'
														: 'Collection'
												}}
											</td>
											<td>
												{{
													object.type == 'App\\Notifications\\SmsReminderSent'
														? object.data.message
														: object.data.feedback
												}}
											</td>
										</tr>
									</tbody>
								</table>
							</div>
						</div>
						<div class="modal-footer justify-content-center"></div>
					</div>
					<div v-else-if="mode === 'customer'">
						<div class="modal-header py-2">
							<h4>Customer Details</h4>
							<a aria-label="Close" class="close py-1" data-dismiss="modal">
								<span aria-hidden="true" class="modal-close text-danger">
									<i class="fas fa-times"></i>
								</span>
							</a>
						</div>
						<div class="modal-body px-5">
							<div class="table-responsive">
								<table class="table table-bordered table-striped">
									<tbody>
										<tr>
											<th>Customer Name</th>
											<td>
												{{
													`${modalItem.first_name} ${modalItem.last_name}` ||
														'Not Available'
												}}
											</td>
										</tr>
										<tr>
											<th>Customer Number</th>
											<td>{{ modalItem.telephone }}</td>
										</tr>

										<tr>
											<th>Registered By</th>
											<td>{{ modalItem.employee_name }}</td>
										</tr>
										<tr>
											<th>Date Registered</th>
											<td>{{ modalItem.date_of_registration }}</td>
										</tr>

										<tr>
											<th>Occupation</th>
											<td>{{ modalItem.occupation }}</td>
										</tr>
									</tbody>
								</table>
							</div>
						</div>
						<div class="modal-footer justify-content-center"></div>
					</div>
				</div>
			</div>
		</div>
		<div v-if="pageParams">
			<base-pagination :page-param="pageParams" @fetchData="fetchData">
			</base-pagination>
		</div>
	</div>
</template>

<script>
	import Vue from 'vue';
	import { get, post } from '../utilities/api';
	import queryParam from '../utilities/queryParam';
	import { mapGetters } from 'vuex';
	import Vue2Filters from 'vue2-filters';
	import NewOrderAmortization from './NewOrderAmortization';
	import ResueableSearch from './ReusableSearch.vue';
	import BasePagination from './Pagination/BasePagination';

	Vue.use(Vue2Filters);
	export default {
		components: {
			NewOrderAmortization,
			ResueableSearch,
			BasePagination,
		},
		computed: { ...mapGetters(['getBranches']) },
		props: {
			renewal: {
				type: Boolean,
				required: false,
				default: false,
			},
			url: {
				type: String,
				required: false,
				default: '/api/new_order',
			},
		},
		data() {
			return {
				headings: [
					'Order Number',
					'Order Summary',
					'Customer Info Summary',
					'Repayment Summary',
				],
				orders: null,

				pageParams: {},
				OId: 0,
				showModalContent: false,
				mode: null,
				modalItem: null,
				page: 1,
				businessTypes: [],
				renewalStatus: null,
				searchQuery: {},
			};
		},
		methods: {
			fetchData() {
				this.$LIPS(true);
				let param = {
					renewalList: 'true',
					page: this.pageParams.page,
					limit: this.pageParams.limit,
					...this.searchQuery,
				};
				if (this.renewal === true) {
					get(this.url + queryParam(param))
						.then(({ data }) => this.prepareList(data))
						.catch(() => {
							// Flash.setError('Error Preparing form')
						})
						.finally(() => {
							this.$LIPS(false);
						});
				} else {
					delete param.renewalList;
					get(this.url + queryParam(param))
						.then(({ data }) => this.prepareList(data))
						.catch(() => {
							// Handle this
							// Flash.setError('Error Preparing form')
						})
						.finally(() => {
							this.$LIPS(false);
						});
				}
			},

			prepareList(response) {
				let {
					current_page,
					first_page_url,
					from,
					last_page,
					last_page_url,
					data,
					per_page,
					next_page_url,
					to,
					total,
					prev_page_url,
				} = response.data;
				this.pageParams = Object.assign({}, this.pageParams, {
					current_page,
					first_page_url,
					from,
					last_page,
					last_page_url,
					per_page,
					next_page_url,
					to,
					total,
					prev_page_url,
				});
				this.orders = data;
				if (response.queryParams !== undefined) {
					this.searchQuery = response.queryParams;
				}
				this.OId = from;
				this.$LIPS(false);
			},
			calcDebt(amortization) {
				// I assumed that all repayments are uniform and are not varied
				if (amortization[0] !== undefined) {
					let res = amortization.filter((amor) => {
						return amor.actual_amount === 0;
					});
					return res.length * amortization[0].expected_amount;
				}
				return;
			},
			viewStuffs(item, model) {
				if(!item){
					alert(`${model} does not exist`);
				}else{
					this.modalItem = item;
				this.mode = model;
				this.showModalContent = true;
				return $(`#viewStuffs`).modal('toggle');
				}
				
			},
			searchResponse(data){
				this.prepareList(data.data.data);
			},

			convertDate(date) {
				let utcDate = new Date(date).toUTCString();
				return utcDate;
			},
			async getBusinessTypes() {
				let types = await get('/api/business_type');
				this.businessTypes = types.data.data.data;
			},
			async getRenewalStatus() {
				let types = await get('/api/renewal-list-status');
				this.renewalStatus = types.data.data;
			},

			submitFeedback(order) {
				this.$LIPS(true);

				let data = {
					order_id: order.id,
					feedback: order.feedback,
					status: order.renewal_status,
					date: order.renewal_date,
				};
				post('/api/new-order-renewal', data)
					.then((res) => {
						if (res.data.status === 'success') {
							this.$swal({
								icon: 'success',
								title: '',
							});
						}
						order.feedback = '';
						order.renewal_status = '';
						order.renewal_date = '';
					})
					.catch(() => {
						// Handle catch block
					})
					.finally(() => {
						this.$LIPS(false);
					});
			},
		},
		created() {
			this.$prepareBranches();
			this.fetchData();
			this.getBusinessTypes();
			this.getRenewalStatus();
		},
	};
</script>

<style lang="scss" scoped></style>
