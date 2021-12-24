<template>
	<div>
		<div class="modal-header py-2">
            <div class="p-2 my-2">
                <i class="fas fa-plus-circle" style="font-size: 16px;"></i>
			<span class="h4 mx-3">Add Feedback</span>
            </div>
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
		<div class="modal-body pl-5 py-5">
            <form>
                <textarea cols="92" rows="8" placeholder="add feedback..." class="p-3"/>

                <div class="form-group my-2">
                    <div>
                    <label class="form-control-label">Followup Date</label>
                    </div>
                    <date-picker
							class="w-50"
							v-model="date"
							valueType="format"
							placeholder="Date From"
						></date-picker>
                </div>

                <button class="btn float-right bg-default mb-3">Add Feedback</button>
            </form>

        </div>
			
		<div class="modal-footer justify-content-center"></div>
	</div>
</template>

<script>
	import { get, post } from '../../utilities/api';    
	import DatePicker from 'vue2-datepicker';
	import 'vue2-datepicker/index.css';

	export default {
		components: {
			DatePicker,
		},
		props: {
			modalItem: {
				required: true,
			},
			statuses: {
				required: true,
			},
		},
		data() {
			return {
				showError: false,
				apiUrl: {
					renewalList: '/api/renewal/prompters',
					statuses: '/api/renewal/prompters/statuses',
				},
				feedback: '',
				status: '',
				date: '',
				currentDate: new Date(),
				err: [],
			};
		},

		methods: {
			closeModal() {
				this.$emit('close');
			},

			async submitStatus() {
				try {
					if (this.feedback === '' || !this.status) {
						this.showError = true;
					}
					let data = {
						order_id: this.modalItem?.id,
						renewal_prompter_status_id: this.status?.id,
						feedback: this.feedback,
					};
					this.status?.name === 'interested'
						? (data.promised_date = this.date)
						: '';

					this.$LIPS(true);

					let response = await post(this.apiUrl.renewalList, data).catch(
						(err) => {
							if (err.response) {
								this.err.push('Missing fields!!!');
								this.$swal({
									icon: 'error',
									title: err.response.data.message,
								});
							}
						}
					);

					if (response.data.status === 'success') {
						this.showError = false;
						this.$swal({
							icon: 'success',
							title: 'Logged feedback successfully',
						});
						this.$root.$emit('feedback', this.status.name);
					}
					this.closeModal();
				} catch (e) {
					console.log(e);
				} finally {
					this.$LIPS(false);
					this.$prepareUncontacted();
				}
			},
			disabledRange: function(date) {
				return date < new Date();
			},
		},
	};
</script>

<style lang="scss" scoped></style>
