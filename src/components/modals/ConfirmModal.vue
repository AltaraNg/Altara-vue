<template>
  <div
    id="changeCustomerManagerModal"
    class="modal fade w-50 mx-auto h-50 my-auto"
  >
    <div class="modal-dialog ">
      <div class="modal-content">
        

        <div class="modal-body row" id="index">
          <div class="mx-auto col-2">
            <!-- Heroicon name: outline/exclamation-triangle -->
            <svg class=" text-danger" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
          </div>
          <div class="col-10">
            <h2 class="my-2">Attention!</h2>
            <p class="text-left text-capitalize h5 mx-2 my-4"><slot :customer="{customer}"></slot></p>
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
    customer: {
      required: false
    }
      
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
