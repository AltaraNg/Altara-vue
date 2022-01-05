<template>
	<div>
		<div class="row  pt-3 pb-4 mx-auto ">
			<div class="col light-heading" v-for="header in headings">
				{{ header }}
			</div>
		</div>
		<div class="mt-1 text-center">
			<div
				class="mb-3 row attendance-item mx-auto text-center"
				:key="index"
				v-for="(customer, index) in customers"
				v-if="customers.length !== 0"
			>
				<div class="col d-flex align-items-center" style="max-width: 120px">
					<span class="user mx-auto">{{ index + OId }}</span>
				</div>
				<div
					class="col-12 col-xs-3 col-md col-lg d-flex align-items-center justify-content-center"
					data-hoverable="true"
					@click="viewOrder(customer)"
				>
					{{ customer.order_number }}
					<i
						class="fas fa-exclamation-circle text-success p-1"
						v-if="calcDebt(customer.amortization) === 0 && mode === 'renewal'"
					></i>
				</div>

				<div
					class="col-12 col-xs-3 col-md col-lg d-flex align-items-center justify-content-center"
					data-hoverable="true"
					@click="viewCustomer(customer)"
					v-if="mode === 'collections'"
				>
					{{ customer.customer.id }}
				</div>

				<div
					class="col-12 col-xs-3 col-md col-lg d-flex align-items-center justify-content-center"
					data-hoverable="true"
					@click="viewCustomer(customer)"
					v-if="mode === 'renewal'"
				>
					ID: {{ customer.customer ? customer.customer.id : '' }}-{{
						customer.customer ? customer.customer.employment_status : '' || ''
					}}
				</div>
				<div
					class="col-12 col-xs-3 col-md col-lg d-flex align-items-center justify-content-center"
					data-hoverable="true"
					@click="viewAmmo(customer)"
				>
					{{
						(customer.repayment - calcDebt(customer.amortization))
							| currency('₦')
					}}
					| {{ customer.repayment | currency('₦') }}
				</div>

				<div
					class="col-12 col-xs-3 col-md col-lg d-flex align-items-center justify-content-center"
					:data-hoverable="customer.general_feedbacks[0] !== undefined"
					v-if="mode === 'collections'"
					@click="generalFeedback(customer)"
				>
					{{ customer.general_feedbacks[0]? customer.general_feedbacks[customer.general_feedbacks.length - 1].feedback  : 'N/A' | truncate(50) }}
				</div>

				<div
					class="col-12 col-xs-3 col-md col-lg d-flex align-items-center justify-content-center"
					data-hoverable="false"
					v-if="mode === 'collections'"
				>
					{{
						customer.general_feedbacks[0]
							? $humanizeDate(customer.general_feedbacks[customer.general_feedbacks.length - 1].created_at)
							: ' N/A'
					}}
				</div>

				<div
					class="col-12 col-xs-3 col-md col-lg d-flex align-items-center justify-content-center"
					data-hoverable="true"
					v-if="mode === 'collections'"
				>
				
					<img
						src="../../assets/css/svgs/circle.svg"
						alt="plus"
						@click="addFeedbackModal(customer)"
						title="Add Feedback"
					/>
				</div>

				<div
					class="col-12 col-xs-3 col-md col-lg d-flex align-items-center justify-content-center"
					:data-hoverable="
						customer.last_renewal_prompter_activity ? true : false
					"
					@click="viewActivity(customer)"
					v-if="mode === 'renewal'"
				>
					{{
						customer.last_renewal_prompter_activity
							? customer.last_renewal_prompter_activity.attributes
									.renewal_prompter_status
							: '' || 'N/A'
					}}
				</div>

				<div
					class="col-12 col-xs-3 col-md col-lg d-flex align-items-center justify-content-center"
					:data-hoverable="
						customer.last_renewal_prompter_activity ? true : false
					"
					@click="viewActivity(customer)"
					v-if="mode === 'renewal'"
				>
					{{
						customer.last_renewal_prompter_activity
							? formatDate(
									customer.last_renewal_prompter_activity.attributes.created_at
							  )
							: '' || 'N/A'
					}}
				</div>

				<div
					class="col-12 col-xs-3 col-md col-lg d-flex align-items-center justify-content-center "
					data-hoverable="true"
					@click="updateStatus(customer)"
					v-if="mode === 'renewal'"
				>
					<i class="far fa-edit text-success"></i>
				</div>
			</div>
		</div>

		<modal name="customer-info" :clickToClose="false">
			<customer-info-modal
				:modalItem="selectedCustomer"
				@close="hide('customer-info')"
			/>
		</modal>

		<modal name="order-info" :height="'auto'" :clickToClose="false">
			<order-info-modal
				:modalItem="selectedOrder"
				@close="hide('order-info')"
				:dsas="dsas"
			/>
		</modal>

		<modal name="update-status" :height="'auto'" :clickToClose="false">
			<update-renewal-modal
				:modalItem="selectedOrderRenew"
				@close="hide('update-status')"
				:statuses="statuses"
			/>
		</modal>

		<modal name="add-feedback" :height="'auto'" :clickToClose="false">
			<add-feedback-modal
				:modalItem="selectedOrderFeedback"
				@close="hide('add-feedback')"
				:statuses="statuses"
			/>
		</modal>
		<modal name="general-feedbacks" :height="'auto'" :clickToClose="false">
			<general-feedback-modal
				:modalItem="selectedOrderGen"
				@close="hide('general-feedbacks')"
			/>
		</modal>

		<modal
			name="last-activity"
			:adaptive="true"
			:height="'auto'"
			:clickToClose="false"
			:reset="true"
		>
			<last-activity-modal
				:modalItem="selectedActivity"
				@close="hide('last-activity')"
			/>
		</modal>
	</div>
</template>

<script>
	import Vue from 'vue';
	import Vue2Filters from 'vue2-filters';
	import NewOrderAmortization from '../NewOrderAmortization.vue';
	import CustomerInfoModal from '../modals/CustomerInfoModal.vue';
	import OrderInfoModal from '../modals/OrderInfoModal.vue';
	import UpdateRenewalModal from '../modals/UpdateRenewalModal.vue';
	import LastActivityModal from '../modals/LastActivityModal.vue';
	import AddFeedbackModal from '../modals/AddFeedbackModal.vue';
	import GeneralFeedbackModal from '../modals/GeneralFeedbackModal.vue'

	import moment from 'moment';

	Vue.use(Vue2Filters);

	export default {
		components: {
			NewOrderAmortization,
			CustomerInfoModal,
			OrderInfoModal,
			UpdateRenewalModal,
			LastActivityModal,
			AddFeedbackModal,
			GeneralFeedbackModal
		},
		props: {
			headings: {
				type: Array,
				required: false,
				default: () => [
					'S/N',
					'Order Number',
					'Customer Info Summary',
					'Repayment Summary',
					'Last Activity',
					'Date',

					'Action',
				],
			},
			customers: {
				type: Array,
				required: false,
				default: () => [
					{
						name: 'Omodamola Oladeji',
						order_date: '12-27-2021',
						id: 1234,
						employment_status: 'Employed formal',
						action: '',
					},
				],
			},
			OId: {
				type: Number,
				required: true,
				default: 1,
			},

			statuses: {
				required: true,
			},
			dsas: {
				required: true,
			},

			mode: {
				type: String,
				required: false,
				default: 'renewal',
			},
		},
		data() {
			return {
				selectedCustomer: '',
				selectedOrder: '',
				selectedOrderRenew: '',
				selectedActivity: '',
				debt: false,
				selectedOrderFeedback: '',
				selectedOrderGen: '',
			};
		},

		methods: {
			formatDate(date) {
				return moment(date).fromNow();
			},
			calcDebt(amortization) {
				// I assumed that all repayments are uniform and are not varied

				if (amortization && amortization[0] !== undefined) {
					let res = amortization.filter((amor) => {
						return amor.actual_amount === 0;
					});
					return res.length * amortization[0].expected_amount;
				}
				return;
			},

			viewAmmo(order) {
				this.$modal.show(
					NewOrderAmortization,
					{ customer: order.customer, standAlone: true, order: order },
					{
						classes: ['w-80', 'overflow-auto'],
						adaptive: true,
						resizable: true,
						draggable: true,
						height: 'auto',
						width: '80%',
						clickToClose: false,
					}
				);
			},

			viewCustomer(order) {
				this.selectedCustomer = order.customer;
				this.show('customer-info');
			},

			viewOrder(order) {
				this.selectedOrder = order;
				this.show('order-info');
			},
			viewActivity(order) {
				if (order.last_renewal_prompter_activity) {
					this.selectedActivity = order?.renewal_prompters?.data;
					this.show('last-activity');
				}
			},

			addFeedbackModal(order) {
				this.selectedOrderFeedback = order;

				this.show('add-feedback');

			},

			generalFeedback(order){
				this.selectedOrderGen = order;
				this.show('general-feedbacks')
			},
			updateStatus(order) {
				this.selectedOrderRenew = order;

				this.show('update-status');
			},

			show(modal) {
				this.$modal.show(modal);
			},

			hide(modal) {
				this.$modal.hide(modal);
			},
		},
	};
</script>

<style lang="scss" scoped></style>
