<template>
  <div style="margin-top: 5rem;">
    <div class="card">
      <form class="card-body" @submit.prevent="submitForm">
        <div class="row">
          <div class="col form-group">
            <label for="amount" class="form-control-label"
              >Payment Method</label
            >
            <select
              class="custom-select w-100"
              v-model="paymentId"
              v-validate="'required'"
            >
              <option disabled selected="selected">Payment Method</option>
              <option
                :value="type.id"
                :key="type.id"
                v-for="type in paymentMeths"
              >
                {{ type.name }}
              </option>
            </select>
          </div>
          <div class="col form-group">
            <label for="bank" class="form-control-label">Bank</label>
            <select
              class="custom-select w-100"
              v-model="bank"
              v-validate="'required'"
            >
              <option disabled selected="selected">Bank</option>
              <option :value="type.id" :key="type.id" v-for="type in getBanks">
                {{ type.name }}
              </option>
            </select>
          </div>
          <div class="col form-group">
            <label for="amount" class="form-control-label">Amount</label>
            <input
              class="w-100 custom-select"
              name="amount"
              v-model="amountData"
              v-validate="'required'"
              type="number"
              placeholder="Enter Amount"
            />
            <small v-if="errors.first('amount')">{{
              errors.first('amount')
            }}</small>
          </div>
        </div>
        <br />
        <textarea
          v-model="cashLogForm.comment"
          name="comment"
          class="form-control"
          rows="6"
          placeholder="Enter comment ..."
        >
        </textarea>
        <div class="text-center">
          <button
            class="btn bg-default"
            type="submit"
            
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { get, post } from '../utilities/api'
import { mapGetters } from 'vuex'

export default {
  props: {
    customerId: null,
    orderId: null,
    amortizationData: null,
    order: null,
  },
  data() {
    return {
      error: {},
      cashLogForm: {},
      amountData: '',
      paymentId: '',
      bank: '',
      paymentType: [],
      apiUrls: {
        payment: `/api/payment`,
        paymentType: `/api/payment-type`,
      },
      paymentMeths: [],
    }
  },
  async mounted() {
    await this.getPaymentType()
    this.amountData = this.amortizationData[0].expected_amount
    this.paymentMeths = this.getPaymentMethods.filter(item => {
      return item.name !== 'direct-debit'
    })
  },
  computed: {
    ...mapGetters(['getPaymentMethods', 'getBanks', 'auth', 'getAuthUserDetails']),
    canLogPaystackRepayment() {
      if (this.order.payment_gateway === 'Paystack') {
        return this.auth('AdminAccess')
      }
      return true
    },
  },
  methods: {
    async submitForm() {
      this.cashLogForm.customer_id = this.customerId
      this.cashLogForm.bank_id = this.bank
      this.cashLogForm.amount = this.amountData
      ;(this.cashLogForm.payment_method_id = this.paymentId),
        (this.cashLogForm.model_id = this.orderId)
      this.cashLogForm.payment_type_id = this.paymentType.find(
        x => x.type === 'Repayments'
      ).id
      this.cashLogForm.amount = parseFloat(this.cashLogForm.amount)
      this.cashLogForm.model = 'new_order' //Todo: Make dynamic later
      this.$validator.validateAll().then(result => {
        if (result) {
          this.$LIPS(true)
          post(this.apiUrls.payment, this.cashLogForm)
            .then(() => {
              this.paymentId = ''
              this.$LIPS(false)
              this.$swal({
                icon: 'success',
                title: 'Payment Successfully Logged',
              })
              this.$emit('done')
            })
            .catch(() => {
              this.$LIPS(false)
              // Flash.setError('Error submitting form')
            })
        } else this.$networkErr('form')
      })
    },
    async getPaymentType() {
      try {
        const fetchPaymentType = await get(this.apiUrls.paymentType)
        this.paymentType = fetchPaymentType.data.data
      } catch (err) {
        this.$displayErrorMessage(err)
      }
    },
  },
  watch: {
    orderId: function() {
      this.amountData = this.amortizationData[0].expected_amount
    },
  },
}
</script>

<style></style>
