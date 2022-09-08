<template>
	<div id="PaystackModal" class="modal fade">
		<div class="modal-dialog">
			<form
				action="javascript:"
				class="modal-content"				
				id="paystackForm"
			>
				<div class="modal-header ml-5 py-3 text-center">
					<h6 class="modal-title my-modal text-center w-75">
						Get Paystack Auth Code
					</h6>
					<a
						aria-label="Close"
						class="close py-1"
						data-dismiss="modal"
						href="javascript:"
					>
						<span class="modal-close text-danger"
							><i class="fas fa-times"></i
						></span>
					</a>
				</div>
				<div class="modal-body" id="index" v-if="customer || order">
					<div class="form-group clearfix">
						<div class="clearfix">
							<div class="form-group">
								<label>Customer's Name.</label>
								<span class="font-weight-bold mx-2">{{ order.customer_name }}</span>

								
							</div>

							<div class="form-group">
								<label>Customer's Phone Number.</label>
								<span class="font-weight-bold mx-2">{{ order.customer_phone }}</span>

								
							</div>

							<div class="form-group">
								<label>Order Number: </label>
								<span class="font-weight-bold mx-2">{{ orderNumber }}</span>
							</div>

							<div class="form-group">
								<label>Amount to charge: </label>
								<span class="font-weight-bold mx-2">₦100</span>
							</div>
						</div>
					</div>
				</div>
				<div class="modal-footer d-flex justify-content-end">
					<paystack
						:amount="10000"
						:email="customer ? customer.email : ''"
						:paystackkey="paystackkey"
						:reference="reference"
						:callback="processPaymentPayStackPayment"
						:close="closePayStackModal"
						class="btn bg-default"
						>Proceed</paystack
					>

					<button class="btn btn-danger rounded-1 mx-2" data-dismiss="modal" href="javascript:">
						Cancel
					</button>
				</div>
			</form>
		</div>
	</div>
</template>

<script>
	import Vue from 'vue';
	import { mapGetters } from 'vuex';
	import { post } from '../../utilities/api';
	import Flash from '../../utilities/flash';
	import { Message } from '../../utilities/sms';
	import { EventBus } from '../../utilities/event-bus';
	import paystack from 'vue-paystack';

	export default {
		components: {
			paystack,
		},

		data() {
			return {
				order: null,
				value: null,
				DSAId: null,
				DSAName: null,
				message: null,
				customer: null,
				messageType: 'custom',
				showChangeCustomerManagerModal: true,
				verifyPaymentUrl: `https://api.paystack.co/transaction/verify/`,
				paystack_auth_code_url: '/api/pay_stack_auth_code',
				paystackkey: process.env.VUE_APP_PAYSTACK_KEY || '',
				paystack_secret_key: process.env.VUE_APP_PAYSTACK_SECRET_KEY || '',
				authorization_code: null,
				paystackReference: null,
			};
		},

		computed: {
			reference() {
				let text = '';
				let possible =
					'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789' +
					this.order?.order_number;
				for (let i = 0; i < 10; i++)
					text += possible.charAt(Math.floor(Math.random() * possible.length));
				return text;
			},
			telephone() {
				if (this.customer != null) return this.customer.telephone;
				if (this.order != null) return this.order.order.customer.telephone;
				return null;
			},

			orderNumber() {
				if (this.order != null) return this.order.order_number;
				return null;
			},

			customerName() {
				let customer;
				if (this.customer != null) customer = this.customer;
				else if (this.order != null) customer = this.order.order.customer;
				return this.$getCustomerFullName(customer);
			},

			...mapGetters(['getAuthUserDetails']),
		},

		methods: {
			async processPaymentPayStackPayment(resp) {
				this.paystackReference = resp.reference;
				if (resp.status == 'success' && resp.message == 'Approved') {
					await this.verifyPaystackPayment()
						.then((data) => {
							if (data.status && data.message == 'Verification successful') {
								this.$LIPS(true);
								this.authorization_code =
									data.data.authorization.authorization_code;

								post(this.paystack_auth_code_url, {
									order_id: this.order.order_number,
									auth_code: this.authorization_code,
								})
									.then((res) => {
                                        this.done('AuthCode set successfully!');
									})
									.catch((err) => {
										Flash.setError(err.message);
									})
									.finally(() => {
										this.$LIPS(false);
									});
							}
						})
						.catch((error) => {
							this.$displayErrorMessage(error);
						});
				}
			},

			closePayStackModal: () => {},
			async verifyPaystackPayment() {
				const url = `${this.verifyPaymentUrl}${this.paystackReference}`;
				const response = await fetch(url, {
					method: 'GET',
					headers: {
						Authorization: `Bearer ${process.env.VUE_APP_PAYSTACK_SECRET_KEY}`,
					},
				});
				return response.json();
			},
			async handleModalToggle({ customer, order }) {
				await Vue.set(this.$data, 'order', order);
				await Vue.set(this.$data, 'customer', customer);
				this.toggleModal();
			},

			toggleModal() {
				$('#PaystackModal').modal('toggle');
			},

			

			

			done(message) {
				EventBus.$emit('reloadUser', {order: this.order.id, auth_code: this.authorization_code});
				Flash.setSuccess(message);
				this.$scrollToTop();
				this.toggleModal();
				this.$LIPS(false);
				this.message = null;
			},
		},

		watch: {
			'messageType': function(newValue) {
				//do stuff for generating sms
			},
		},

		created() {
			EventBus.$on('ShowPaystack', this.handleModalToggle);
		},
	};
</script>
<style scoped>
	.my-modal{
		font-size: 1.5em;
	}
</style>
