<template>
  <div id="CustomDirectDebitModal" class="modal fade" v-if="customer">
    <div class="modal-dialog">
      <form
        action="javascript:"
        class="modal-content"
        id="directDebitModalForm"
        @submit.prevent="chargeCustomerWithCustomDirectDebit"
      >
        <div class="modal-header ml-5 py-3 text-center">
          <h6 class="modal-title my-modal text-center w-75">
            Custom Direct Debit
          </h6>
          <a
            aria-label="Close"
            class="close py-1"
            data-dismiss="modal"
            href="javascript:"
          >
            <span class="modal-close text-danger"
              ><i class="fas fa-times"></i
            ></span>
          </a>
        </div>
        <div class="modal-body" id="index" v-if="order">
          <div class="form-group clearfix">
            <div class="clearfix">
              <div class="form-group">
                <label>Order Number: </label>
                <span class="font-weight-bold mx-2">{{
                  order.order_number
                }}</span>
              </div>

              <div class="form-group">
                <label>Account</label>
                <br />
                <select
                  class="custom-select w-50"
                  name="payer"
                  v-model="account"
                >
                  <option :value="0">Self</option>
                  <option
                    v-if="
                      customer !== null &&
                        customer.guarantor_paystack.length > 0
                    "
                    v-for="guarantor in customer.guarantor_paystack"
                    :value="guarantor.id"
                    >{{ guarantor.guarantor_name }}</option
                  >
                </select>
              </div>

              <div class="form-group">
                <label>Amount</label>
                <currency-input
                  class="form-control w-50"
                  placeholder="Amount"
                  v-model="amount"
                  :options="inputOptions"
                ></currency-input>
                <!-- <input
									type="number"
									class="form-control"
									placeholder="Amount"
									v-model="amount"
								/> -->
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer d-flex justify-content-end">
          <button class="btn status approved" type="submit">
            Process debit
          </button>
          <button
            class="btn btn-danger rounded-1 mx-2"
            data-dismiss="modal"
            href="javascript:"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'

import { post } from '../../utilities/api'
import Flash from '../../utilities/flash'
import { EventBus } from '../../utilities/event-bus'
import CurrencyInput from '../CurrencyInput.vue'

export default {
  components: {
    CurrencyInput,
  },
  data() {
    return {
      order: null,
      amount: null,
      customer: null,
      account: 0,
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
    }
  },
  methods: {
    closePayStackModal: () => {},
    async chargeCustomerWithCustomDirectDebit(e) {
      this.$LIPS(true)
      try {
        const response = await post('api/charge/customer', {
          order_id: this.order.id,
          amount: this.amount,
          account: this.account,
        })
        if (response.data.status == 'success') {
          this.$swal({
            icon: 'success',
            title: response.data.message,
          })
          this.done(response.data.message)
        } else {
          Flash.setError(response.data.message)
        }
      } catch (error) {
        this.$LIPS(false)
        if (error.response) {
          this.$displayErrorMessage(error.response.data.message)
        } else {
          this.$displayErrorMessage('Something went wrong')
        }
        this.toggleModal()
      }
      return
    },
    async handleModalToggle({ amount, order, customer }) {
      await Vue.set(this.$data, 'order', order)
      await Vue.set(this.$data, 'amount', amount)
      await Vue.set(this.$data, 'customer', customer)

      this.toggleModal()
    },
    toggleModal() {
      $('#CustomDirectDebitModal').modal('toggle')
    },
    resetValues() {
      this.account = 0
      this.amount = null
    },
    done(message) {
      this.resetValues()
      Flash.setSuccess(message)
      this.$scrollToTop()
      EventBus.$emit('updateUser', this.order.customer_id)
      this.toggleModal()
      this.message = null
    },
  },
  mounted() {
    EventBus.$on('CustomDirectDebitModal', this.handleModalToggle)
  },
  components: { CurrencyInput },
}
</script>
<style scoped>
.my-modal {
  font-size: 1.5em;
}
</style>
