<template>
  <div style="margin-left: 5rem; margin-right: 5rem">
    <div class="row">
      <div class="col-md">
        <div class="card">
          <form class="card-body" @submit.prevent="previewAmortization">
            <div class="row">
              <div class="form-group align-self-left text-capitalize col">
                <label for="amount" class="form-control-label w-100"
                  >Product Name
                  <span class="serial" @click="toggleSerial()"
                    >{{ serial === true ? "Remove" : "Add" }} serial
                    number</span
                  >
                  <span :class="{ renewal: eligible }" v-if="eligible"
                    >Entitled to renewal discount!!!</span
                  >
                </label>
                <AutoComplete
                  v-on:childToParent="selectedItem"
                  :apiUrl="apiUrls.getProduct"
                />
              </div>

              <div class="col form-group" v-if="serial">
                <label for="amount" class="form-control-label w-100"
                  >Serial number (Optional)</label
                >
                <input
                  v-model="salesLogForm.serial_number"
                  name="serial number"
                  class="custom-select w-100"
                />
              </div>

              <div class="col form-group">
                <label for="amount" class="form-control-label"
               >Sales Category</label
                >
                <select
                  @change="getUsers(salesLogForm.sales_category_id)"
                  class="custom-select w-100"
                  v-model="salesLogForm.sales_category_id"
                  v-validate="'required'"
                >
                  <option disabled selected="selected">Sales Category</option>
                  <option
                    :value="type.id"
                    :key="type.id"
                    v-for="type in salesCategories"
                  >
                    {{ type.name }}
                  </option>
                </select>
              </div>

              <div class="col form-group">
                <label for="amount" class="form-control-label">Owner</label>
                <select
                  class="custom-select w-100"
                  v-model="salesLogForm.owner_id"
                  v-validate="'required'"
                >
                  <option disabled selected="selected">Owner</option>
                  <option selected="selected" value="">None</option>
                  <option :value="user.id" :key="user.id" v-for="user in users">
                    {{ user.full_name }}
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
                  v-model="salesLogForm.repayment_cycle_id"
                  v-validate="'required'"
                  @change="customDate($event)"
                >
                  <option disabled selected="selected">Repayment Cycle</option>
                  <option
                    :value="type"
                    :key="type.id"
                    v-for="type in repaymentCyclesopt"
                  >
                    {{ type.name }}
                  </option>
                </select>
              </div>
              <div v-if="customDateToggle" class="col form-group">
                <label for="custom-date" class="form-control-label"
                  >Custom Date</label
                >
                <input
                  class="form-control w-100"
                  type="number"
                  min="1"
                  max="31"
                  v-model="salesLogForm.custom_date"
                  v-validate="'required'"
                />
              </div>
              <div class="col form-group">
                <label for="amount" class="form-control-label"
                  >Repayment Duration</label
                >
                <select
                  @change="getCalc()"
                  class="custom-select w-100"
                  v-model="salesLogForm.repayment_duration_id"
                  v-validate="'required'"
                >
                  <option disabled selected="selected">
                    Repayment Duration
                  </option>
                  <option
                    :value="type"
                    :key="type.id"
                    v-for="type in repaymentDuration"
                  >
                    {{ type.name }}
                  </option>
                </select>
              </div>

               <div class="col form-group">
                <label for="amount" class="form-control-label"
                  >Downpayment Rates</label
                >
                <select
                  class="custom-select w-100"
                  v-model="salesLogForm.payment_type_id"
                  v-validate="'required'"
                  @change="getCalc()"
                >
                  <option disabled selected="selected">
                    Downpayment Rates
                  </option>
                  <option
                    :value="type"
                    :key="type.id"
                    v-for="type in getdownPaymentRates"
                  >
                    {{ type.name }}
                  </option>
                </select>
              </div> 
              <div class="col form-group">
                <label for="amount" class="form-control-label"
                  >Business Type</label
                >
                <select
                  class="custom-select w-100"
                  v-model="salesLogForm.business_type_id"
                  v-validate="'required'"
                  @change="getCalc()"
                >
                  <option disabled selected="selected">Business Type</option>
                  <option
                    :value="type.id"
                    :key="type.id"
                    v-for="type in businessTypes"
                  >
                    {{ type.name }}
                  </option>
                </select>
              </div>
              <div class="col form-group">
                <label for="amount" class="form-control-label"
                  >Payment Method</label
                >
                <select
                  class="custom-select w-100"
                  v-model="salesLogForm.payment_method_id"
                  v-validate="'required'"
                  @change="getCalc()"
                >
                  <option disabled selected="selected">Payment Method</option>
                  <option
                    :value="type.id"
                    :key="type.id"
                    v-for="type in getPaymentMethods.filter(
                      (element) => element.name !== 'direct-debit'
                    )"
                  >
                    {{ type.name }}
                  </option>
                </select>
              </div>
              <div class="col form-group">
                <label for="amount" class="form-control-label">Bank</label>
                <select
                  class="custom-select w-100"
                  v-model="salesLogForm.bank_id"
                  v-validate="'required'"
                  @change="getCalc()"
                >
                  <option disabled selected="selected">Bank</option>
                  <option
                    :value="type.id"
                    :key="type.id"
                    v-for="type in getBanks"
                  >
                    {{ type.name }}
                  </option>
                </select>
              </div>
              <!-- <div class="col form-group">
                    <label for="amount" class="form-control-label">Down Payment</label>
                    <input class="w-100 custom-select" name="amount" v-model="salesLogForm.down_payment" v-validate="'required'" type="number" placeholder="Enter Amount"/>
              </div>-->
            </div>
            <br />
            <div class="text-center">
              <button
                class="btn bg-default"
                :disabled="test1"
                type="submit"
                v-on:click="getCalc()"
              >
                View Amortization
              </button>
              <br />
            </div>
          </form>
        </div>
      </div>
      <div v-if="!test0" class="col-md-4">
        <div class="card">
          <div class="card-body">
            <h5 class="mt-3 mb-0">Order Information</h5>

            <table class="table table-bordered">
              <tbody class="text-center">
                <tr class="table-separator">
                  <th>Product Name</th>
                  <td>{{ selectedProduct.product_name }}</td>
                </tr>

                <tr class="table-separator">
                  <th>Product Price</th>
                  <td>{{ $formatCurrency(pPrice) }}</td>
                </tr>
                <tr class="table-separator">
                  <th>First Payment</th>
                  <td>{{ $formatCurrency(fPayment) }}</td>
                </tr>

                <tr class="table-separator repayment">
                  <th>Repayment</th>
                  <td class="">{{ $formatCurrency(rPayment) }}<span class="" v-if="renewalState && flag == 'beta' "><img class="discount" src="../assets/css/svgs/discount.png"/></span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    <div class="modal fade repayment" id="amortizationPreview">
      <div class="modal-dialog modal-xl" role="document">
        <div class="modal-content">
          <div class="modal-header py-2">
            <h6 class="modal-title py-1">Repayment Plan/Summary</h6>
            <a aria-label="Close" class="close py-1" data-dismiss="modal">
              <span aria-hidden="true" class="modal-close text-danger">
                <i class="fas fa-times"></i>
              </span>
            </a>
          </div>
          <div class="modal-body">
            <div class="table-responsive">
              <h5 class="mt-3 mb-0">Order Information</h5>
              <table class="table table-bordered">
                <tbody>
                  <tr class="table-separator">
                    <!-- <td>Customer ID</td> -->
                    <td>Product Name</td>
                    <td>Product Price</td>
                    <td>First Payment</td>
                    <td>Repayment</td>
                    <!-- <th>Branch</th> -->
                  </tr>
                  <tr>
                    <!-- <td class="font-weight-bold">{{this.customerId}}</td> -->
                    <th>
                      {{ this.selectedProduct.product_name }}
                    </th>
                    <th>{{ $formatCurrency(pPrice) }}</th>
                    <th>{{ $formatCurrency(fPayment) }}</th>
                    <th>{{ $formatCurrency(rPayment) }}<span class="" v-if="renewalState && flag == 'beta'"><img class="modal_discount" src="../assets/css/svgs/discount.png"/></span></th>
                    <!-- <td class="font-weight-bold">Ikoyi</td> -->
                  </tr>
                </tbody>
              </table>

              <h5 class="mt-5 mb-0">Amortization Schedule</h5>
              <div class="payment-table">
                <table class="table table-bordered">
                  <tbody class="text-center">
                    <tr class="table-separator">
                      <th>Due Date</th>
                      <td v-for="(am, index) in amortization" :key="index">
                        {{ am.expected_payment_date }}
                      </td>
                    </tr>

                    <tr class="table-separator">
                      <th>Repayment Amount</th>
                      <td v-for="(am, index) in amortization" :key="index">
                        {{ $formatCurrency(am.expected_amount) }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div class="text-center">
            <button class="btn bg-default" @click="logSale()" type="submit">
              Log Sale
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { get, post } from "../utilities/api";
import { mapGetters } from "vuex";
import AutoComplete from "./AutoComplete.vue";
import calculate from "../utilities/calculator";
import Flash from "../utilities/flash";

export default {
  props: { customerId: null, customer: null },
  components: { AutoComplete },
  data() {
    return {
      error: {},
      users: [],
      product: "",
      salesLogForm: {},
      repaymentDuration: [],
      repaymentCyclesopt: [],
      downPaymentRates: [],
      orderTypes: [],
      businessTypes: [],
      amortization: [],
      calculation: [],
      salesCategories: [],
      test0: true,
      test1: true,
      apiUrls: {
        repaymentDuration: `/api/repayment_duration`,
        orderType: `/api/order-types`,
        repaymentCycles: `/api/repayment_cycle`,
        downPaymentRates: `/api/down_payment_rate`,
        businessTypes: `/api/business_type`,
        previewAmortization: `/api/amortization/preview`,
        createOrder: `/api/new_order`,
        getCalculation: `/api/price_calculator`,
        getProduct: `/api/inventory`,
        discounts: `/api/discount`,
        salesCategoryUrl: `/api/sales_category`,
      },
      inputValue: "",
      selectedProduct: {},
      fPayment: "",
      pPrice: "",
      rPayment: "",
      newRepayment:"",
      repaymentCircle: "",
      rDuration: "",
      customDateToggle: false,
      discounts: null,
      eligible: false,
      serial: false,
      renewalState:false,
			flag:localStorage.getItem("flag")
    };
  },
  async mounted() {
    this.watchSalesLogForm()
    this.checkIfDiscountElig();
    await this.getRepaymentDuration();
    await this.getSalesCategory();
    await this.getRepaymentCycles();
    await this.getDownPaymentRates();
    await this.getBusinessTypes();
    await this.getCalculation();
    await this.getDiscounts();
    await this.getOrderTypes();
  },
  watch:{
      'salesLogForm.sales_category_id':function(newData, oldData){
      this.watchSalesLogForm(newData)
      }
  },
  computed: {
    ...mapGetters(["getPaymentMethods", "getBanks"]),
    getdownPaymentRates(){
      return this.downPaymentRates.filter((item)=>{
        return !(item.name.includes('plus')) 
        
      })
    }
  },

  methods: {
    watchSalesLogForm(){
      if(this.salesLogForm.sales_category_id == "2"){
        this.renewalState = true
      }else{
        this.renewalState = false
      }
    },
    customDate(event) {
      this.salesLogForm.repayment_cycle_id.name === "custom"
        ? (this.customDateToggle = true)
        : (this.customDateToggle = false);

      this.getCalc();
    },
    async logSale() {
      this.salesLogForm.customer_id = this.customerId;
      let renewal = "";
      this.eligible
        ? (renewal = this.discounts.find((item) => {
            return item.name === "renewal";
          }).id)
        : (renewal = "");
        let orderType = this.orderTypes.find((item) => {
          return item.name === 'Altara Credit';
        })
      const data = {
        order_type_id: orderType.id,
        customer_id: this.customerId,
        inventory_id: this.selectedProduct.id,
        repayment_duration_id: this.salesLogForm.repayment_duration_id.id,
        repayment_cycle_id: this.salesLogForm.repayment_cycle_id.id,
        business_type_id: this.salesLogForm.business_type_id,
        branch_id: localStorage.getItem("branch_id"),
        down_payment: this.fPayment,
        custom_date: this.salesLogForm.custom_date,
        repayment: this.rPayment,
        bank_id: this.salesLogForm.bank_id,
        product_price: this.$formatMoney(this.pPrice),
        down_payment_rate_id: this.salesLogForm.payment_type_id.id,
        payment_type_id: this.salesLogForm.payment_type_id.id,
        payment_method_id: this.salesLogForm.payment_method_id,
        sales_category_id: this.salesLogForm.sales_category_id,
        owner_id: this.salesLogForm.owner_id,
        serial_number: this.salesLogForm.serial_number,
      };
      if (this.eligible) {
        data.discount = [renewal];
      }
      this.$validator.validateAll().then((result) => {
        if (result) {
          this.$LIPS(true);
          post(this.apiUrls.createOrder, data)
            .then((res) => {
              this.$LIPS(false);
              $(`#amortizationPreview`).modal("toggle");

              this.$swal({
                icon: "success",
                title: "Sale Successfully Logged",
              });
              this.$emit("done");
            })
            .catch(() => {
              this.$LIPS(false);
              Flash.setError("Error: " + err.message);
            });
        } else this.$networkErr("form");
      });
    },
    async previewAmortization() {
      this.salesLogForm.customer_id = this.customerId;
      const data = {
        customer_id: this.customerId,
        inventory_id: this.selectedProduct.id,
        repayment_duration_id: this.salesLogForm.repayment_duration_id.id,
        repayment_cycle_id: this.salesLogForm.repayment_cycle_id.id,
        business_type_id: this.salesLogForm.business_type_id,
        branch_id: localStorage.getItem("branch_id"),
        down_payment: this.$formatMoney(this.fPayment),
        down_payment_rate_id: this.salesLogForm.payment_type_id.id,
        custom_date: this.salesLogForm.custom_date,
        repayment: this.$formatMoney(this.rPayment),
        bank_id: this.salesLogForm.bank_id,
        product_price: this.$formatMoney(this.pPrice),
        payment_type_id: this.salesLogForm.payment_type_id.id,
        payment_method_id: this.salesLogForm.payment_method_id,
        sales_category_id: this.salesLogForm.sales_category_id,
        owner_id: this.salesLogForm.owner_id,
      };
      this.salesLogForm.serial_number !== null
        ? (data.serial_number = this.salesLogForm.serial_number)
        : "";
      this.$validator.validateAll().then((result) => {
        if (result) {
          this.$LIPS(true);
          post(this.apiUrls.previewAmortization, data)
            .then((res) => {
              this.$LIPS(false);
              this.amortization = res.data.data;
              $(`#amortizationPreview`).modal("toggle");
            })
            .catch((err) => {
              this.$LIPS(false);
              Flash.setError("Error: " + err.message);
            });
        } else this.$networkErr("form");
      });
    },

    async getRepaymentDuration() {
      try {
        const fetchRepaymentDuration = await get(
          this.apiUrls.repaymentDuration
        );
        this.repaymentDuration = fetchRepaymentDuration.data.data.data;
      } catch (err) {
        this.$displayErrorMessage(err);
      }
    },
    getCalc() {
      try {
        this.salesLogForm.customer_id = this.customerId;
        const data0 = {
          ...this.salesLogForm,
          ...{
            branch_id: localStorage.getItem("branch_id"),
            status_id: 1,
          },
        };
       

        const caly = this.calculation;
        const data = caly.filter(
          (x) =>
            x.business_type_id === data0.business_type_id &&
            x.down_payment_rate_id === data0.payment_type_id.id &&
            x.repayment_duration_id === data0.repayment_duration_id.id
        )[0];

        const { total, actualDownpayment, rePayment } = calculate(
          this.selectedProduct.price,
          data0,
          data
        );

        this.repaymentCircle = data0.repayment_cycle_id.value;
        this.rDuration = data0.repayment_duration_id.value;
        this.fPayment = actualDownpayment;
        this.rPayment = rePayment;
        this.pPrice = total;
        this.test1 = false;
       
        // $(`#amortizationPreview`).modal("toggle");
      } catch (e) {
        // this.$swal({
        //     icon: "error",
        //     title: "Plan is not available"
        // });
        this.test1 = true;
        this.repaymentCircle = "0";
        this.rDuration = "0";
        this.fPayment = "0";
        this.rPayment = "0";
        this.pPrice = "0";
      }
      // }
      // });
    },
    getRepaymentDate(count) {
      const paymentDate = this.repaymentCircle * count;
      const date = new Date();
      const newDate = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate() + paymentDate
      ).toLocaleDateString("en-US");
      return newDate;
    },
    preview() {
      // const plan = [];
      // const repaymentCount = this.rDuration / this.repaymentCircle;
      // for (let i = 1; i <= repaymentCount; i++) {
      //     plan.push({
      //         expected_payment_date: this.getRepaymentDate(i),
      //         expected_amount: this.rPayment
      //     });
      // }
      // this.amortization = plan;
      // this.submitForm();
    },
    async getCalculation() {
      try {
        const fetchGetCalclations = await get(this.apiUrls.getCalculation);

        const unwrapped = fetchGetCalclations.data.data;
        this.calculation = unwrapped;
        const unwrapped0 = JSON.stringify(unwrapped);
      } catch (err) {
        this.$displayErrorMessage(err);
      }
    },
    selectedItem(value) {
      this.selectedProduct = value;
      this.test0 = false;
      this.getCalc();
    },
    async getProduct() {
      try {
        const fetchProduct = await get(this.apiUrls.getProduct + this.product);
      } catch (err) {
        this.$displayErrorMessage(err);
      }
    },
    async getRepaymentCycles() {
      try {
        const fetchRepaymentCycles = await get(this.apiUrls.repaymentCycles);
        this.repaymentCyclesopt = fetchRepaymentCycles.data.data.data;
      } catch (err) {
        this.$displayErrorMessage(err);
      }
    },

    async getOrderTypes() {
      try {
        const orderTypes = await get(this.apiUrls.orderType);
        this.orderTypes = orderTypes.data.orderTypes;
      } catch (err) {
        this.$displayErrorMessage(err);
      }
    },
    async getDownPaymentRates() {
      try {
        const fetchDownPaymentRates = await get(this.apiUrls.downPaymentRates);
        this.downPaymentRates = fetchDownPaymentRates.data.data.data;
        this.downPaymentRates = this.downPaymentRates.sort((a, b) => {
						return a.percent-b.percent;
					});

        
      } catch (err) {
        this.$displayErrorMessage(err);
      }
    },
    async getSalesCategory() {
      try {
        const fetchSalesCategory = await get(this.apiUrls.salesCategoryUrl);
        this.salesCategories = fetchSalesCategory.data.data.data;
      } catch (err) {
        this.$displayErrorMessage(err);
      }
    },

        async getUsers(salesCat){
        this.getCalc()
        this.$LIPS(true);
          
          await get(`/api/sales-category/${salesCat}/roles`).then(res => {
            this.users = this.mergeArrays(res.data.data);
          });
          
          this.$LIPS(false);
        },
        mergeArrays(parent){
          let result = [];
          parent.forEach(elem => {
            result = result.concat(elem.active_users);
          })
          return result;
        },
        async getBusinessTypes() {
            try {
                const fetchBusinessTypes = await get(
                    this.apiUrls.businessTypes
                );
                this.businessTypes = fetchBusinessTypes.data.data.data;
                this.businessTypes = this.businessTypes.filter(item => {
                  return item.name.includes("Altara Credit")
                });
            } catch (err) {
                this.$displayErrorMessage(err);
            }
        },
        async getDiscounts(){
            try{
                const fetchDiscounts = await get(
                    this.apiUrls.discounts
                );
                this.discounts = fetchDiscounts.data.data.data;
            }catch(err){
                this.$displayErrorMessage(err);
            }
        },
    async getUsers(salesCat) {
      this.getCalc()
      this.$LIPS(true);

      await get(`/api/sales-category/${salesCat}/roles`).then((res) => {
        this.users = this.mergeArrays(res.data.data);
      });

      this.$LIPS(false);
    },
    mergeArrays(parent) {
      let result = [];
      parent.forEach((elem) => {
        result = result.concat(elem.users);
      });
      return result.sort((a, b) =>
        a["full_name"].localeCompare(b["full_name"])
      );
    },
    async getBusinessTypes() {
      try {
        const fetchBusinessTypes = await get(this.apiUrls.businessTypes);
        this.businessTypes = fetchBusinessTypes.data.data.data;
        this.businessTypes = this.businessTypes.filter((item) => {
          return item.name.includes("Altara Credit");
        });
      } catch (err) {
        this.$displayErrorMessage(err);
      }
    },
    async getDiscounts() {
      try {
        const fetchDiscounts = await get(this.apiUrls.discounts);
        this.discounts = fetchDiscounts.data.data.data;
      } catch (err) {
        this.$displayErrorMessage(err);
      }
    },

    checkIfDiscountElig() {
      if (this.customer.new_orders.length > 0) {
        let arrLength = this.customer.new_orders.length;
        if (
          this.calcDebt(
            this.customer.new_orders[arrLength - 1].amortization
          ) === 0
        ) {
          this.eligible = true;
        }
      }
    },
    calcDebt(amortization) {
      // I assumed that all repayments are uniform and are not varied
      if (amortization[0] !== undefined) {
        let res = amortization.filter((amor) => {
          return amor.actual_amount === 0;
        });
        return res.length * amortization[0].expected_amount;
      }
      return;
    },

    toggleSerial() {
      this.serial === true ? (this.serial = false) : (this.serial = true);
    },
  },
};
</script>

<style scoped>
.product {
  background: #f3f3f3;
  border: 1px solid #a4a5ab;
  box-sizing: border-box;
  border-radius: 5px;
  width: 70%;
  padding: 5px;
  margin: 50px !important;
}

.dropdown {
  position: relative;
  width: 100%;
  /* max-width: 400px; */
  margin: 0 auto;
}
.dropdown-input {
  width: 100%;
  padding: 10px 16px;
  border: 1px solid transparent;
  background: #edf2f7;
  line-height: 1.5em;
  outline: none;
  border-radius: 8px;
}
.dropdown-input:focus {
  background: #fff;
  border-color: #e2e8f0;
}
.dropdown-input::placeholder {
  opacity: 0.7;
}
.payment-table {
  width: 1092px;
  overflow: scroll;
}
.renewal {
  color: forestgreen;
  display: block;
  float: right;
}
.serial {
  font-size: 8px;
  display: block;
  float: right;
  text-decoration: underline;
}
.discount{
  width:60px;
  height:auto;
  position: absolute;
  bottom: 18px;
  right:1
}
.modal_discount{
  width:60px;
  height:auto;
  padding-left:3px;
}

</style>