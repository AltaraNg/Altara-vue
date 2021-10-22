<template>
	<div>
		<div class="modal-header py-2">
			<h4>Update Customer Renewal</h4>
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
			<div v-if="err.length > 0" class="small text-danger">
				{{err[0]}}
			</div>
			<div class="table-responsive">
				<table class="table table-bordered table-striped">
					<tbody>
						<tr>
							<th>Order Number</th>
							<td>{{ modalItem.order_number || 'Not Available' }}</td>
						</tr>
						<tr>
							<th>Customer Name</th>
							<td>
								{{
									`${modalItem.customer.first_name} ${modalItem.customer.last_name}` ||
										'Not Available'
								}}
							</td>
						</tr>
						<tr>
							<th>Status</th>
							<td>
								<select
									v-model="status"
									name="status"
									class="form-control"
									required
								>
									<option selected disabled value="">--select status--</option>
									<option v-for="status in statuses" :value="status">
										{{ status.name | capitalize }}
									</option>
								</select>
							</td>
						</tr>

						<tr>
							<th>Feedback</th>
							<td>
								<input
									type="text"
									v-model="feedback"
									class="form-control"
									placeholder="Enter Feedback"
									required
								/>
							</td>
						</tr>
						<tr v-if="status.name === 'interested'">
							<th class="my-auto pt-2">Promise Date</th>
							<td>
								<date-picker
									class="w-100"
									v-model="date"
									valueType="format"
									placeholder="Date"
									:disabled-date="disabledRange"
								></date-picker>
							</td>
						</tr>
					</tbody>
				</table>
				<div>
					<input
						type="submit"
						value="Submit"
						@click="submitStatus"
						class="bg-success text-white float-right p-2 h5"
					/>
				</div>
			</div>
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
		},
		data() {
			return {
				statuses: [],
				apiUrl: {
					renewalList: '/api/renewal/prompters',
					statuses: '/api/renewal/prompters/statuses',
				},
				feedback: '',
				status: '',
				date: '',
				currentDate: new Date(),
				err: []
			};
		},
		beforeMount() {
			this.getRenewalStatuses();
		},
		methods: {
			closeModal() {
				this.$emit('close');
			},
			async getRenewalStatuses() {
				this.$LIPS(true);
				let statuses = await get(this.apiUrl?.statuses);
				this.statuses = statuses.data?.data?.prompter_statuses;
				this.statuses = this.statuses.filter(item => {
					return item.name !== 'not contacted'
				})
				this.$LIPS(false);
			},

			async submitStatus() {
				try {
					let data = {
						order_id: this.modalItem?.id,
						renewal_prompter_status_id: this.status?.id,
						feedback: this.feedback,
					};
					this.status?.name === 'interested'
						? (data.promised_date = this.date)
						: '';

					this.$LIPS(true);

					let response = await post(this.apiUrl.renewalList, data);
					if (response.data.status === 'success') {
						this.$swal({
							icon: 'success',
							title: 'Logged feedback successfully',
						});
						this.$root.$emit('feedback', this.status.name);
					}
					this.closeModal();
				} catch (res) {
					this.err.push(res)
				} finally {
					this.$LIPS(false);
				}
			},
			disabledRange: function(date) {
				return date < new Date();
			},
		},
	};
</script>

<style lang="scss" scoped></style>
