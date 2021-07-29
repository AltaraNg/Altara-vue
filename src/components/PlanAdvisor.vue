<template>
	<div style="margin-left: 5rem; margin-right: 5rem">
		<form-wizard
			@on-complete="logAmounts()"
			title="Get to know your best plan!!"
			subtitle=""
			color="#2975A5"
			error-color="#FF0000"
			shape="square"
		>
			<tab-content title="Customer Details" :before-change="beforeTabSwitch1">
				<div class="row">
					<div class="col form-group">
						<label for="custom-date" class="form-control-label"
							>Total Amount To Spend
						</label>
						<input
							class="form-control w-100"
							type="number"
							min="1"
							max="31"
							v-model="form1[0]"
						/>
					</div>

					<div class="col form-group">
						<label for="custom-date" class="form-control-label"
							>Monthly Salary
						</label>
						<input
							class="form-control w-100"
							type="number"
							min="1"
							max="31"
							v-model="form1[1]"
						/>
					</div>
				</div>
			</tab-content>
			<tab-content title="Plan Details" :before-change="beforeTabSwitch2">
				<div class="row">
					<div class="col form-group">
						<label for="amount" class="form-control-label"
							>Downpayment Rates</label
						>
						<select
							class="custom-select w-100"
							v-model="form2[0]"
							v-validate="'required'"
						>
							<option disabled selected="selected">Downpayment Rates</option>
							<option
								:value="type.id"
								:key="type.id"
								v-for="type in downPaymentRates"
							>
								{{ type.name }}
							</option>
						</select>
					</div>

					<div class="col form-group">
						<label for="amount" class="form-control-label"
							>Repayment Duration</label
						>
						<select
							class="custom-select w-100"
							v-model="form2[1]"
							v-validate="'required'"
						>
							<option disabled selected="selected">
								Repayment Duration
							</option>
							<option
								:value="type.id"
								:key="type.id"
								v-for="type in repaymentDuration"
							>
								{{ type.name }}
							</option>
						</select>
					</div>

                </div>

                <div class="row">

					<div class="col form-group">
						<label for="amount" class="form-control-label"
							>Repayment Cycle</label
						>
						<select
							class="custom-select w-100"
							v-model="form2[2]"
							v-validate="'required'"
						>
							<option disabled selected="selected">Repayment Cycle</option>
							<option
								:value="type.id"
								:key="type.id"
								v-for="type in repaymentCyclesopt"
							>
								{{ type.name }}
							</option>
						</select>
					</div>

					<div class="col form-group">
						
					</div>
				</div>
			</tab-content>
		</form-wizard>
	</div>
</template>

<script>
	import { get, post } from '../utilities/api';
	import { mapGetters } from 'vuex';
	import { FormWizard, TabContent } from 'vue-form-wizard';
	import 'vue-form-wizard/dist/vue-form-wizard.min.css';
	//component code

	export default {
		components: {
			FormWizard,
			TabContent,
		},
		data() {
			return {
				error: {},
				product: '',
				salesLogForm: {},
				form1: [],
				form2: [],
				form3: [],
				balances: [],
				next1: false,
				next2: false,
				next3: false,
				apiUrls: {
					recommend: `/api/recommendation`,
					repaymentDuration: `/api/repayment_duration`,
					repaymentCycles: `/api/repayment_cycle`,
					downPaymentRates: `/api/down_payment_rate`,
					businessTypes: `/api/business_type`,
				},
				formData: {},
				repaymentCyclesopt: [],
				downPaymentRates: [],
				repaymentDuration: [],
                businessTypes: []
			};
		},
		async mounted() {
			await this.getRepaymentCycles();
			await this.getDownPaymentRates();
			await this.getRepaymentDuration();
            await this.getBusinessTypes();
		},
		computed: {
			// ...mapGetters(["getPaymentMethods"])
		},
		methods: {
			isDisable1() {
				if (!this.form1[0]) {
					this.next1 = false;
				} else this.next1 = true;
			},
			isDisable2() {
				if (
					!this.form2[0] ||
					!this.form2[1] ||
					!this.form2[2] 
					
				) {
					this.next2 = false;
				} else this.next2 = true;
			},
			async getRepaymentCycles() {
				try {
					const fetchRepaymentCycles = await get(this.apiUrls.repaymentCycles);
					this.repaymentCyclesopt = fetchRepaymentCycles.data.data.data;
					this.repaymentCyclesopt = this.repaymentCyclesopt.filter((item) => {
						return item.name !== 'custom';
					});
				} catch (err) {
					this.$displayErrorMessage(err);
				}
			},
			async getDownPaymentRates() {
				try {
					const fetchDownPaymentRates = await get(
						this.apiUrls.downPaymentRates
					);
					this.downPaymentRates = fetchDownPaymentRates.data.data.data;
					this.downPaymentRates = this.downPaymentRates.filter((item) => {
						return item.name !== 'zero' && item.name !== 'ten';
					});
				} catch (err) {
					this.$displayErrorMessage(err);
				}
			},
			async getRepaymentDuration() {
				try {
					const fetchRepaymentDuration = await get(
						this.apiUrls.repaymentDuration
					);
					this.repaymentDuration = fetchRepaymentDuration.data.data.data;
					this.repaymentDuration = this.repaymentDuration.filter((item) => {
						return item.name !== 'nine_months' && item.name !== 'twelve_months';
					});
				} catch (err) {
					this.$displayErrorMessage(err);
				}
			},

			async getBusinessTypes() {
				try {
					const fetchBusinessTypes = await get(this.apiUrls.businessTypes);
					this.businessTypes = fetchBusinessTypes.data.data.data;
					this.businessTypes = this.businessTypes.filter((item) => {
						return item.name.includes('Products');
					});
				} catch (err) {
					this.$displayErrorMessage(err);
				}
			},

			validateAsync: function() {
				return new Promise((resolve, reject) => {
					() => {
						if (this.count < 1) {
							this.count++;
							reject(
								'This is a custom validation error message. Click next again to get rid of the validation'
							);
						} else {
							this.count = 0;
						}
					};
				});
			},
			onComplete: function() {},
			beforeTabSwitch1: function() {
				this.isDisable1();
				return this.next1;
			},
			beforeTabSwitch2: function() {
				this.isDisable2();
				return this.next2;
			},

			async logAmounts() {
				this.formData.total_price = this.form1[0];
				this.formData.salary = this.form1[1];
				this.formData.plan_id = this.form2[0];
				this.formData.duration = this.form2[1];
				this.formData.cycle = this.form2[2];				
				this.formData.type = 'formal';

				this.$validator.validateAll().then((result) => {
					if (result) {
						this.$LIPS(true);
						post(this.apiUrls.recommend, this.formData)
							.then((res) => {
								this.$LIPS(false);
								const resData = res.data.data.ans;

								resData === 'There is no suitable plan'
									? this.$swal({
											icon: 'error',
											title: 'No Plan available',
											text: `Try a lower total price`,
									  })
									: this.$swal({
											icon: 'success',
											title: resData[1] === 0 ? `The best plan is ${resData[0]}%`: `The best plan is ${resData[0]}% + ${resData[1]} repayment`,
											text: "Recommendation Successful"
									  });
							})
							.catch(() => {
								this.$LIPS(false);
								Flash.setError('Error submitting form');
							});
					} else this.$networkErr('form');
				});
			},
		},
	};
</script>
