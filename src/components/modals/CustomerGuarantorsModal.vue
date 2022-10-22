<template>
  <div class="h-50">
    <div class="modal-header py-2">
      <h4>Customer Guarantors</h4>
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
    <div class="modal-body" v-if="modalItem.length > 0">
      <div class="table-responsive">
        <table class="table table-bordered table-striped">
          <tbody>
            <tr>
              <th>S/N</th>
              <th>Email</th>
              <th>Name</th>
              <th>Date Added</th>
            </tr>
            <tr v-for="(item, index) in modalItem">
              <td>{{ index + 1 }}</td>
              <td>{{ item.guarantor_email }}</td>
              <td>{{ item.guarantor_name }}</td>
              <td>{{ item.created_at }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <paystack
        :amount="10000"
        :email="customer ? customer.email : ''"
        :paystackkey="paystackkey"
        :reference="reference"
        :callback="processPaymentPayStackPayment"
        :close="closePayStackModal"
        class="border-0 p-3 rounded-2 float-right my-3 bg-default"
      >
        <i class="mr-3 fas fa-plus"></i>
        <strong>Add Guarantor</strong>
      </paystack>
    </div>

    <div v-else class="modal-body text-center">
      <div>
        <h3>No Guarantor Added Yet</h3>
      </div>
      <paystack
        :amount="10000"
        :email="customer ? customer.email : ''"
        :paystackkey="paystackkey"
        :reference="reference"
        :callback="processPaymentPayStackPayment"
        :close="closePayStackModal"
        class="border-0 p-3 rounded bg-default"
      >
        <i class="mr-3 fas fa-plus"></i>
        <strong>Add Guarantor</strong>
      </paystack>
    </div>
  </div>
</template>

<script>
import paystack from 'vue-paystack'
import { post } from '../../utilities/api'
import { EventBus } from '../../utilities/event-bus'
import flash from '../../utilities/flash'

export default {
  components: {
    paystack,
  },
  props: {
    modalItem: {
      required: true,
    },
    customer: {
      required: true,
    },
  },
  data() {
    return {
      verifyPaymentUrl: `https://api.paystack.co/transaction/verify/`,
      guarantor_paystack: '/api/guarantor_paystack',
      paystackkey: process.env.VUE_APP_PAYSTACK_KEY || '',
      paystack_secret_key: process.env.VUE_APP_PAYSTACK_SECRET_KEY || '',
      authorization_code: null,
      paystackReference: null,
    }
  },

  methods: {
    closeModal() {
      this.$emit('close')
    },
    async processPaymentPayStackPayment(resp) {
      this.paystackReference = resp.reference
      if (resp.status == 'success' && resp.message == 'Approved') {
        await this.verifyPaystackPayment()
          .then(data => {
            if (data.status && data.message == 'Verification successful') {
              this.$LIPS(true)
              let guarantorName = `${data.data.customer.first_name} ${data.data.customer.last_name}`

              this.authorization_code =
                data.data.authorization.authorization_code

              post(this.guarantor_paystack, {
                customer_id: this.customer.id,
                auth_code: this.authorization_code,
                guarantor_email: data.data.customer.email,
                guarantor_name:
                  guarantorName === ' ' ? 'test user' : guarantorName,
              })
                .then(res => {
                  this.done('AuthCode set successfully!')
                })
                .catch(err => {
                  flash.setError(err.message)
                })
                .finally(() => {
                  this.$LIPS(false)
                })
            }
          })
          .catch(error => {
            this.$displayErrorMessage(error)
          })
      }
    },

    async verifyPaystackPayment() {
      const url = `${this.verifyPaymentUrl}${this.paystackReference}`
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${process.env.VUE_APP_PAYSTACK_SECRET_KEY}`,
        },
      })
      return response.json()
    },
    closePayStackModal: () => {},
    done(message) {
      flash.setSuccess(message)
      this.$scrollToTop()
      this.$LIPS(false)
      this.message = null
      EventBus.$emit('updateUser', this.customer.id)
    },
  },

  computed: {
    reference() {
      let text = ''
      let possible =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

      for (let i = 0; i < 10; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length))
      return text
    },
  },
}
</script>

<style lang="scss" scoped>
.adjusted {
  height: 70vh;
  overflow-y: auto;
}
</style>
