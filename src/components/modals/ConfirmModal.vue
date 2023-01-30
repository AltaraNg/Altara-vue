<template>
  <div
    id="changeCustomerManagerModal"
    class="modal fade w-50 mx-auto h-50 my-auto"
  >
    <div class="modal-dialog ">
      <div class="modal-content">
        <div class="modal-header">
          <a
            aria-label="Close"
            class=" "
            data-dismiss="modal"
          >
            <div aria-hidden="true" class="modal-close text-danger text-right w-100">
              <i class="fas fa-times close-button"></i>
            </div>
          </a>
        </div>

        <div class="modal-body" id="index">
          <p class="text-center h3">Are you sure?</p>
          <div class="d-flex justify-content-end">
            <div class="form-group clearfix mx-2">
              <button class="btn bg-danger" @click="$emit('touched', false)">
                Cancel
              </button>
            </div>
            <div class="form-group clearfix mx-2">
              <button class="btn bg-default" @click="$emit('touched', true)">
                Proceed
              </button>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: false,
      required: false,
    },
  },

  methods: {
    handleModalToggle() {
      $('#changeCustomerManagerModal').modal('toggle')
    },
  },
  watch: {
    show() {
      this.handleModalToggle()
    },
  },
}
</script>

<style scoped></style>
