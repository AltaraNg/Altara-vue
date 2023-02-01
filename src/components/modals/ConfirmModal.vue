<template>
  <div
    id="confirmModal"
    class="modal fade"
    role="dialog"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog" role="document">
      <div class="modal-content rounded-2">
        <div class="">
          <button
            type="button"
            class="close"
            data-dismiss="modal"
            aria-label="Close"
          >
            <span aria-hidden="true" class="h1 mr-3 text-danger">&times;</span>
          </button>
        </div>

        <div class="modal-body row p-4" id="index">
          <div class="col-2 w-100 text-center mt-2 px-1">
            <!-- Heroicon name: outline/exclamation-triangle -->
            <svg
              class="text-danger w-50"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
              />
            </svg>
          </div>
          <div class="col-10 px-1">
            <h3 class="my-2 font-weight-bold">Attention!</h3>
            <p class="text-left text-capitalize h5 font-weight-light mx-4 mt-4">
              <slot :customer="{ customer }"></slot>
            </p>
            <div class="d-flex justify-content-end mt-4 mx-3">
              <div class="form-group  mx-2">
                <button class="btn bg-danger my-0 h2 font-weight-light" data-dismiss="modal">
                  Cancel
                </button>
              </div>
              <div class="form-group  mx-2">
                <button class="btn bg-default my-0 h2 font-weight-light" @click="$emit('touched', true)">
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
      required: false,
    },
  },

  methods: {
    handleModalToggle() {
      $('#confirmModal').modal('toggle')
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
