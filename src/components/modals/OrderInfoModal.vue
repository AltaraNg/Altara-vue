<template>
	<div>
		<div class="modal-header py-2">
			<h4>Order Summary</h4>
			<a aria-label="Close" class="close py-1" data-dismiss="modal" @click="closeModal">
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
							<th>Owner</th>
							<td>{{ modalItem.owner }}</td>
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
	export default {
		props: {
			modalItem: {
				required: true,
			},
		},
		methods:{
			closeModal(){
				this.$emit('close');
			},
			formatDate(date){
				return moment(date).fromNow();
			}
		}
	};
</script>

<style lang="scss" scoped></style>
