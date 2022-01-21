<template>
  <div class="">
    <div class="modal-header py-2">
      <h4>Verification Collection Data</h4>
    </div>
    <div class="modal-body adjusted">
      <div class="form-row">
        <div class="form-group col-md-4">
          <label for="inputEmail4">Salary Day 1</label>
          <input
            type="text"
            class="form-control"
            placeholder="Salary Day 1"
            v-model="verificationCollectionData.salary_day_1"
          />
        </div>
        <div class="form-group col-md-4">
          <label for="inputEmail4">Salary Day 2</label>
          <input
            type="text"
            class="form-control"
            placeholder="Salary Day 2"
            v-model="verificationCollectionData.salary_day_2"
          />
        </div>
        <div class="form-group col-md-4">
          <label for="inputEmail4">Salary Day 3</label>
          <input
            type="text"
            class="form-control"
            placeholder="Salary Day 3"
            v-model="verificationCollectionData.salary_day_3"
          />
        </div>
      </div>
      <div class="form-row mt-5">
        <div class="form-group col-md-4">
          <label for="inputEmail4">Proof Of Credit</label>
          <input
            type="text"
            class="form-control"
            placeholder="Proof Of Credit"
            v-model="verificationCollectionData.proof_of_credit"
          />
        </div>
        <div class="form-group col-md-4">
          <label for="inputEmail4">Guarantor Signed</label>
          <input
            type="text"
            class="form-control"
            placeholder="Guarantor Signed"
            v-model="verificationCollectionData.guarantor_signed"
          />
        </div>
        <div class="form-group col-md-4">
          <label for="inputEmail4">Address Visited</label>
          <input
            type="text"
            class="form-control"
            placeholder="Address Visted"
            v-model="verificationCollectionData.address_visited"
          />
        </div>
      </div>
      <div class="form-row mt-5">
        <div class="form-group col-md-6">
          <label for="inputEmail4">Credit Report Status</label>
          <input
            type="text"
            class="form-control"
            placeholder="Credit Report Status"
            v-model="verificationCollectionData.credit_report_status"
          />
        </div>
        <div class="form-group col-md-6">
          <label for="inputEmail4">Credit Point Status</label>
          <input
            type="text"
            class="form-control"
            placeholder="Credit Point Status"
            v-model="verificationCollectionData.credit_point_status"
          />
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <button
        type="button"
        class="btn btn-primary"
        @click="sendCollectionVerificationData"
      >
        Save changes
      </button>
      <button
        type="button"
        class="btn btn-secondary"
        data-dismiss="modal"
        @click="closeModal"
      >
        Close
      </button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    modalItem: {
      required: false,
    },
  },
  data() {
    return {
      verificationCollectionData: {
        salary_day_1: null,
        salary_day_2: null,
        salary_day_3: null,
        proof_of_credit: null,
        guarantor_signed: null,
        address_visited: null,
        credit_report_status: null,
        credit_point_status: null,
      },
    };
  },
  methods: {
    closeModal() {
      this.$emit("close");
    },
    sendCollectionVerificationData() {
		this.$emit('verificationCollectionDataPassed', this.verificationCollectionData)
    },
  },
};
</script>

<style lang="scss" scoped>
.adjusted {
  //   height: 70vh;
  overflow-y: auto;
}
</style>
