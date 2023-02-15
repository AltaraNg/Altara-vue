<template>
  <div>
    <div class="modal-header">
      <h3 class="modal-title" id="exampleModalLongTitle">
        Verification Checklist
      </h3>
      <div slot="top-right">
        <span
          type="button"
          class="close text-danger h4 my-0 py-0 pointer"
          data-dismiss="modal"
          aria-label="Close"
          @click="$modal.hide('verificationForm')"
        >
          <span aria-hidden="true" class="h5">&times;</span>
        </span>
      </div>
    </div>
    <div class="modal-body">
      <form>
        <div class="form-group my-3">
          <label for="checklist1" class=""
            >What location was visited and verified?</label
          ><br />
          <div
            class="form-check form-check-radio form-check-inline"
            v-for="option in verifiedOptions"
          >
            <label class="form-check-label">
              <input
                v-model="verificationData.location"
                type="radio"
                class="form-check-input "
                :value="option"
                name="checklist1"
                v-validate="'required'"
              />
              <span class="px-2">{{ option }}</span>
              <span class="form-check-sign"> </span>
            </label>
          </div>
        </div>
        <div class="form-group my-3">
          <label for="checklist">If other, Specify</label>
          <input
            type="text"
            class="form-control "
            v-model="verificationData.otherOption"
          />
        </div>
        <div class="form-group my-3">
          <label for="exampleFormControlSelect2"
            >Does the Address match what was given in the application
            form</label
          >
          <br />

          <div class="form-check form-check-radio form-check-inline">
            <label class="form-check-label">
              <input
                v-model="verificationData.addressMatch"
                type="radio"
                class="form-check-input "
                value="yes"
                name="checklist2"
                v-validate="'required'"
              />
              <span class="px-2">Yes</span>
              <span class="form-check-sign"> </span>
            </label>
          </div>
          <div class="form-check form-check-radio form-check-inline">
            <label class="form-check-label">
              <input
                v-model="verificationData.addressMatch"
                type="radio"
                class="form-check-input "
                value="yes"
                name="checklist2"
                v-validate="'required'"
              />
              <span class="px-2">No</span>
              <span class="form-check-sign"> </span>
            </label>
          </div>
        </div>

        <div class="form-group my-3">
          <label for="exampleFormControlSelect2"
            >Does the Address match what was given in the Bank Statement</label
          >
          <br />

          <div class="form-check form-check-radio form-check-inline">
            <label class="form-check-label">
              <input
                v-model="verificationData.addressMatchBank"
                type="radio"
                class="form-check-input "
                value="yes"
                name="checklist3"
                v-validate="'required'"
              />
              <span class="px-2">Yes</span>
              <span class="form-check-sign"> </span>
            </label>
          </div>
          <div class="form-check form-check-radio form-check-inline">
            <label class="form-check-label">
              <input
                v-model="verificationData.addressMatchBank"
                type="radio"
                class="form-check-input "
                value="no"
                name="checklist3"
                v-validate="'required'"
              />
              <span class="px-2">No</span>
              <span class="form-check-sign"> </span>
            </label>
          </div>
        </div>
        <div class="form-group">
          <label for="exampleFormControlTextarea1"
            >If no, what’s the reason? And who’s house is it? When did they move
            out from the address?</label
          >
          <textarea
            v-model="verificationData.reasonForDiffer"
            class="form-control"
            id="exampleFormControlTextarea1"
            rows="3"
          ></textarea>
        </div>

        <div class="form-group my-3">
          <label for="exampleFormControlSelect2"
            >Is this customer aware of what happens when he/she defaults?</label
          >
          <br />

          <div class="form-check form-check-radio form-check-inline">
            <label class="form-check-label">
              <input
                v-model="verificationData.awareOfPenalty"
                type="radio"
                class="form-check-input "
                value="yes"
                name="checklist4"
                v-validate="'required'"
              />
              <span class="px-2">Yes</span>
              <span class="form-check-sign"> </span>
            </label>
          </div>
          <div class="form-check form-check-radio form-check-inline">
            <label class="form-check-label">
              <input
                v-model="verificationData.awareOfPenalty"
                type="radio"
                class="form-check-input "
                value="no"
                name="checklist4"
                v-validate="'required'"
              />
              <span class="px-2">No</span>
              <span class="form-check-sign"> </span>
            </label>
          </div>
        </div>

        <div class="form-group my-3">
          <label for="exampleFormControlSelect2"
            >Was the customer double verified? i.e office/shop and home</label
          >
          <br />

          <div class="form-check form-check-radio form-check-inline">
            <label class="form-check-label">
              <input
                v-model="verificationData.locationDoubleChecked"
                type="radio"
                class="form-check-input "
                value="yes"
                name="checklist5"
                v-validate="'required'"
              />
              <span class="px-2">Yes</span>
              <span class="form-check-sign"> </span>
            </label>
          </div>
          <div class="form-check form-check-radio form-check-inline">
            <label class="form-check-label">
              <input
                v-model="verificationData.locationDoubleChecked"
                type="radio"
                class="form-check-input "
                value="no"
                name="checklist5"
                v-validate="'required'"
              />
              <span class="px-2">No</span>
              <span class="form-check-sign"> </span>
            </label>
          </div>
        </div>

        <div class="form-group my-3">
          <label for="exampleFormControlTextarea1"
            >What is the nature of the home/office/business location - how does
            it look? Is it obvious the customer lives there? Family pictures ?
            business name?</label
          >
          <textarea
            v-model="verificationData.natureOfLocation"
            class="form-control"
            id="exampleFormControlTextarea1"
            rows="3"
            v-validate="'required'"
          ></textarea>
        </div>

        <div class="form-group my-3">
          <label for="exampleFormControlTextarea1"
            >What was the feedback from the neighbour?</label
          >
          <textarea
            v-model="verificationData.feedbackFromNeighbor"
            class="form-control"
            id="exampleFormControlTextarea1"
            rows="3"
            v-validate="'required'"
          ></textarea>
        </div>

        <div class="form-group my-3">
          <label for="exampleFormControlTextarea1"
            >How long has the customer lived there, worked there or had their
            business there? Based on feedback from neighbour?</label
          >
          <textarea
            v-model="verificationData.howLongInLocation"
            class="form-control"
            id="exampleFormControlTextarea1"
            rows="3"
            v-validate="'required'"
          ></textarea>
        </div>

        <div class="form-group my-3">
          <label for="checklist">Date of verification</label>
          <input
            v-model="verificationData.dateVerified"
            type="date"
            class="form-control date-picker"
            data-datepicker-color="primary"
            v-validate="'required'"
          />
        </div>
      </form>
    </div>
    <div class="modal-footer">
      <button
        type="button"
        class="btn btn-secondary"
        data-dismiss="modal"
        @click="$modal.hide('verificationForm')"
      >
        Close
      </button>
      <button type="button" class="btn btn-primary" @click="save">
        Save changes
      </button>
    </div>
  </div>
</template>

<script>
import { get, post } from '../../utilities/api'
export default {
  props: {
    customer: {
      required: true,
      default: {},
    },
  },
  data() {
    return {
      verifiedOptions: ['Home', 'Business', 'Office', 'Other'],
      vAgents: null,
      verificationData: {},
    }
  },

  methods: {
    async save() {
      this.$validator.validateAll().then(async result => {
        if (result) {
          try {
            this.$LIPS(true)
            this.verificationData.customer_id = this.customer.id
            let res = await post('/api/saveVerification', this.verificationData)
            if (res.status === 200) {
              this.$swal({
                icon: 'success',
                title: `verification saved successfully`,
              })
              this.verificationData = {}
            }
          } catch (err) {
            this.$swal({
              icon: 'error',
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
  height: 80vh;
  overflow-y: auto;
}
</style>
