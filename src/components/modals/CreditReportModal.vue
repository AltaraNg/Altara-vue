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
        <div class="w-100">
          <toggle-button
            v-on:valueChangedEvent="triggerToggleEvent"
            :switchName="'Guarantor'"
            :key="'Guarantor'"
            :defaultState="isGuarantor"
            :label="'Guarantor'"
          />
        </div>
        <div class="form-group w-50 px-2">
          <label>{{ isGuarantor ? "Guarantor Name" : "Customer" }} </label>
          <input
            type="text"
            class="w-50 d-block custom-select"
            v-validate="'required'"
            v-model="full_name"
            v-if="isGuarantor"
          />
          <div v-else class="py-1 h5 ">
            {{ `${customer.first_name} ${customer.last_name}` }}
          </div>
        </div>
        <fieldset class="d-flex flex-fill flex-wrap py-2">
          <div class="form-group w-50 px-2">
            <label>Credit Report (CR): </label>
            <select
              class="custom-select w-100 d-block"
              v-validate="'required'"
              v-model="credit_score"
            >
              <option value="none">N/A</option>
              <option value="good">Good</option>
              <option value="bad">Bad</option>
              <option value="fair">Fair</option>
            </select>
          </div>

          <div class="form-group w-50 px-2" v-if="!isGuarantor">
            <label>Credit Point (CP): </label>
            <select
              class=" custom-select w-100 d-block"
              v-validate="'required'"
              v-model="credit_point"
            >
              <option value="none">N/A</option>
              <option value="good">Good</option>
              <option value="bad">Bad</option>
              <option value="fair">Fair</option>
            </select>
          </div>
          <div class="form-group w-50 px-2">
            <label>Risk Factor: </label>
            <select
              class=" custom-select w-100 d-block"
              v-validate="'required'"
              v-model="risk_factor"
            >
              <option value="low">Low</option>
              <option value="fair">Fair</option>
              <option value="high">High</option>
              <option value="very_high">Very High</option>
            </select>
          </div>

          <div class="form-group w-50 px-2">
            <label>Status: </label>
            <select
              class=" custom-select w-100 d-block"
              v-validate="'required'"
              v-model="status"
            >
              <option value="approved">Approved</option>
              <option value="declined">Declined</option>
            </select>
          </div>
        </fieldset>
        <fieldset class="d-flex flex-fill flex-wrap py-2">
          <legend>Bank Information</legend>
          <div class="form-group w-50 px-2">
            <label for="bankName">Bank Name</label>
            <input
              v-model="bankName.name"
              class="custom-select w-100 d-block"
              id="bankName"
              v-validate="!isGuarantor ? 'required' : ''"

              @input="onDropdown"
            />
            <div class="w-100  py-2 drop-down" v-if="showDropdown">
              <div
                class="pointer py-1 bItem mx-2 px-2"
                v-for="bank in filteredList()"
                :key="bank.code"
                @click="selectBank(bank)"
              >
                <p>{{ bank.name }}</p>
              </div>
              <div class="item error" v-if="bankName && !filteredList().length">
                <p>No results found!</p>
              </div>
            </div>
          </div>
          <div class="form-group w-50 px-2">
            <label for="accountNo">Account Number on bank statement</label>
            <div class="d-flex">
              <input
                v-model="accountNo"
                class="custom-select w-100 d-block mx-2"
                id="accountNo"
                v-validate="!isGuarantor ? 'required' : ''"

              />
              <span
                ><button
                  type="button"
                  class="py-3 bg-default px-2"
                  @click="verifyAccount"
                >
                  Verify
                </button></span
              >
            </div>
          </div>

          <div class="form-group w-50 px-2">
            <label for="accountNo">Account Name on bank statement</label>
            <input
              v-model="accountName"
              class="custom-select w-100 d-block"
              id="accountNo"
              v-validate="!isGuarantor ? 'required' : ''"
              :disabled="!verified"
            />
          </div>
        </fieldset>
      </form>
    </div>
    <div class="text-right mr-4">
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
import Axios from "axios"
import { post } from "../../utilities/api"
import { EventBus } from "../../utilities/event-bus"
import ToggleButton from "../ToggleButton.vue"

export default {
  components: {
    ToggleButton,
  },

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
      credit_point: null,
      risk_factor: null,
      status: null,
      isGuarantor: false,
      accountNo: null,
      bankName: {},
      bankList: [],
      showDropdown: false,
      accountName: null,
      verified: false,
    }
  },

  methods: {
    async save() {
      this.$validator.validateAll().then(async result => {
        if (result) {
          try {
            this.$LIPS(true)
            if (this.isGuarantor) {
              this.verificationData.customer_type = "guarantor"
            } else {
              this.verificationData.customer_type = "customer"
              this.full_name = `${this.customer.first_name} ${this.customer.last_name}`
              this.verificationData.credit_point = this.credit_point
            }
            this.verificationData.customer_id = this.customer.id
            this.verificationData.type = "credit_report"
            this.verificationData.full_name = this.full_name
            this.verificationData.credit_score = this.credit_score
            this.verificationData.risk_factor = this.risk_factor
            this.verificationData.status = this.status
            this.verificationData.accountNo = this.accountNo
            this.verificationData.bankName = this.bankName.name
            this.verificationData.accountName = this.accountName

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

    async verifyAccount() {      
        this.$LIPS(true)
        let bankCode = this.bankName.code
        let accountNumber = this.accountNo
        let url = `https://api.paystack.co/bank/resolve?account_number=${accountNumber}&bank_code=${bankCode}`;
        await fetch(url, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${process.env.VUE_APP_PAYSTACK_SECRET_KEY}`,
          },
        }).then((resp) =>  resp.json()).then(data => {
          this.accountName = data?.data?.account_name;
        });

        this.$LIPS(false)
      } ,
    

    triggerToggleEvent(value, switchName) {
      this[`triggerToggleEvent${switchName}`](value)
    },
    triggerToggleEventGuarantor() {
      this.isGuarantor = !this.isGuarantor
    },
    fetchBankList() {
      Axios.get("https://api.paystack.co/bank")
        .then(res => {
          this.bankList = res?.data?.data
        })
        .catch(() => {})
    },

    filteredList() {
      return this.bankList.filter(bank => {
        return bank.name
          ?.toLowerCase()
          .includes(this.bankName.name?.toLowerCase())
      })
    },

    selectBank(bank) {
      this.bankName = bank
      this.showDropdown = false
    },
    onDropdown() {
      this.showDropdown = true
    },
  },
  created() {
    this.fetchBankList()
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

option * {
  padding: 1em 0;
}
.drop-down {
  background-color: gainsboro;
  color: black;
  height: 70px;
  overflow-y: auto;
}

.bItem:hover {
  background: #eee;
}
</style>
