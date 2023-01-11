<template>
  <div>
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
    <div class="modal-body px-2 py-5">
      <form>
        <div class="form-group d-flex mx-4">
          <input
            placeholder="First Name"
            type="text"
            class="form-control w-50 mx-1 border-dark"
          />
          <input
            placeholder="Last Name"
            type="text"
            class="form-control w-50 mx-1"
          />
        </div>
        <div class="form-group d-flex mx-4">

        </div>
      </form>
    </div>

    <div class="modal-footer justify-content-center"></div>
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
  props: {
    modalItem: {
      required: true,
    },
    statuses: {
      required: true,
    },
  },
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
input::placeholder{
    color: darkslategrey;
}</style>
