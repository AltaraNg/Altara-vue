<template>
  <div class="">
    <div class="modal-header py-2">
      <h4>Verification Collection Data</h4>
    </div>
    <div v-if="formErrors.length" class="col-md-6 mx-auto">
      <!-- <b class="text-danger"
        >{{ formErrors.length }} error(s) occurred. Kindly fix the fill all
        required fields</b
      > -->
      <ul class="list-unstyled mx-auto">
        <li
          v-for="(error, index) in formErrors"
          :key="index"
          class="text-danger"
        >
          <b>{{ error }}</b>
        </li>
      </ul>
    </div>
    <div class="modal-body adjusted">
      <div class="form-row">
        <div class="form-group col-md-4">
          <label for="salary_day_1">Salary Day 1</label>
          <input
            type="number"
            class="form-control"
            placeholder="Salary Day 1"
            v-model="verificationCollectionData.salary_day_1"
            min="1"
            max="31"
          />
        </div>
        <div class="form-group col-md-4">
          <label for="salary_day_2">Salary Day 2</label>
          <input
            type="number"
            class="form-control"
            placeholder="Salary Day 2"
            v-model="verificationCollectionData.salary_day_2"
            min="1"
            max="31"
          />
        </div>
        <div class="form-group col-md-4">
          <label for="salary_day_3">Salary Day 3</label>
          <input
            type="number"
            class="form-control"
            placeholder="Salary Day 3"
            v-model="verificationCollectionData.salary_day_3"
            min="1"
            max="31"
          />
        </div>
      </div>
      <div class="form-row mt-5">
        <div class="form-group col-md-4">
          <label for="proof_of_credit">Proof Of Credit</label>
          <select
            class="custom-select w-100"
            id="proof_of_credit"
            v-model="verificationCollectionData.proof_of_credit"
          >
            <option disabled value="">Choose Proof Of Credit</option>
            <option
              v-for="(item, index) in proof_of_credits"
              :key="index"
              :value="item"
            >
              {{ item }}
            </option>
          </select>
        </div>
        <div class="form-group col-md-4">
          <label for="inputEmail4">Guarantor Signed</label>
          <select
            class="custom-select w-100"
            id="guarantor_signed"
            v-model="verificationCollectionData.guarantor_signed"
          >
            <option disabled value="">Did guarantor signed ?</option>
            <option
              v-for="(item, index) in guarantor_signed"
              :key="index"
              :value="item"
            >
              {{ item }}
            </option>
          </select>
        </div>
        <div class="form-group col-md-4">
          <label for="address_visited">Address Visited</label>
          <select
            class="custom-select w-100"
            id="address_visited"
            v-model="verificationCollectionData.address_visited"
          >
            <option disabled value="">Was the address visited ?</option>
            <option
              v-for="(item, index) in address_visited"
              :key="index"
              :value="item"
            >
              {{ item }}
            </option>
          </select>
        </div>
      </div>
      <div class="form-row mt-5">
        <div class="form-group col-md-6">
          <label for="credit_report_status">Credit Report Status</label>
          <select
            class="custom-select w-100"
            id="address_visited"
            v-model="verificationCollectionData.credit_report_status"
          >
            <option disabled value="">Choose credit status?</option>
            <option
              v-for="(item, index) in credit_report_status"
              :key="index"
              :value="item"
            >
              {{ item }}
            </option>
          </select>
        </div>
        <div class="form-group col-md-6">
          <label for="credit_point_status">Credit Point Status</label>
          <select
            class="custom-select w-100"
            id="credit_point_status"
            v-model="verificationCollectionData.credit_point_status"
            required
          >
            <option disabled value="">Choose credit point status?</option>
            <option
              v-for="(item, index) in credit_point_status"
              :key="index"
              :value="item"
            >
              {{ item }}
            </option>
          </select>
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <button
        type="button"
        class="btn  bg-default"
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
import { log } from "../../utilities/log";
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
      selected_proof_of_credit: "Choose Proof Of Credit",
      proof_of_credits: [
        "SMS Alert Screenshot",
        "E-statement",
        "Stamped-statement",
        "Bank App History Screenshot",
      ],
      guarantor_signed: ["2 - Yes", "1 - Yes", "No"],
      address_visited: ["Yes", "No"],
      credit_report_status: ["Bad", "Fair", "No", "Good"],
      credit_point_status: ["Bad", "Average", "Good"],
      formErrors: [],
    };
  },
  methods: {
    closeModal() {
      this.$emit("close");
    },
    sendCollectionVerificationData(e) {
      if (this.checkForm(e)) {
        this.$emit(
          "verificationCollectionDataPassed",
          this.verificationCollectionData
        );
      }
    },
    checkForm(e) {
      const formIsValid = Object.values(this.verificationCollectionData).every(
        (element) => element != null
      );
      if (formIsValid) {
        return true;
      }
      this.formErrors = [];
      if (!this.verificationCollectionData.salary_day_1) {
        this.formErrors.push("Salary Day 1 field is required.");
      }
      if (!this.verificationCollectionData.salary_day_2) {
        this.formErrors.push("Salary Day 2 field is required.");
      }
      if (!this.verificationCollectionData.salary_day_3) {
        this.formErrors.push("Salary Day 3 field is required.");
      }
      if (!this.verificationCollectionData.proof_of_credit) {
        this.formErrors.push("Please select the proof of credit");
      }
      if (!this.verificationCollectionData.guarantor_signed) {
        this.formErrors.push("Please indicate if guarantor signed");
      }
      if (!this.verificationCollectionData.address_visited) {
        this.formErrors.push("Please indicate if the address was visited");
      }
      if (!this.verificationCollectionData.credit_report_status) {
        this.formErrors.push("Please select the credit report status");
      }
      if (!this.verificationCollectionData.credit_point_status) {
        this.formErrors.push("Please select the credit point status");
      }

      e.preventDefault();
      return false;
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
