<template>
	<div class="h-50">
		<div class="modal-header py-2">
			<h4>All Feedbacks</h4>
			<a aria-label="Close" class="close py-1" data-dismiss="modal" @click="closeModal">
				<span aria-hidden="true" class="modal-close text-danger">
					<i class="fas fa-times"></i>
				</span>
			</a>
		</div>
		<div class="modal-body adjusted" >
            
			<div class="table-responsive">
				<table class="table table-bordered table-striped">
					<tbody>
						<tr>
                            <th>S/N</th>
                            <th>Creator</th>
                            <th>Reason</th>
                            <th>feedback</th>                            
                            <th>Followup Date</th>

							
						</tr>
						<tr v-for="(item, index) in modalItem.general_feedbacks">
                            <td>{{index+1}}</td>
                            <td>{{item.created_by}}</td>
                            <td>{{item.reason}}</td>
                            <td>{{item.feedback}}</td>
                            <td>{{$humanizeDate(item.follow_up_date)}}</td>

                        </tr>
					</tbody>
				</table>
			</div>
		</div>
		
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

<style lang="scss" scoped>
.adjusted {
	height: 70vh;
	overflow-y: auto;
}
</style>
