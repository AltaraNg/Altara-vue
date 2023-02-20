<template>
  <div style="margin-left: 5rem; margin-right: 5rem">
    <div class="row">
      <div class="col-md">
        <div class="card">
          <form class="card-body" @submit.prevent="previewAmortization">
            <div class="text-center">
              <h2 class="mb-1">{{ compHeader }}</h2>
              <small class="text-danger" v-if="!allowBSSale">{{ noBSVerbiage }}</small>
            </div>
            <div class="row">
              <div
                class="col d-flex align-items-center"
                v-if="isAltaraPay && flag"
              >
                <toggle-button
                  v-on:valueChangedEvent="triggerToggleEvent"
                  :switchName="'Bank54'"
                  :key="'Bank54'"
                  :defaultState="isBank54"
                  :label="'Financed by Bank54'"
                />
              </div>

              <div class="col text-right">
                <button
                  class="btn btn-md "
                  @click="toggleProductType('ap')"
                  :class="[isAltaraPay ? 'bg-default' : 'btn-default']"
                  type="button"
                  v-if="customer.city !== ''"
                >
                  Altara Pay
                </button>
                <button
                  class="btn btn-md  mr-0"
                  @click="toggleProductType('ac')"
                  :class="[isAltaraCredit ? 'bg-default' : 'btn-default']"
                  type="button"
                  v-if="customer.city !== ''"
                >
                  Altara Credit
                </button>
                <button
                  class="btn btn-md  mr-0"
                  @click="toggleProductType('cnc')"
                  :class="[isCashNCarry ? 'bg-default' : 'btn-default']"
                  type="button"
                >
                  Cash N Carry
                </button>
              </div>
            </div>
            <div class="row">
              <div class="form-group align-self-left text-capitalize col">
                <label for="amount" class="form-control-label w-100">
                  Product Name
                  <span class="serial" @click="toggleSerial()">
                    {{ serial === true ? "Remove" : "Add" }} serial number
                  </span>
                  <span :class="{ renewal: eligible }" v-if="eligible"
                    >Entitled to renewal discount!!!</span
                  >
                </label>
                <AutoComplete
                  v-on:childToParent="selectedItem"
                  :apiUrl="apiUrls.getProduct"
                  ref="clearInputValue"
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

              <div class="col form-group" v-if="isAltaraPay" :class="commitment.status ? 'disable' :''">
                <label for="amount" class="form-control-label"
                  >Collection Channel</label
                >
                <select
                  class="custom-select w-100"
                  v-model="salesLogForm.payment_gateway_id"
                  v-validate="'required'"
                >
                  <option disabled selected="selected">
                    Collection Channel
                  </option>
                  <option
                    :value="type.id"
                    :key="type.id"
                    v-for="type in paymentGateways"
                  >
                    {{ type.name }}
                  </option>
                </select>
              </div>
              <div class="col form-group" v-if="isCashNCarry">
                <label for="amount" class="form-control-label w-100"
                  >Product Price</label
                >
                <currency-input
                  :options="inputOptions"
                  v-model="productPrice"
                  class="form-control w-100"
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
                  :disabled="isCashNCarry"
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
              <div class="col form-group" v-if="isBank54">
                <label for="bvn" class="form-control-label">BVN</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="salesLogForm.bvn"
                  v-validate="'required'"
                />
              </div>
              <div class="col form-group">
                <label for="amount" class="form-control-label">Owner</label>
                <select
                  class="custom-select w-100"
                  v-model="salesLogForm.owner_id"
                  v-validate="'required'"
                >
                  <option disabled selected="selected">Owner</option>
                  <option selected="selected" value="none">None</option>
                  <option :value="user.id" :key="user.id" v-for="user in users">
                    {{ user.full_name }}
                  </option>
                </select>
              </div>
            </div>
            <div class="row">
              <div class="col form-group" v-if="!isCashNCarry">
                <label for="amount" class="form-control-label"
                  >Repayment Cycle</label
                >
                <select
                  class="custom-select w-100"
                  v-model="salesLogForm.repayment_cycle_id"
                  v-validate="'required'"
                  @change="customDate($event)"
                  :disabled="isCashNCarry"
                >
                  <option disabled selected="selected">Repayment Cycle</option>
                  <option
                    :value="type"
                    :key="type.id"
                    v-for="type in repaymentCycleFiltered"
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
              <div class="col form-group" v-if="!isCashNCarry" :class="commitment.status ? 'disable' :''">
                <label for="amount" class="form-control-label"
                  >Repayment Duration</label
                >
                <select
                  @change="getCalc()"
                  class="custom-select w-100"
                  v-model="salesLogForm.repayment_duration_id"
                  v-validate="'required'"
                  :disabled="isCashNCarry"
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

              <div class="col form-group" v-if="!isCashNCarry" :class="commitment.status ? 'disable' :''">
                <label for="amount" class="form-control-label"
                  >Downpayment Rates</label
                >
                <select
                  class="custom-select w-100"
                  v-model="salesLogForm.payment_type_id"
                  v-validate="'required'"
                  @change="getCalc()"
                  :disabled="isCashNCarry"
                >
                  <option disabled selected="selected">
                    Downpayment Rates
                  </option>
                  <option
                    :value="type"
                    :key="type.id"
                    v-for="type in downPaymentRatesFiltered"
                  >
                    {{ type.name }}
                  </option>
                </select>
              </div>
              <div class="col form-group" v-if="!isCashNCarry">
                <label for="amount" class="form-control-label"
                  >Business Type</label
                >
                <select
                  class="custom-select w-100"
                  v-model="salesLogForm.business_type_id"
                  v-validate="'required'"
                  @change="getCalc()"
                  :disabled="isCashNCarry"
                >
                  <option disabled selected="selected">Business Type</option>
                  <option
                    :value="type"
                    :key="type.id"
                    v-for="type in businessTypes"
                  >
                    {{ type.name }}
                  </option>
                </select>
              </div>
              <div class="col form-group" v-if="isAltaraPay && showDiscount">
                <label for="amount" class="form-control-label">Discounts</label>
                <select
                  @change="getCalc()"
                  class="custom-select w-100"
                  v-model="salesLogForm.discount"
                  v-validate="'required'"
                >
                  <option
                    :value="type.slug"
                    :key="type.id"
                    v-for="type in discounts"
                  >
                    {{ type.name }}
                  </option>
                </select>
              </div>
              <div class="col form-group" v-if="!isAltaraPay">
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
                      element => element.name !== 'direct-debit'
                    )"
                  >
                    {{ type.name }}
                  </option>
                </select>
              </div>
              <div class="col form-group" v-if="!isAltaraPay">
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

              <div
                class="col form-group bor"
                v-if="isAltaraPay && salesLogForm.payment_gateway_id != 2"
              >
                <label for="amount" class="form-control-label"
                  >Card Expiry Date</label
                >
                <input
                  class="w-100 custom-select"
                  :class="{ 'border-danger': cardError }"
                  name="amount"
                  v-model="card_expiry"
                  v-validate="'required'"
                  type="month"
                  placeholder="Card Expiry Date"
                />
                <div v-if="cardError" class="small text-danger">
                  The card cannot be accepted
                </div>
              </div>
            </div>
            <br />
            <div>
              <div
                :style="
                  (addDownpayment && isAltaraPay) || stillShowToggle
                    ? 'display:flex; '
                    : ''
                "
              >
                <div
                  class="col d-flex align-items-center"
                  :class="this.customer.guarantor_paystack.length > 0 ? '' : ''"
                  v-if="(addDownpayment && isAltaraPay) || stillShowToggle"
                >
                  <toggle-button
                    v-on:valueChangedEvent="triggerToggleEvent"
                    switchName="addDownpayment"
                    key="addDownpayment"
                    :defaultState="addDownpayment"
                    label="Add Repayment"
                  />
                </div>
                <div
                  class="text-center "
                  :style="
                    (addDownpayment && isAltaraPay) || stillShowToggle
                      ? 'position:absolute; left:50%; '
                      : ''
                  "
                >
                  <button
                    v-if="isCashNCarry"
                    class="btn bg-default"
                    :disabled="productPrice <= 0 || !selectedProduct.id"
                    type="submit"
                    v-on:click="getCalc()"
                  >
                    View Summary
                  </button>
                  <button
                    v-else
                    class="btn bg-default"
                    :disabled="test1"
                    type="submit"
                    v-on:click="getCalc()"
                  >
                    View Amortization
                  </button>
                  <br />
                </div>
              </div>
              <div class="text-right" v-if="isAltaraPay">
                <button
                  class="btn bg-default"
                  type="button"
                  @click="showCollectionModal"
                >
                  Collection Data
                </button>
                <br />
              </div>
            </div>
          </form>
        </div>
      </div>
      <div v-if="!hideOrderSummary && !isCashNCarry" class="col-md-4">
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
                <tr
                  class="table-separator"
                  v-if="singleRepayment && addDownpayment"
                >
                  <th>Estimating Downpayment</th>
                  <td>
                    {{ $formatCurrency(fPayment) }}
                    <span
                      style="font-size: 12px; text-decoration: underline; font-weight: 900;"
                    >
                      + {{ $formatCurrency(singleRepayment) }}</span
                    >
                  </td>
                </tr>
                <tr
                  class="table-separator"
                  v-if="pPrice > 0 && commitment.status"
                >
                  <th>Commitment</th>
                  <td>{{ $formatCurrency(commitment.amount) }}</td>
                </tr>
                <tr class="table-separator">
                  <th>First Payment</th>
                  <td>
                    {{
                      $formatCurrency(
                        computedPayment(fPayment + singleRepayment, fPayment)
                      )
                    }}
                  </td>
                </tr>

                <tr class="table-separator">
                  <th>Repayment</th>
                  <td class>
                    {{
                      $formatCurrency(
                        computedPayment(rPayment - singleRepayment, rPayment)
                      )
                    }}
                  </td>
                </tr>
              </tbody>
            </table>
            <div class="cover">
              <discount
                class="discount"
                v-if="salesLogForm.discount !== '0_discount' && rPayment > 0"
                :percent="selected_discount.percentage_discount"
              />
              <p v-if="pPrice > 0 && commitment.status" class="commitment">
                {{ commitment.percentage }}% Commitment
              </p>
            </div>
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
              <div
                v-if="!validateEmail(customer_email)"
                class=" text-danger mr-5 pr-2 h5 mb-1"
              >
                customer email is invalid
              </div>
              <h5 class="mt-3 mb-0">Order Information</h5>
              <table class="table table-bordered">
                <tbody>
                  <tr class="table-separator">
                    <!-- <td>Customer ID</td> -->
                    <td>Product Name</td>
                    <td>Product Price</td>
                    <td>First Payment</td>
                    <td>Repayment</td>
                    <td>Financed By</td>
                    <td v-if="pPrice > 0 && commitment.status">commitment</td>
                    <!-- <th>Branch</th> -->
                  </tr>
                  <tr>
                    <!-- <td class="font-weight-bold">{{this.customerId}}</td> -->
                    <th>{{ this.selectedProduct.product_name }}</th>
                    <th>
                      {{
                        $formatCurrency(isCashNCarry ? productPrice : pPrice)
                      }}
                    </th>
                    <th>
                      {{
                        $formatCurrency(
                          isCashNCarry
                            ? productPrice
                            : computedPayment(
                                fPayment + singleRepayment,
                                fPayment
                              )
                        )
                      }}
                    </th>
                    <td class>
                      {{
                        $formatCurrency(
                          isCashNCarry
                            ? 0
                            : computedPayment(
                                rPayment - singleRepayment,
                                rPayment
                              )
                        )
                      }}
                      <div class="modal_cover">
                        <discount
                          class="modal_discount"
                          v-if="
                            salesLogForm.discount !== '0_discount' &&
                              rPayment > 0
                          "
                          :percent="selected_discount.percentage_discount"
                        />
                      </div>
                    </td>
                    <td>{{ financed_by }}</td>
                    <td v-if="pPrice > 0 && commitment.status">
                      {{ $formatCurrency(commitment.amount) }}
                    </td>
                    <!-- <td class="font-weight-bold">Ikoyi</td> -->
                  </tr>
                </tbody>
              </table>

              <h5 class="mt-5 mb-0" v-if="!isCashNCarry">
                Amortization Schedule
              </h5>
              <div class="payment-table" v-if="!isCashNCarry">
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
          <div class="text-center" v-if="isAltaraPay">
            <p class="d-block text-danger">
              {{
                !transfer
                  ? "Push Button If Customer Transferred Payment"
                  : "Push Button To Pay With Credit Card"
              }}
            </p>
            <div class="col d-flex justify-content-center">
              <toggle-button
                v-on:valueChangedEvent="triggerToggleEvent"
                :key="'Transfer'"
                :switchName="'Transfer'"
                :defaultState="transfer"
              />
            </div>

            <button
              class="btn bg-default"
              @click="logSale()"
              type="submit"
              v-if="transfer"
            >
              Confirm Transfer
            </button>
            <paystack
              :disabled="!validateEmail(customer_email)"
              :amount="
                computedPayment(
                  (fPayment + singleRepayment) * 100,
                  (fPayment + commitment.amount) * 100
                )
              "
              :email="customer_email"
              :paystackkey="paystackkey"
              :reference="reference"
              :callback="processPaymentPayStackPayment"
              :close="closePayStackModal"
              class="btn bg-default"
              v-if="!transfer"
              >Pay</paystack
            >
          </div>
          <div v-else class="text-center">
            <button class="btn bg-default" @click="logSale()" type="submit">
              Log Sale
            </button>
          </div>
        </div>
      </div>
    </div>

    <modal
      name="verification-collection-data"
      :adaptive="true"
      :height="'auto'"
      :clickToClose="true"
      :reset="false"
    >
      <verification-collection-data
        v-on:close="closeCollectionModal"
        @verificationCollectionDataPassed="collectCollectionVerificationData"
        :verificationCollectionData="verificationCollectionData"
        :proof_of_credits="proof_of_credits"
        :guarantor_signed="guarantor_signed"
        :address_visited="address_visited"
        :credit_report_status="credit_report_status"
        :credit_point_status="credit_point_status"
      />
    </modal>
  </div>
</template>

<script>
import { get, post } from "../utilities/api"
import { mapGetters } from "vuex"
import AutoComplete from "./AutoComplete.vue"
import { calculate, cashLoan } from "../utilities/calculator"
import VerificationCollectionData from "./modals/VerificationCollectionData"
import Flash from "../utilities/flash"
import discount from "./discount.vue"
import paystack from "vue-paystack"
import moment from "moment"
import roles from "../utilities/roles"
import ToggleButton from "./ToggleButton.vue"
import CurrencyInput from "./CurrencyInput.vue"

export default {
  props: { customerId: null, customer: null, verificationList: null },
  components: {
    AutoComplete,
    discount,
    paystack,
    VerificationCollectionData,
    ToggleButton,
    CurrencyInput,
  },
  data() {
    return {
      noBSVerbiage: "",
      allowBSSale: false,
      inputOptions: {
        currency: "NGN",
        currencyDisplay: "symbol",
        hideCurrencySymbolOnFocus: false,
        hideGroupingSeparatorOnFocus: false,
        hideNegligibleDecimalDigitsOnFocus: true,
        autoDecimalDigits: false,
        useGrouping: true,
        accountingSign: false,
      },
      productPrice: 0,
      currentValue: "",
      stillShowToggle: null,
      addDownpayment: null,
      productOrder: false,
      card_expiry: null,
      error: {},
      users: [],
      product: "",
      salesLogForm: {},
      repaymentDuration: [],
      repaymentCyclesopt: [],
      downPaymentRates: [],
      discounts: [],
      orderTypes: [],
      businessTypes: [],
      amortization: [],
      calculation: [],
      salesCategories: [],
      hideOrderSummary: true,
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
        paystackCustomerCodeUrl: `api/pay_stack_customers_code`,
        verifyPaymentUrl: `https://api.paystack.co/transaction/verify/`,
        paystackCustomerApi: `https://api.paystack.co/customer`,
      },
      inputValue: "",
      paymentGateways: [
        {
          id: 1,
          name: "paystack",
        },
        {
          id: 2,
          name: "remitta",
        },
      ],
      selectedProduct: {},
      selected_discount: {},
      userRole: parseInt(localStorage.getItem("role")),
      fPayment: "",
      pPrice: "",
      rPayment: "",
      repaymentCircle: "",
      rDuration: "",
      cardError: false,
      customDateToggle: false,
      discounts: null,
      eligible: false,
      serial: false,
      renewalState: false,
      isAltaraPay: false,
      isAltaraCredit: true,
      isCashNCarry: false,
      useCreditCard: false,
      transfer: false,
      customer_email: this.customer.email || "somedefaultemail",
      paystackkey: process.env.VUE_APP_PAYSTACK_KEY || "",
      paystackReference: null,
      newOrderId: null,
      verificationCollectionData: {
        salary_day_1: 1,
        salary_day_2: 1,
        salary_day_3: 1,
        proof_of_credit: "SMS Alert Screenshot",
        guarantor_signed: "No",
        address_visited: "No",
        credit_report_status: "No",
        credit_point_status: "Bad",
      },
      proof_of_credits: [
        "SMS Alert Screenshot",
        "E-statement",
        "Stamped-statement",
        "Bank App History Screenshot",
      ],
      guarantor_signed: ["2 - Yes", "1 - Yes", "No"],
      address_visited: ["Yes", "No"],
      credit_report_status: ["Bad", "Fair", "No", "Good"],
      credit_point_status: ["Bad", "Average", "Good"],
      financiers: ["altara", "bank54"],
      isBank54: false,
      financed_by: "altara",
      flag: null,
      singleRepayment: null,
      biz_type: null,
      commitment: {
        status: null,
        amount: 0,
        percentage: null,
      },
      salesCategories: null,
      showDiscount:null
    }
  },
  async beforeMount() {
    this.canLogBank54Payment()
    this.checkIfDiscountElig()
    await this.getRepaymentDuration()
    await this.getSalesCategory()
    await this.getRepaymentCycles()
    await this.getDownPaymentRates()
    await this.getBusinessTypes()
    await this.getCalculation()
    await this.getDiscounts()
    await this.getOrderTypes()
  },
  watch: {
    "salesLogForm.sales_category_id": {
      handler(newData) {
        this.watchSalesCategory(newData)
        this.watchBusinessType(newData)
        this.watchSalesLogForm(newData)
        this.watchCashPrice(newData)
      },
    },
    "salesLogForm.business_type_id": {
      handler(newData) {
        this.watchCashPrice(newData)
        this.watchBusinessType(newData)
        this.watchSalesLogForm(newData)
        this.getCalc()
      },
    },
    "salesLogForm.product": {
      handler(newData) {
        this.watchCashPrice(newData)
        this.getCalc()
      },
      deep: true,
    },
    "salesLogForm.repayment_duration_id": {
      handler(newData) {
        this.watchCashPrice(newData)
      },
      deep: true,
    },
    isAltaraCredit: {
      handler(newData) {
        this.setSalesCategory(newData)
      },
    },
  },

  computed: {
    ...mapGetters(["getPaymentMethods", "getBanks"]),
    downPaymentRatesFiltered() {
      let result = []
      this.isAltaraPay
        ? (result = this.downPaymentRates)
        : (result = this.downPaymentRates.filter(item => {
            return !item.name.includes("plus")
          }))
      return result
    },
    reference() {
      let text = ""
      let possible =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
      for (let i = 0; i < 10; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length))
      return text
    },

    repaymentCycleFiltered() {
      let newArray = []
      this.isAltaraPay
        ? (newArray = this.repaymentCyclesopt.filter(item => {
            return item.name !== "monthly"
          }))
        : (newArray = this.repaymentCyclesopt)
      return newArray
    },

    compHeader() {
      return this.isAltaraPay
        ? "Altara Pay"
        : this.isAltaraCredit
        ? "Altara Credit"
        : "Cash N Carry"
    },
  },
  methods: {
    computedPayment(firstvalue, secondvalue) {
      if (this.singleRepayment && this.addDownpayment) {
        return firstvalue
      } else return secondvalue
    },
    watchCashPrice() {
      if (
        this.salesLogForm?.product?.product?.category == "cash loan" &&
        this.salesLogForm?.repayment_duration_id?.name == "six_months"
      ) {
        //check if it is cashloan and six months duration, return addDownpayment= true only if
        //businesstype is (5 or10) and product amount is >110000
        //OR
        //businesstype is (9 or7) and product amount is > 80000
        this.addDownpayment =
          ((this.salesLogForm?.business_type_id?.id == 5 ||
            this.salesLogForm?.business_type_id?.id == 10) &&
            this.selectedProduct.price > 110000) ||
          ((this.salesLogForm?.business_type_id?.id == 9 ||
            this.salesLogForm?.business_type_id?.id == 7) &&
            this.selectedProduct.price > 80000)
            ? true
            : false
      } else this.addDownpayment = false
      this.stillShowToggle = this.addDownpayment
    },
    watchSalesLogForm() {
      this.salesLogForm.discount =
        this.salesLogForm?.sales_category_id == "2" &&
        !this.salesLogForm.product_name.includes("cash") &&
        this.productOrder
          ? "5_discount"
          : "0_discount"
    },
    selectItem(itemArray, matchName){
     return itemArray.find((object)=>{
            return object.name == matchName
          });
    },
    watchSalesCategory() {
      if (this.isAltaraPay) {
        if (this.salesLogForm.sales_category_id == 9) {
          this.salesLogForm.business_type_id = null
          this.commitment.status = true
          this.salesLogForm.repayment_duration_id = this.selectItem(this.repaymentDuration, "six_months")
           this.salesLogForm.payment_type_id = this.selectItem(this.downPaymentRatesFiltered,  "twenty")
           this.salesLogForm.payment_gateway_id = this.selectItem(this.paymentGateways, "paystack")?.id
           
          //if sales-category is "NoBS"
          this.businessTypes = this.biz_type.filter(business_type => {
            //return only this business type,
                        return business_type?.slug.includes("bs")
          })
          this.salesLogForm?.business_type_id?.slug == "ap_no_bs_renewal_verve"
        } else {
          this.salesLogForm.business_type_id = null
          this.commitment.status = false
          this.businessTypes = this.biz_type.filter(business_type => {
            //else return the rest
            return !business_type.name.includes("No BS") &&  business_type.slug.includes("ap_")
          })
        }
      }
    },
    setSalesCategory() {
      if (this.isAltaraCredit) {
        this.salesCategories = this.salesCategories2.filter(obj => {
          return obj.name !== 'No BS'
        })
      } else {
        this.salesCategories = this.salesCategories2
      }
    },
    watchBusinessType() {
      this.productOrder =
        this.salesLogForm?.business_type_id?.slug?.includes("ap_products") ||
        this.salesLogForm?.business_type_id?.slug?.includes("ac_products")
    },
    customDate(event) {
      this.salesLogForm?.repayment_cycle_id?.name === "custom"
        ? (this.customDateToggle = true)
        : (this.customDateToggle = false)

      this.getCalc()
    },
    async logSale() {
      this.salesLogForm.customer_id = this.customerId
      let renewal = ""
      this.eligible
        ? (renewal = this.discounts.find(item => {
            return item.name === "renewal"
          })?.id)
        : (renewal = "")
      let orderType = ""
      orderType = this.orderTypes.find(item => {
        return (
          item.name ===
          (this.isAltaraPay
            ? "Altara Pay"
            : this.isCashNCarry
            ? "Cash n Carry"
            : "Altara Credit")
        )
      })

      const data = {
        amortization_downpayment:
          this.singleRepayment && this.addDownpayment
            ? this.singleRepayment
            : 0,
        commitment_percentage:
          this.pPrice > 0 && this.commitment.status
            ? this.commitment.percentage
            : 0,
        commitment_amount:
          this.pPrice > 0 && this.commitment.status
            ? this.commitment.amount
            : 0,
        order_type_id: orderType.id,
        customer_id: this.customerId,
        inventory_id: this.selectedProduct.id,
        repayment_duration_id: this.salesLogForm.repayment_duration_id?.id,
        repayment_cycle_id: this.salesLogForm.repayment_cycle_id?.id,
        business_type_id: this.salesLogForm.business_type_id?.id,
        branch_id: localStorage.getItem("branch_id"),
        down_payment: this.isCashNCarry ? this.productPrice : this.fPayment,
        repayment: this.isCashNCarry ? 0 : this.rPayment,
        bank_id: this.isAltaraPay ? 1 : this.salesLogForm.bank_id,
        product_price: this.$formatMoney(
          this.isCashNCarry ? this.productPrice : this.pPrice
        ),
        down_payment_rate_id: this.salesLogForm.payment_type_id.id,
        payment_type_id: this.salesLogForm.payment_type_id.id,
        payment_method_id: this.isAltaraPay
          ? this.transfer
            ? this.getPaymentMethods.find(el => (el.name = "transfer")).id
            : this.getPaymentMethods.find(el => (el.name = "direct-debit")).id
          : this.salesLogForm.payment_method_id,
        sales_category_id: this.salesLogForm.sales_category_id,
        discount_id: this.selected_discount?.id,
        owner_id: this.salesLogForm.owner_id,
        serial_number: this.salesLogForm.serial_number,
        collection_verification_data: this.CollectionVerificationData,
      }
      if (this.isBank54) {
        this.financed_by = "bank54"
        data.bvn = this.salesLogForm.bvn
      }
      data.financed_by = this.financed_by
      this.salesLogForm.payment_gateway_id
        ? (data.payment_gateway_id = this.salesLogForm.payment_gateway_id)
        : ""
      data.authorization_code = this.salesLogForm?.authorization_code
      if (this.eligible && renewal) {
        data.discount = [renewal]
      }
      this.salesLogForm.repayment_cycle_id?.id == 3
        ? (data.custom_date = parseInt(this.salesLogForm.custom_date))
        : ""
      this.$validator.validateAll().then(result => {
        if (result) {
          this.$LIPS(true)
          post(this.apiUrls.createOrder, data)
            .then(res => {
              this.newOrderId = res.data.data.id
              this.$LIPS(false)
              $(`#amortizationPreview`).modal("toggle")

              this.$swal({
                icon: "success",
                title: "Sale Successfully Logged",
              })
              this.$emit("done")
              return res
            })
            .catch(err => {
              this.$LIPS(false)
              Flash.setError("Error: " + err.message)
            })
        } else this.$networkErr("form")
      })
    },
    async previewAmortization() {
      if (this.isAltaraPay) {
        const createdPaystackCustomer = await this.createCustomer(
          this.customer.id,
          this.customer.email,
          this.customer.first_name,
          this.customer.last_name,
          this.customer.telephone
        ).then(data => {
          return data
        })
        await this.paystackCustomer(
          this.customer.id,
          createdPaystackCustomer?.data?.customer_code
        )
      }
      this.cardError = false
      this.salesLogForm.customer_id = this.customerId
      const data = {
        amortization_downpayment:
          this.singleRepayment && this.addDownpayment
            ? this.singleRepayment
            : 0,
        commitment_percentage:
          this.pPrice > 0 && this.commitment.status
            ? this.commitment.percentage
            : 0,
        commitment_amount:
          this.pPrice > 0 && this.commitment.status
            ? this.commitment.amount
            : 0,
        customer_id: this.customerId,
        inventory_id: this.selectedProduct.id,
        repayment_duration_id: this.salesLogForm.repayment_duration_id.id,
        repayment_cycle_id: this.salesLogForm.repayment_cycle_id.id,
        business_type_id: this.salesLogForm.business_type_id.id,
        branch_id: localStorage.getItem("branch_id"),
        down_payment: this.$formatMoney(
          this.isCashNCarry ? this.productPrice : this.fPayment
        ),
        down_payment_rate_id: this.salesLogForm.payment_type_id.id,
        repayment: this.$formatMoney(this.isCashNCarry ? 0 : this.rPayment),
        bank_id: this.isAltaraPay ? 1 : this.salesLogForm.bank_id,
        product_price: this.$formatMoney(
          this.isCashNCarry ? this.productPrice : this.pPrice
        ),
        payment_type_id: this.salesLogForm.payment_type_id.id,
        payment_method_id: this.isAltaraPay
          ? this.getPaymentMethods.find(el => (el.name = "direct-debit")).id
          : this.salesLogForm.payment_method_id,
        sales_category_id: this.salesLogForm.sales_category_id,
        discount_id: this.selected_discount?.id,
        owner_id: this.salesLogForm.owner_id,
      }

      if (this.isBank54) {
        this.financed_by = "bank54"
        data.bvn = this.salesLogForm.bvn
      }
      data.financed_by = this.financed_by

      this.salesLogForm.serial_number !== null
        ? (data.serial_number = this.salesLogForm.serial_number)
        : ""
      this.salesLogForm.repayment_cycle_id?.id == 3
        ? (data.custom_date = parseInt(this.salesLogForm.custom_date))
        : ""

      if (this.card_expiry) {
        let expiry_date = moment(this.card_expiry)
        let duration = parseInt(this.salesLogForm.repayment_duration_id.value)
        let allowed_date = moment().add(duration + 60, "days")

        if (expiry_date.isBefore(allowed_date)) {
          this.cardError = true
          return
        }
      }
      this.$validator.validateAll().then(result => {
        if (result) {
          this.$LIPS(true)
          post(this.apiUrls.previewAmortization, data)
            .then(res => {
              this.$LIPS(false)
              this.amortization = res.data.data
              $(`#amortizationPreview`).modal("toggle")
            })
            .catch(err => {
              this.$LIPS(false)
              Flash.setError("Error: " + err.message)
            })
        } else this.$networkErr("form")
      })
    },

    async getRepaymentDuration() {
      try {
        const fetchRepaymentDuration = await get(this.apiUrls.repaymentDuration)
        this.repaymentDuration = fetchRepaymentDuration.data.data.data
      } catch (err) {
        this.$displayErrorMessage(err)
      }
    },
    async getDiscounts() {
      try {
        const fetchDiscounts = await get(this.apiUrls.discounts)
        this.discounts = fetchDiscounts.data.data.data
        this.discounts = this.discounts.sort((a, b) => {
          return a.percentage_discount - b.percentage_discount
        })
      } catch (err) {
        this.$displayErrorMessage(err)
      }
    },
    getCalc() {
      this.watchCashPrice()
      this.showDiscount = this.salesLogForm?.business_type_id?.slug=='ap_products'? true:false
      try {
        this.salesLogForm.customer_id = this.customerId
        const data0 = {
          discount_slug: this.salesLogForm.discount,
          ...this.salesLogForm,
          ...{
            branch_id: localStorage.getItem("branch_id"),
            status_id: 1,
          },
        }
        const caly = this.calculation
        const data = caly.filter(
          x =>
            x.business_type_id === data0.business_type_id?.id &&
            x.down_payment_rate_id === data0.payment_type_id.id &&
            x.repayment_duration_id === data0.repayment_duration_id.id
        )[0]
        this.selected_discount = this.discounts.find(item => {
          return item.slug == this.salesLogForm.discount
        })
        const { total, actualDownpayment, rePayment } =
          data0.business_type_id.slug.includes("cash_loan") ||
          data0.business_type_id.slug.includes("ap_rentals") ||
          data0.business_type_id.slug.includes("ap_super") ||
          data0.business_type_id.slug.includes("bs") ||
          data0.business_type_id.slug.includes("ap_starter")
            ? cashLoan(
                this.selectedProduct.price,
                data0,
                data,
                this.selected_discount?.percentage_discount
              )
            : calculate(
                this.selectedProduct.price,
                data0,
                data,
                this.selected_discount?.percentage_discount
              )

        this.repaymentCircle = data0.repayment_cycle_id.value
        this.rDuration = data0.repayment_duration_id.value
        this.fPayment = actualDownpayment
        this.rPayment = rePayment
        this.pPrice = total
        this.test1 = false

        //gray out button if not verified for NoBS
        // if (this.salesLogForm.sales_category_id) {
        //   let salesCatName = this.salesCategories.find(
        //     item => item.id === this.salesLogForm.sales_category_id
        //   ).name
        //   if (salesCatName === "No BS" && !this.allowBSSale) {
        //     throw new Error('Not Verified')
        //   }
        // }

        const months = this.rDuration / 30
        const cycle = Math.ceil(28 / this.repaymentCircle)
        const additionalRepayment = this.rPayment / (months * cycle)
        let salesCatName = this.salesCategories.find(item => item.id === this.salesLogForm.sales_category_id);
        if (this.isAltaraPay && salesCatName.name == 'No BS') {
          //check if on altara pay and New BS sales category

          if (
            this.salesLogForm.business_type_id.slug == 'ap_no_bs_new_verve' ||
            this.salesLogForm.business_type_id.slug == 'ap_no_bs_new_non_verve'
          ) {
            //if biz-type is BS-new customer
            this.commitment.percentage = 6
            this.commitment.amount = this.selectedProduct.price * (6 / 100)

            //add a 6% commision on the downpayment
          } else if (
            this.salesLogForm.business_type_id.slug == 'ap_no_bs_renewal_non_verve' ||
            this.salesLogForm.business_type_id.slug == 'ap_no_bs_renewal_verve'
          ) {
            //BS-renewal
            this.commitment.percentage = 3
            this.commitment.amount = this.selectedProduct.price * (3 / 100)
          }
        }

        if (
          (this.selectedProduct.price > 80000 &&
            this.selectedProduct.price <= 110000 &&
            (this.salesLogForm?.business_type_id?.id == 7 ||
              this.salesLogForm?.business_type_id?.id == 9)) ||
          ((this.salesLogForm?.business_type_id?.id == 5 ||
            this.salesLogForm?.business_type_id?.id == 10) &&
            this.selectedProduct.price > 110000)
        ) {
          this.singleRepayment =
            cycle == 1 ? additionalRepayment / 2 : additionalRepayment
        } else if (
          this.selectedProduct.price > 110000 &&
          (this.salesLogForm.business_type_id.id == 7 ||
            this.salesLogForm?.business_type_id?.id == 9)
        ) {
          this.singleRepayment =
            cycle == 1 ? additionalRepayment : additionalRepayment * 2
        }
      } catch (e) {
        // this.$swal({
        //     icon: "error",
        //     title: "Plan is not available"
        // });
       this.test1 = true

        this.repaymentCircle = "0"
        this.rDuration = "0"
        this.fPayment = "0"
        this.rPayment = "0"
        this.pPrice = "0"
      }
      // }
      // });
    },
    getRepaymentDate(count) {
      const paymentDate = this.repaymentCircle * count
      const date = new Date()
      const newDate = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate() + paymentDate
      ).toLocaleDateString("en-US")
      return newDate
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
        const fetchGetCalclations = await get(this.apiUrls.getCalculation)

        const unwrapped = fetchGetCalclations.data.data
        this.calculation = unwrapped

        const filter = this.calculation.filter(obj => {
          return obj.business_type_id >= 15
        })
        const unwrapped0 = JSON.stringify(unwrapped)
      } catch (err) {
        this.$displayErrorMessage(err)
      }
    },
    selectedItem(value) {
      this.selectedProduct = value

      this.salesLogForm = {
        ...this.salesLogForm,
        product_name: this.selectedProduct.product_name,
        product: this.selectedProduct,
      }
      this.hideOrderSummary = false
      this.watchSalesLogForm()
      this.getCalc()
    },
    async getProduct() {
      try {
        const fetchProduct = await get(this.apiUrls.getProduct + this.product)
      } catch (err) {
        this.$displayErrorMessage(err)
      }
    },
    async getRepaymentCycles() {
      try {
        const fetchRepaymentCycles = await get(this.apiUrls.repaymentCycles)
        this.repaymentCyclesopt = fetchRepaymentCycles?.data?.data?.data
      } catch (err) {
        this.$displayErrorMessage(err)
      }
    },

    async getOrderTypes() {
      try {
        const orderTypes = await get(this.apiUrls.orderType)
        this.orderTypes = orderTypes?.data?.orderTypes
      } catch (err) {
        this.$displayErrorMessage(err)
      }
    },
    async getDownPaymentRates() {
      try {
        const fetchDownPaymentRates = await get(this.apiUrls.downPaymentRates)
        this.downPaymentRates = fetchDownPaymentRates?.data?.data?.data
        this.downPaymentRates = this.downPaymentRates.sort((a, b) => {
          return a.percent - b.percent
        })
      } catch (err) {
        this.$displayErrorMessage(err)
      }
    },
    async getSalesCategory() {
      try {
        const fetchSalesCategory = await get(this.apiUrls.salesCategoryUrl)
        this.salesCategories2 = fetchSalesCategory?.data?.data?.data
        this.salesCategories = fetchSalesCategory?.data?.data?.data
            this.salesCategories = this.salesCategories2.filter(obj => {
          return obj.name !== 'No BS'
        })
      } catch (err) {
        this.$displayErrorMessage(err)
      }
    },

    async getUsers(salesCat = 1) {
      this.$LIPS(true)
      await get(`/api/sales-category/${salesCat}/roles`).then(res => {
        this.users = this.mergeArrays(res?.data?.data)
      })
      let salesCatName = this.salesCategories.find(item => item.id === salesCat)
        .name
      if (salesCatName === "No BS") {
        // this.checkVerified()
      }
      else{
        this.noBSVerbiage =
          ""
      }

      this.$LIPS(false)
      this.getCalc()
    },
    checkVerified() {
      if (this.verificationList.length === 0) {
        this.allowBSSale = false
        
        this.noBSVerbiage =
          "Customer's home address and guarantor's home address has not been verified!!!"

        return
      }
      let checkList = JSON.parse(this.verificationList[0].input_data)
      if (
        checkList.homeVisited === "yes" &&
        checkList.guarantorHomeVisited === "yes"
      ) {
        this.allowBSSale = true
      } else {
        this.allowBSSale = false
        this.noBSVerbiage =
          "Customer's home address and guarantor's home address has not been verified!!!"
      }
    },
    mergeArrays(parent) {
      let result = []
      parent.forEach(elem => {
        result = result.concat(elem.active_users)
      })
      return result
    },
    async getBusinessTypes() {
      try {
        this.$LIPS(true)
        const fetchBusinessTypes = await get(this.apiUrls.businessTypes)
        this.biz_type = fetchBusinessTypes?.data?.data?.data
        this.businessTypes = fetchBusinessTypes?.data?.data?.data
        this.businessTypes = this.businessTypes.filter(item => {
          if (this.isAltaraCredit) {
            return item.slug.includes("ac_")
          } else {
            return item.slug.includes("ap_")
          }
        })

        this.$LIPS(false)
      } catch (err) {
        this.$displayErrorMessage(err)
      }
    },
    mergeArrays(parent) {
      let result = []
      parent.forEach(elem => {
        result = result.concat(elem.users)
      })
      return result.sort((a, b) => a["full_name"].localeCompare(b["full_name"]))
    },
    checkIfDiscountElig() {
      if (this.customer.new_orders.length > 0) {
        let arrLength = this.customer.new_orders.length
        if (
          this.calcDebt(
            this.customer.new_orders[arrLength - 1].amortization
          ) === 0
        ) {
          this.eligible = true
        }
      }
    },
    calcDebt(amortization) {
      // I assumed that all repayments are uniform and are not varied
      if (amortization[0] !== undefined) {
        let res = amortization.filter(amor => {
          return amor.actual_amount === 0
        })
        return res.length * amortization[0].expected_amount
      }
      return
    },

    toggleSerial() {
      this.serial === true ? (this.serial = false) : (this.serial = true)
    },
    async toggleProductType(mode) {
      if (mode === "ap") {
        this.hideOrderSummary = true
        this.transfer = false
        this.isBank54 = false
        this.selectedProduct.product_name = ""
        this.isAltaraPay = true
        this.isAltaraCredit = false
        this.isCashNCarry = false
        this.selectedProduct.product_name = ""
        this.isAltaraPay ? "" : (this.card_expiry = null)
        this.salesLogForm = {}
        this.salesLogForm.discount = "0_discount"
        this.$refs.clearInputValue.setValue("")
        await this.getBusinessTypes()
      } else if (mode === "ac") {
        this.isCashNCarry = false
        this.isAltaraPay = false
        this.isAltaraCredit = true
        this.salesLogForm = {}
        await this.getBusinessTypes()
      } else {
        this.isAltaraPay = false
        this.isAltaraCredit = false
        this.isCashNCarry = true
        this.salesLogForm = {}

        this.salesLogForm.sales_category_id = 8
        await this.getBusinessTypes()

        this.salesLogForm.payment_type_id = this.downPaymentRates.filter(
          item => item.name === "Hundred"
        )[0]
        this.salesLogForm.repayment_duration_id = this.repaymentDuration.filter(
          item => item.name === "six_months"
        )[0]
        this.salesLogForm.repayment_cycle_id = this.repaymentCyclesopt.filter(
          item => item.name === "monthly"
        )[0]
        this.salesLogForm.business_type_id = this.businessTypes.filter(
          item => item.name === "Cash n Carry"
        )[0]
        this.getUsers(8)
        // this.salesLogForm.sales_category_id = this.salesCategories.filter(item => item.name === )
      }
    },
    async processPaymentPayStackPayment(resp) {
      this.paystackReference = resp.reference
      if (resp.status == "success" && resp.message == "Approved") {
        this.salesLogForm.payment_gateway_id = this.paymentGateways.find(
          item => item.name === "paystack"
        ).id
        await this.verifyPaystackPayment()
          .then(data => {
            if (data.status && data.message == "Verification successful") {
              this.salesLogForm.authorization_code =
                data.data.authorization.authorization_code
            }
          })
          .catch(error => {
            this.$displayErrorMessage(error)
          })
        this.logSale()
      }
    },
    closePayStackModal: () => {},
    showCollectionModal() {
      this.$modal.show("verification-collection-data")
    },
    closeCollectionModal() {
      this.$modal.hide("verification-collection-data")
    },
    collectCollectionVerificationData(data) {
      this.CollectionVerificationData = data
      this.closeCollectionModal()
    },

    async verifyPaystackPayment() {
      const url = `${this.apiUrls.verifyPaymentUrl}${this.paystackReference}`
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.VUE_APP_PAYSTACK_SECRET_KEY}`,
        },
      })
      return response.json()
    },
    async createCustomer(id, email, firstName, lastName, phoneNo) {
      return await fetch(this.apiUrls.paystackCustomerApi, {
        // Adding method type
        method: "POST",
        // Adding body or contents to send
        body: JSON.stringify({
          email: email,
          first_name: firstName,
          last_name: lastName,
          phone: phoneNo,
          metadata: { customerId: id },
        }),
        // Adding headers to the request
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.VUE_APP_PAYSTACK_SECRET_KEY}`,
        },
      }) // Converting to JSON
        .then(response => response.json())
        // Displaying results to console
        .then(json => json)
        .catch(err => {
          this.$LIPS(false)
          Flash.setError("Error: " + err.message)
        })
    },
    async paystackCustomer(id, customer_code) {
      post(this.apiUrls.paystackCustomerCodeUrl, {
        id: id,
        customer_code: customer_code,
      })
        .then(res => {
          return res
        })
        .catch(err => {
          this.$LIPS(false)
          Flash.setError("Error: " + err.message)
        })
    },
    validateEmail(mail) {
      {
        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
          return true
        }

        return false
      }
    },
    canLogBank54Payment: function() {
      this.flag = localStorage.getItem("flag")
      return this.flag === "beta"
    },
    triggerToggleEventBank54(value) {
      this.isBank54 = value
    },
    triggerToggleEventTransfer(value) {
      this.transfer = value
    },
    triggerToggleEventaddDownpayment(value) {
      this.addDownpayment = !this.addDownpayment
      this.addDownpayment = value
      this.stillShowToggle = true
    },
    triggerToggleEvent(value, switchName) {
      this[`triggerToggleEvent${switchName}`](value)
    },
  },

 
}
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
.disableToggle {
  pointer-events: none;
  opacity: 0.7;
}
.discount {
  left: 130px;
}
.cover {
  display: flex;
  position: relative;
}
.modal_discount {
  top: 0px;
  right: 0px;
  position: absolute;
}
.modal_cover {
  margin-left: 100px;
  top: -26px;
  display: flex;
  position: relative;
}
.serial {
  font-size: 8px;
  display: block;
  float: right;
  text-decoration: underline;
}
.commitment {
  font-weight: 700;
  font-size: 15px;
  text-align: center;
  color: #074a74;
  width: 100%;
}
.disable{
  pointer-events:none;
}
</style>
