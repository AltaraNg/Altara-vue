<template>
    <div style="margin-left: 5rem; margin-right: 5rem;">
        <form-wizard
            @on-complete="logAmounts()"
            title="Get to know your best plan!!"
            subtitle=""
            color="#2975A5"
            error-color="#FF0000"
            shape="square"
        >
            <tab-content title="Customer Type" :before-change="beforeTabSwitch1">
                <div class="row">
                    <div class="form-group center mt-3 mx-auto">
                        <label for="customer-type" class="form-control-label"
                            >Select Customer Type
                        </label>
                        <select name="customer-type" id="customer-type" class="custom-select w-100 h-100" v-model="form1[0]">
                            <option value="formal" class="text-">Formal</option>
                            <option value="informal">Informal</option>

                        </select>
                        </select>
                    </div>
                    
                </div>
                           
            </tab-content>
            <tab-content title="Plan Details" :before-change="beforeTabSwitch2">
                <div  v-if="form1[0] === 'formal'">
                <div class="row">
                    <div class="col form-group">
                        <label for="custom-date" class="form-control-label"
                            >Product Price
                        </label>
                        <input
                            class="form-control w-100"
                            type="number"
                            min="1"
                            max="31"
                            v-model="form2[0]"
                        />
                    </div>
                    <div class="col form-group">
                        <label for="custom-date" class="form-control-label"
                            >Salary
                        </label>
                         <input
                            class="form-control w-100"
                            type="number"
                            min="1"
                            max="31"
                            v-model="form2[1]"
                        />
                    </div>
                </div>
                <br />
                <div class="row">
                    <div class="col form-group">
                        <label for="custom-date" class="form-control-label"
                            >Downpayment
                        </label>
                        <input
                            class="form-control w-100"
                            type="number"
                            min="1"
                            max="31"
                            v-model="form2[2]"
                        />
                    </div>
                    <div class="col form-group">
                        <label for="custom-date" class="form-control-label"
                            >% Plan
                        </label>
                        <input
                            class="form-control w-100"
                            type="number"
                            min="1"
                            max="31"
                            v-model="form2[3]"
                        />
                    </div>
                </div>
                </div>
                <div v-else-if="form1[0] === 'informal'">
                    <div class="row">
                    <div class="col form-group">
                        <label for="custom-date" class="form-control-label"
                            >Account Balance
                        </label>
                        </label>
                        <input
                            class="form-control w-100"
                            type="number"
                            min="1"
                            max="31"
                            v-model="form2[0]"
                        />
                    </div>
                    <div class="col form-group">
                        <label for="custom-date" class="form-control-label"
                            >Repayment Plan
                        </label>
                        <select name="plan" id="plan">
                            <option value=""></option>
                        </select>
                    </div>
                </div>
                <br />
                <div class="row">
                    <div class="col form-group">
                        <label for="custom-date" class="form-control-label"
                            >Plan Duration
                        </label>
                        <input
                            class="form-control w-100"
                            type="number"
                            min="1"
                            max="31"
                            v-model="form2[2]"
                        />
                    </div>
                    <div class="col form-group">
                        <label for="custom-date" class="form-control-label"
                            >% Plan
                        </label>
                        <input
                            class="form-control w-100"
                            type="number"
                            min="1"
                            max="31"
                            v-model="form2[3]"
                        />
                    </div>
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
//component code

export default {
    
    components: {
        FormWizard,
        TabContent
    },
    data() {
        return {
            error: {},
            product: "",
            salesLogForm: {},
            form1: [],
            form2: [],
            form3: [],
            balances: [],
            next1: false,
            next2: false,
            next3: false,
            apiUrls: {
                recommend: `/api/recommendation`
            },
            formData: {}
        };
    },
    async mounted() {},
    computed: {
        // ...mapGetters(["getPaymentMethods"])
    },
    methods: {
        isDisable1() {
            if (
                !this.form1[0]               
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
       
        async logAmounts() {
            this.formData.down_payment = this.form2[2];
            this.formData.total_price = this.form2[0];
            this.formData.salary = this.form2[1];

            const data = { balances: [this.form1, this.form2, this.form3] };
            this.$validator.validateAll().then(result => {
                if (result) {
                    this.$LIPS(true);
                    post(this.apiUrls.recommend, this.formData)
                        .then(res => {
                            this.$LIPS(false);
                            const resData = res.data.data.ans;
                            

                            resData === 'There is no suitable plan'
                                ? this.$swal({
                                      icon: "error",
                                      title: "No Plan available",
                                      text: `Try a lower total price`
                                  })
                                : this.$swal({
                                      icon: "success",
                                      title: "Recommendation successful.",
                                      text: resData
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