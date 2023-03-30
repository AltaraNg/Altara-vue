<template>
	<div>
		<div class="modal-header py-2">
			<h4>Product Details</h4>
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
							<th>Product Name</th>
							<td>
								{{
									modalItem.name
								}}
							</td>
						</tr>
						<tr>
							<th>Price </th>
							<td>{{ Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "NGR",
                }).format(modalItem.price) }}</td>
						</tr>						
						<tr>
							<th>Date Created</th>
							<td>{{ modalItem.created_at }}</td>
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
