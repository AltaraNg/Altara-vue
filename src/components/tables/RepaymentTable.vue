<template>
	<div>
		<div class="row align-items-center  pt-3 pb-4 w-100 tableWidth  ">
			<div class="col light-heading  text-center" >S/N</div>
			<div class="col light-heading  text-left" v-for="header in headings">
				{{ header }}
			</div>
		</div>
		<div class="mt-1 text-center">
			<div class="mb-3 row attendance-item w-100 tableWidth text-left" :key="index" v-for="(customer, index) in customers"
				v-if="customers.length !== 0">
				<div class="col d-flex align-items-center" >
					<span class="user mx-auto">{{ index + OId }}</span>
				</div>
				<div class="col-12 col-xs-3 col-md col-lg d-flex align-items-center "
					data-hoverable="true" @click="viewOrder(customer)">
					{{ customer.order_number }}

				</div>
				<div class="col-12 col-xs-3 col-md col-lg d-flex align-items-center "
					data-hoverable="true" @click="viewCustomer(customer)" v-if="mode === 'renewal'">
					ID: {{ customer.customer ? customer.customer.id : '' }}-{{
						customer.customer ? customer.customer.employment_status : '' || ''
					}}
				</div>
				<div class="col-12 col-xs-3 col-md col-lg d-flex align-items-center "
					data-hoverable="true" @click="viewAmmo(customer)">

					| {{ customer.repayment | currency('₦') }}
				</div>
				<div class="col-12 col-xs-3 col-md col-lg d-flex align-items-center ">
					{{
						formatDate(
							customer.order_date
						)
						|| 'N/A'
					}}
				</div>

			</div>
		</div>

		<modal name="customer-info" :clickToClose="false">
			<customer-info-modal :modalItem="selectedCustomer" @close="hide('customer-info')" />
		</modal>

		<modal name="order-info" :height="'auto'" :clickToClose="false">
			<order-info-modal :modalItem="selectedOrder" @close="hide('order-info')" :dsas="dsas" />
		</modal>




	</div>
</template>

<script>
import Vue from 'vue';
import Vue2Filters from 'vue2-filters';
import NewOrderAmortization from '../NewOrderAmortization.vue';
import CustomerInfoModal from '../modals/CustomerInfoModal.vue';
import OrderInfoModal from '../modals/OrderInfoModal.vue';


import moment from 'moment';

Vue.use(Vue2Filters);

export default {
	components: {
		NewOrderAmortization,
		CustomerInfoModal,
		OrderInfoModal,

	},
	props: {
		headings: {
			type: Array,
			required: false,
			default: () => [
				
				'Order Number',
				'Customer Info Summary',
				'Repayment Summary',
				'Date',

			],
		},
		customers: {
			type: Array,
			required: false,
		},
		OId: {
			type: Number,
			required: false,
			default: 1,
		},

		statuses: {
			required: false,
		},
		dsas: {
			required: false,
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

		viewAmmo(order) {
			this.$modal.show(
				NewOrderAmortization,
				{ customer: order.customer, standAlone: true, order: order },
				{
					classes: ['w-80', 'overflow-auto'],
					adaptive: true,
					resizable: true,
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

		show(modal) {
			this.$modal.show(modal);
		},

		hide(modal) {
			this.$modal.hide(modal);
		},
	},
};
</script>

<style lang="scss" scoped>
.tableWidth{
	width:25%;
}
</style>
