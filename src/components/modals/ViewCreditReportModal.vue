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
          @click="$modal.hide('creditReportView')"
        >
          <span aria-hidden="true" class="h5">&times;</span>
        </span>
      </div>
    </div>
    <div class="modal-body">
      <ol class="list-group">
        <li class="list-group-item my-3">
          <label for="checklist1" class="">Name</label>
          <p class="display-text">
            {{ creditReport.full_name }}
          </p>
        </li>
        <li class="list-group-item my-3">
          <label for="checklist">Type</label>
          <p class="display-text">
            {{ creditReport.customer_type || "N/A" }}
          </p>
        </li>

        <li class="list-group-item my-3">
          <label for="checklist1" class="">Credit report score</label>
          <p class="display-text">
            {{ creditReport.credit_score }}
          </p>
        </li>

        <li class="list-group-item my-3" v-if="creditReport.credit_point">
          <label for="checklist1" class="">Credit Point score</label>
          <p class="display-text">
            {{ creditReport.credit_point }}
          </p>
        </li>

        <li class="list-group-item my-3">
          <label for="checklist1" class="">Risk Factor</label>
          <p class="display-text">
            {{ creditReport.risk_factor }}
          </p>
        </li>
        <li class="list-group-item my-3">
          <label for="exampleFormControlSelect2">Status</label>
          <p class="display-text">
            {{ creditReport.status }}
          </p>
        </li>
        <li class="list-group-item my-3">
          <label for="exampleFormControlSelect2">Account Number</label>
          <p class="display-text">
            {{ creditReport.accountNo }}
          </p>
        </li>
        <li class="list-group-item my-3">
          <label for="exampleFormControlSelect2">Bank</label>
          <p class="display-text">
            {{ creditReport.bankName }}
          </p>
        </li>

        <li class="list-group-item my-3">
          <label for="checklist">Verification was done by?</label>
          <p class="display-text">
            {{ creditReport.verifiedBy }}
          </p>
        </li>
      </ol>
    </div>
    <div class="modal-footer px-4">
      <button
        type="button"
        class="btn btn-danger rounded"
        data-dismiss="modal"
        @click="$modal.hide('creditReportView')"
      >
        Close
      </button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    creditReport: {
      required: true,
      default: {},
    },
  },
  data() {
    return {}
  },

  methods: {},
  created() {},
}
</script>

<style lang="scss" scoped>
.modal-dialog {
  overflow-y: initial !important;
}
.modal-body {
  height: 55vh;
  overflow-y: auto;
}
.display-text {
  color: black;
  font-size: 1.5em;
  font-weight: 500;
  text-transform: capitalize;
}
</style>
