<template>
	<div>
		<div class="modal-header py-2">
			<h4>Order Summary</h4>
			<a
				aria-label="Close"
				class="close py-1"
				data-dismiss="modal"
				@click="closeModal"
			>
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
							<td>{{ formatDate(modalItem.order_date) }}</td>
						</tr>

						<tr>
							<th>Product</th>
							<td>{{ modalItem.product ? modalItem.product.name : '' }}</td>
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
						<tr>
							<th>
								Owner
								<span @click="editOwner" class="pointer text-warning" v-if="role !== 18 && role !== 42">
									Edit
								</span>
							</th>
							<td class="pointer" data-hoverable="true">
								<span v-show="edit === false">{{ modalItem.owner }}</span>
								<select
									v-show="edit"
									class="custom-control w-75 p-1 text-black"
									v-model="agent_id"
								>
									<option value="" disabled selected>--select dsa--</option>
									<option value="" v-for="agent in dsas" :value="agent.id">
										{{ agent.full_name }}
									</option>
								</select>
								<button
									v-show="edit"
									class="bg-success text-white border-0 p-1 mr-4 rounded float-right"
									@click="submit"
								>
									Done
								</button>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
		<div class="modal-footer justify-content-center"></div>
	</div>
</template>

<script>
	import moment from 'moment';
	import { get, put } from '../../utilities/api';
	import flash from '../../utilities/flash';
	export default {
		props: {
			modalItem: {
				required: true,
			},
			dsas: {
				required: true,
			},
		},
		data() {
			return {
				edit: false,
				apiUrl: {
					new_order: '/api/new_order/',
				},
				agent_id: '',
				role:''
			};
		},

		mounted() {
			this.role = parseInt(localStorage.getItem('role'));

		},

		methods: {
			closeModal() {
				this.$emit('close');
			},
			formatDate(date) {
				return moment(date).fromNow();
			},
			editOwner() {
				this.edit ? (this.edit = false) : (this.edit = true);
			},

			async submit() {
				this.$LIPS(true);
				try {
					let data = {
						id: this.modalItem.id,
						owner_id: this.agent_id,
					};
					let response = await put(this.apiUrl.new_order + data.id, data);
					if (response.data.status === 'success') {
						this.$swal({
							icon: 'success',
							title: 'Owner changed successfully',
						});
						this.$root.$emit('owner_updated');
					}
				} catch (err) {
					flash.setError(err);
				} finally {
					this.$LIPS(false);
				}
			},
		},
	};
</script>

<style lang="scss" scoped></style>
