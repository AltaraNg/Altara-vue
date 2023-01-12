<template>
  <div class="p-3">
    <div class="modal-header py-2">
      <div class="p-2 my-2">
        <span class="h4 mx-3">Add Vendor</span>
      </div>
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
    <div class="modal-body px-4 mx-2 py-2 mt-5">
      <form @submit.prevent="createVendor">
        <div class="form-group d-flex mx-4 my-4">
          <div class="w-100 mx-4">
            <input
              name="first_name"
              placeholder="First Name"
              v-validate="'required'"
              type="text"
              class="form-control w-100  border-dark"
            />
            <small v-if="errors.first('first_name')">{{
              errors.first('first_name')
            }}</small>
          </div>
          <div class="w-100 mx-4">
            <input
              name="last_name"
              v-validate="'required'"
              placeholder="Last Name"
              type="text"
              class="form-control w-100  border-dark"
            />
            <small v-if="errors.first('last_name')">{{
              errors.first('last_name')
            }}</small>
          </div>
        </div>
        <div class="form-group d-flex mx-4 my-4">
          <div class="w-100 mx-4">
            <input
              name="email"
              v-validate="'required|email'"
              placeholder="Email"
              type="email"
              class="form-control w-100  border-dark"
            />
            <small v-if="errors.first('email')">{{
              errors.first('email')
            }}</small>
          </div>
          <div class="w-100 mx-4">
            <input
              name="phone"
              v-validate="'required'"
              placeholder="Phone Number"
              type="text"
              class="form-control w-100  border-dark"
            />
            <small v-if="errors.first('phone')">{{
              errors.first('phone')
            }}</small>
          </div>
        </div>
        <div class="form-group d-flex mx-4 my-4">
          <div class="w-100 mx-4">
            <input
              name="address"
              v-validate="'required'"
              placeholder="Address"
              type="text"
              class="form-control w-100  border-dark"
            />
            <small v-if="errors.first('address')">{{
              errors.first('address')
            }}</small>
          </div>
        </div>
        <div class="form-group d-flex mx-4 my-4">
          <div class="w-100 mx-4">
            <label class="">
              DOB:
            </label>
            <input
              name="dob"
              placeholder="Date of Birth"
              type="date"
              class="form-control border-dark w-100"
              v-validate="'required'"

            />
            <small v-if="errors.first('dob')">{{ errors.first('dob') }}</small>
          </div>
        </div>
        <div class="form-group d-flex mx-4 my-3 px-2">
          <div class="w-100 mx-2">
            <div class="my-2">Gender</div>
            <label class="mx-2 pointer">
              <input type="radio" class="custom-radio" name="gender" v-validate="'required'" />
              Male
            </label>
            <label class="mx-2 pointer">
              <input type="radio" class="custom-radio" name="gender" v-validate="'required'" />
              Female
            </label>
            <small v-if="errors.first('gender')">{{ errors.first('gender') }}</small>

          </div>
          <div class="w-100 mx-2">
            <div class="my-2">Marital Status</div>

            <label class="mx-2 pointer">
              <input type="radio" class="custom-radio" name="marital" v-validate="'required'" />
              Single
            </label>
            <label class="mx-2 pointer">
              <input type="radio" class="custom-radio" name="marital" v-validate="'required'" />
              Married
            </label>
            <small v-if="errors.first('marital')">{{ errors.first('marital') }}</small>

          </div>
        </div>

        <div class="text-right mt-5 mb-2">
          <button class="bg-danger border-0 text-white p-3 rounded-2 mx-2">
            Cancel
          </button>

          <button
            class="bg-default border-0 p-3 rounded-2 mx-2 "
            style="font-size="
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { get, post } from '../../utilities/api'
import DatePicker from 'vue2-datepicker'
import 'vue2-datepicker/index.css'

export default {
  components: {
    DatePicker,
  },
  props: {},
  data() {
    return {
      showError: false,
      apiUrl: {
        feedback: '/api/recollection/feedback',
      },
      feedback: '',
      reason: '',
      date: '',
      err: [],
    }
  },

  methods: {
    closeModal() {
      this.$emit('close')
    },

    createVendor() {
      this.$validator.validateAll().then(async result => {})
    },

    async addFeedback() {
      try {
        let data = {
          new_order_id: this.modalItem?.id,
          follow_up_date: this.date,
          feedback: this.feedback,
          reason_id: this.reason,
          data: {},
        }
        this.$LIPS(true)

        const response = await post(this.apiUrl.feedback, data)
        if (response.data.status === 'success') {
          this.$swal({
            icon: 'success',
            title: 'Feedback added Successfully',
          })
          this.$root.$emit('fetchOrders')

          this.closeModal()
        } else {
          this.$swal({
            icon: 'error',
            title: 'There was a problem in adding feedback',
          })
        }
      } catch (e) {
      } finally {
        this.$LIPS(false)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
input::placeholder {
  color: darkslategrey;
}
</style>
