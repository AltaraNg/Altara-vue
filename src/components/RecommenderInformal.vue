<template>
	<div style="margin-left: 5rem; margin-right: 5rem;">
		<AutocompleteSearch
				title="Informal Recommendation Service"
				@customer-selected="processForm"
				:url="'/api/customer/autocomplete'"
			/>
		<form-wizard
			@on-complete="logAmounts()"
			title="Fill Form to know recommended plan"
			subtitle=""
			color="#2975A5"
			error-color="#FF0000"
			v-if="customer"
		>

			<tab-content title="Plan Details" :before-change="beforeTabSwitch1">
				<div class="row">

					<div class="col form-group">
						<label for="amount" class="form-control-label"
							>Customer Type</label
						>
						<select
							class="custom-select w-100"
							v-model="customer_type"
							v-validate="'required'"
						>							
							<option
								value="new_customer"							
							>
								New Customer
							</option>

							<option
								value="renewal"							
							>
								Renewal
							</option>
						</select>
					</div>
					<div class="col form-group">
						
					</div>

					

                </div>


				<div class="row">

					<div class="col form-group">
						<label for="custom-date" class="form-control-label"
							>Total Product Price
						</label>
						<!-- <input
							class="form-control w-100"
							type="number"
							min="1"
							max="31"
							v-model="form1[0]"
						/> -->
						<currency-input :options=" inputOptions" v-model="form1[0]"  class="form-control w-100" />
					</div>
					<div class="col form-group">
						<label for="amount" class="form-control-label"
							>Downpayment Rates</label
						>
						<select
							class="custom-select w-100"
							v-model="form1[1]"
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

					

                </div>

                <div class="row">

					<div class="col form-group">
						<label for="amount" class="form-control-label"
							>Repayment Cycle</label
						>
						<select
							class="custom-select w-100"
							v-model="form1[3]"
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
						<label for="amount" class="form-control-label"
							>Repayment Duration</label
						>
						<select
							class="custom-select w-100"
							v-model="form1[2]"
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
			</tab-content>
			<tab-content title="1st Month" :before-change="beforeTabSwitch2">				
				<div class="row">
					<div class="col form-group">
						<label for="7th-day" class="form-control-label"
							>Max Balance (6th, 7th, 8th)
						</label>
						<currency-input :options="inputOptions" v-model="form2[0]" class="form-control w-100" />
					</div>
					<div class="col form-group">
						<label for="14th-day" class="form-control-label"
							>Max Balance (13th, 14th, 15th)
						</label>
						<currency-input :options=" inputOptions" v-model="form2[1]" class="form-control w-100" />
					</div>
				</div>
				<br />
				<div class="row">
					<div class="col form-group">
						<label for="21st-day" class="form-control-label"
							>Max Balance (20th, 21st, 22nd)
						</label>
						<currency-input :options="inputOptions" v-model="form2[2]" class="form-control w-100" />
					</div>
					<div class="col form-group">
						<label for="28th-day" class="form-control-label"
							>Max Balance (27th, 28th, 29th)
						</label>
						<currency-input :options="inputOptions" v-model="form2[3]" class="form-control w-100" />
					</div>
				</div>
			</tab-content>
			<tab-content title="2nd Month" :before-change="beforeTabSwitch3">
				<div class="row">
					<div class="col form-group">
						<label for="custom-date" class="form-control-label"
							>Max Balance (6th, 7th, 8th)
						</label>
						<currency-input :options="inputOptions" v-model="form3[0]" class="form-control w-100" />
					</div>
					<div class="col form-group">
						<label for="custom-date" class="form-control-label"
							>Max Balance (13th, 14th, 15th)
						</label>
						<currency-input :options="inputOptions" v-model="form3[1]" class="form-control w-100" />
					</div>
				</div>
				<br />
				<div class="row">
					<div class="col form-group">
						<label for="custom-date" class="form-control-label"
							>Max Balance (20th, 21st, 22nd)
						</label>
						<currency-input :options="inputOptions" v-model="form3[2]" class="form-control w-100" />
					</div>
					<div class="col form-group">
						<label for="custom-date" class="form-control-label"
							>Max Balance (27th, 28th, 29th)
						</label>
						<currency-input :options="inputOptions" v-model="form3[3]" class="form-control w-100" />
					</div>
				</div>
			</tab-content>
			<tab-content title="3rd Month" :before-change="beforeTabSwitch4">
				<div class="row">
					<div class="col form-group">
						<label for="custom-date" class="form-control-label"
							>Max Balance (6th, 7th, 8th)
						</label>
						<currency-input :options="inputOptions" v-model="form4[0]" class="form-control w-100" />
					</div>
					<div class="col form-group">
						<label for="custom-date" class="form-control-label"
							>Max Balance (13th, 14th, 15th)
						</label>
						<currency-input :options="inputOptions" v-model="form4[1]" class="form-control w-100" />
					</div>
				</div>
				<br />
				<div class="row">
					<div class="col form-group">
						<label for="custom-date" class="form-control-label"
							>Max Balance (20th, 21st, 22nd)
						</label>
						<currency-input :options="inputOptions" v-model="form4[2]" class="form-control w-100" />
					</div>
					<div class="col form-group">
						<label for="custom-date" class="form-control-label"
							>Max Balance (27th, 28th, 29th)
						</label>
						<currency-input :options="inputOptions" v-model="form4[3]" class="form-control w-100" />
					</div>
				</div>
			</tab-content>
		</form-wizard>
	</div>
</template>

<script>
	import { get, post } from "../utilities/api";
	import { mapGetters } from "vuex";
	import { FormWizard, TabContent } from "vue-form-wizard";
	import "vue-form-wizard/dist/vue-form-wizard.min.css";
	import CurrencyInput from "./CurrencyInput.vue";
import Flash from "../utilities/flash";
import downPaymentSort from "../utilities/downPayment.js"
import AutocompleteSearch from "../components/AutocompleteSearch/AutocompleteSearch.vue"
	//component code

	export default {

	    components: {
	        FormWizard,
	        TabContent,
			CurrencyInput,
			AutocompleteSearch,
CurrencyInput
	    },
	    data() {
	        return {
				inputOptions: {
					currency: 'NGN',
        			currencyDisplay: 'symbol',
        			hideCurrencySymbolOnFocus: false,
        			hideGroupingSeparatorOnFocus: false,
        			hideNegligibleDecimalDigitsOnFocus: true,
        			autoDecimalDigits: false,
        			useGrouping: true,
        			accountingSign: false,
				},
	            error: {},
	            product: "",
	            salesLogForm: {},
	            form1: [],
	            form2: [],
	            form3: [],
				form4: [],
	            balances: [],
	            next1: false,
	            next2: false,
	            next3: false,
	            next4: false,

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
                businessTypes: [],
				customer_type: '',
				customer:null
	        };
	    },
	    async mounted() {
			await this.getRepaymentCycles();
			await this.getDownPaymentRates();
			await this.getRepaymentDuration();
            await this.getBusinessTypes();
		},

	    methods: {
			processForm(id) {
				this.$LIPS(true);
				get(`/api/customer/lookup/${id}`)
					.then((res) => {
						this.customer = res.data.customer[0]
						this.$LIPS(false);
					})
					.catch((e) => {
						this.$LIPS(false);
						Flash.setError('Error Fetching customer detail');
					});
			},
	        isDisable1() {
	            if (
	                !this.form1[0] ||
	                !this.form1[1] ||
	                !this.form1[2] ||
	                !this.form1[3]
					
	            ) {
	                this.next1 = false;
	            } else this.next1 = true;
	        },
	        isDisable2() {
	            if (
	                !this.form2[0] ||
	                !this.form2[1] ||
	                !this.form2[2] ||
	                !this.form2[3]
	            ) {
	                this.next2 = false;
	            } else this.next2 = true;
	        },
	        isDisable3() {
	            if (
	                !this.form3[0] ||
	                !this.form3[1] ||
	                !this.form3[2] ||
	                !this.form3[3]
	            ) {
	                this.next3 = false;
	            } else this.next3 = true;
	        },

			isDisable4() {
	            if (
	                !this.form4[0] ||
	                !this.form4[1] ||
	                !this.form4[2] ||
	                !this.form4[3]
	            ) {
	                this.next4 = false;
	            } else this.next4 = true;
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
					 return this.downPaymentRates.sort(downPaymentSort);
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
	                            "This is a custom validation error message. Click next again to get rid of the validation"
	                        );
	                    } else {
	                        this.count = 0;
	                    }
	                };
	            });
	        },
	        onComplete: function() {
	            
	        },
	        beforeTabSwitch1: function() {
	            this.isDisable1();
	            return this.next1;
	        },
	        beforeTabSwitch2: function() {
	            this.isDisable2();
	            return this.next2;
	        },
	        beforeTabSwitch3: function() {
	            this.isDisable3();
	            return this.next3;
	        },
			beforeTabSwitch4: function() {
	            this.isDisable4();
	            return this.next4;
	        },
	        async logAmounts() {
	            const data = { 
                    balances: [this.form2, this.form3, this.form4], 
                    type: 'informal', 
                    total_price: this.form1[0] ,
					plan_id: this.form1[1],
					duration: this.form1[2],
					cycle: this.form1[3],
					customer_type: this.customer_type,
					customer_id : this.customer.id
                    };
	            this.$validator.validateAll().then(result => {
	                if (result) {
	                    this.$LIPS(true);
	                    post(this.apiUrls.recommend, data)
	                        .then(res => {
	                            this.$LIPS(false);
								console.log(data);
	                            const resData = res.data.data.ans;
	                            resData === 'There is no suitable plan'
                                ? this.$swal({
                                      icon: "error",
                                      title: "No Plan available",
                                      text: `Try a lower total price`
                                  })
                                : this.$swal({
                                      icon: 'success',
											title: resData[1] === 0 ? `The minimum recommended plan is ${resData[0]}%`: `The minimum recommended plan is ${resData[0]}% + ${resData[1]} repayment`,
											text: "Recommendation Successful"
                                  });
	                        })
	                        .catch(() => {
	                            this.$LIPS(false);
	                            Flash.setError("Error submitting form");
	                        });
	                } else this.$networkErr("form");
	            });
	        }
	    }
	};
</script>
