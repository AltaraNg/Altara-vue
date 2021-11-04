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
