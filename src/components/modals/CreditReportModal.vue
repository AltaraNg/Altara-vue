<template>
  <div>
    <div class="modal-header">
      <h3 class=" my-1" id="exampleModalLongTitle">
        Credit Report
      </h3>
      <div slot="top-right">
        <span
          type="button"
          class="close text-danger h4 my-0 py-0 pointer"
          data-dismiss="modal"
          aria-label="Close"
          @click="$modal.hide('creditReportForm')"
        >
          <span aria-hidden="true" class="h5">&times;</span>
        </span>
      </div>
    </div>
    <div class="modal-body mx-4">
      <form>
        <div class="form-group">
          <label>Select customer or guarantor: </label>
          <select class=" custom-select w-50 d-block" v-validate="'required'" v-model="full_name">
            <option :value="`${customer.first_name} ${customer.last_name}`">Self {{ `(${customer.first_name} ${customer.last_name})` }}</option>
            <option :value="item.guarantor_name" v-for="item in customer.guarantor_paystack">{{
              item.guarantor_name
            }}</option>
          </select>
        </div>

        <div class="form-group">
          <label>Credit Report (CR): </label>
          <select class=" custom-select w-50 d-block" v-validate="'required'" v-model="credit_score">
            <option value="none">N/A</option>
            <option value="good">Good</option>
            <option value="bad">Bad</option>
            <option value="fair">Fair</option>
          </select>
        </div>
        <div class="form-group">
          <label>Risk Factor: </label>
          <select class=" custom-select w-50 d-block" v-validate="'required'" v-model="risk_factor">
            <option value="low">Low</option>
            <option value="fair">Fair</option>
            <option value="high">High</option>
            <option value="very_high">Very High</option>
          </select>
        </div>

        <div class="form-group">
          <label>Status: </label>
          <select class=" custom-select w-50 d-block" v-validate="'required'" v-model="status">
            <option value="approved">Approved</option>
            <option value="declined">Declined</option>
          </select>
        </div>
      </form>
    </div>
    <div class="modal-footer mr-4">
      <button
        type="button"
        class="btn px-5 rounded bg-danger mx-3 my-5"
        data-dismiss="modal"
        @click="$modal.hide('creditReportForm')"
      >
        Close
      </button>
      <button type="button" class="btn px-4 bg-default my-5" @click="save">
        Save changes
      </button>
    </div>
  </div>
</template>

<script>
import { get, post } from "../../utilities/api"
import { EventBus } from '../../utilities/event-bus'

export default {
  props: {
    customer: {
      required: true,
      default: {},
    },
  },
  data() {
    return {
      verificationData: {},
      full_name: null,
      credit_score: null,
      risk_factor: null,
      status: null
    }
  },

  methods: {
    async save() {
      this.$validator.validateAll().then(async result => {
        if (result) {
          try {
            this.$LIPS(true)
            if(this.full_name === `${this.customer.first_name} ${this.customer.last_name}`){
                this.verificationData.customer_type = 'customer'
            }else{
                this.verificationData.customer_type = 'guarantor'
            }
            this.verificationData.customer_id = this.customer.id
            this.verificationData.type = "credit_report"
            this.verificationData.full_name = this.full_name
            this.verificationData.credit_score = this.credit_score
            this.verificationData.risk_factor = this.risk_factor
            this.verificationData.status = this.status

            let res = await post("/api/recommendation", this.verificationData)
            if (res.status === 200) {
              this.$swal({
                icon: "success",
                title: `credit report saved successfully`,
              })
              this.verificationData = {}
              EventBus.$emit("updateUser", this.customer.id)

              this.$modal.hide("creditReportForm")
            }
          } catch (err) {
            this.$swal({
              icon: "error",
              title: `Unable to complete`,
            })
          } finally {
            this.$LIPS(false)
          }
        }
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.modal-dialog {
  overflow-y: initial !important;
}
.modal-body {
  // height: 75vh;
  overflow-y: auto;
}
</style>
