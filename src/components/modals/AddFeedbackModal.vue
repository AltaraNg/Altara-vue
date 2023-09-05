<template>
  <div>
    <div class="modal-header py-2">
      <div class="p-2 my-2">
        <i class="fas fa-plus-circle" style="font-size: 16px"></i>
        <span class="h4 mx-3">Add Feedback</span>
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
    <div class="modal-body pl-5 py-5">
      <div>
        <textarea
          cols="80"
          rows="8"
          placeholder="Add feedback..."
          class="p-3 text-black"
          v-model="feedback"
          style="font-size: 14px"
        />

        <div class="d-flex">
          <div class="form-group my-2 mr-5">
            <div>
              <label class="form-control-label">Followup Date</label>
            </div>
            <date-picker
              class="w-100"
              v-model="date"
              valueType="format"
              placeholder="Date Followed up ..."
            ></date-picker>
          </div>
          <div class="form-group my-2 ml-5">
            <div>
              <label class="form-control-label">Reason</label>
            </div>
            <select v-model="reason" class="custom-select w-75">
              <option v-for="item in statuses" :value="item.id" :key="item.id">
                {{ item.reason }}
              </option>
            </select>
          </div>
        </div>

        <button class="btn float-right bg-default mb-3" @click="addFeedback">
          Add Feedback
        </button>
      </div>
    </div>

    <div class="modal-footer justify-content-center"></div>
  </div>
</template>

<script>
  import { post } from "../../utilities/api";
  import DatePicker from "vue2-datepicker";
  import "vue2-datepicker/index.css";

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
          feedback: "/api/recollection/feedback",
        },
        feedback: "",
        reason: "",
        date: "",
        err: [],
      };
    },

    methods: {
      closeModal() {
        this.$emit("close");
      },

      async addFeedback() {
        try {
          let data = {
            new_order_id: this.modalItem?.id,
            follow_up_date: this.date,
            feedback: this.feedback,
            reason_id: this.reason,
            data: {},
          };
          this.$LIPS(true);

          const response = await post(this.apiUrl.feedback, data);
          if (response.data.status === "success") {
            this.$swal({
              icon: "success",
              title: "Feedback added Successfully",
            });
            this.$root.$emit("fetchOrders");

            this.closeModal();
          } else {
            this.$swal({
              icon: "error",
              title: "There was a problem in adding feedback",
            });
          }
        } catch (e) {
          // Handle catch block
        } finally {
          this.$LIPS(false);
        }
      },
    },
  };
</script>

<style lang="scss" scoped></style>
