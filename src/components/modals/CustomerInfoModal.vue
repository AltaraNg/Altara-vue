<template>
	<div>
		<div class="modal-header py-2">
			<h4>Customer Details</h4>
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
							<th>Date Registered</th>
							<td>{{ modalItem.date_of_registration }}</td>
						</tr>

						<tr>
							<th>Occupation</th>
							<td>{{ modalItem.occupation || 'N/A' }}</td>
						</tr>
						<tr>
							<th>Address</th>
							<td>{{ `${modalItem.add_street}, ${modalItem.city}` }}</td>
						</tr>
						<tr v-if="modalItem.guarantors.length > 0">
							<th>Guarantor_1 Name</th>
							<td>{{ `${modalItem.guarantors[0].first_name} ${modalItem.guarantors[0].last_name}` }}</td>
						</tr>
						<tr v-if="modalItem.guarantors.length > 0">
							<th>Guarantor_1 Phone </th>
							<td>{{ `${modalItem.guarantors[0].phone_number}` }}</td>
						</tr>

						<tr v-if="modalItem.guarantors[1]">
							<th>Guarantor_2 Name</th>
							<td>{{ `${modalItem.guarantors[1].first_name} ${modalItem.guarantors[1].last_name}` }}</td>
						</tr>
						<tr v-if="modalItem.guarantors[1]">
							<th>Guarantor_2 Phone </th>
							<td>{{ `${modalItem.guarantors[1].phone_number}` }}</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
		<div class="modal-footer justify-content-center"></div>
	</div>
</template>

<script>
	export default {
        props: {modalItem:{
            required: true
        }},

        methods:{
			closeModal(){
				this.$emit('close');
			}
		}
    };
</script>

<style lang="scss" scoped></style>
