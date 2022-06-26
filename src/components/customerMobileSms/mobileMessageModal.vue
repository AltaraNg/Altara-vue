<template>
  <div id="mobileMessageModal" class="modal fade">
    <div class="modal-dialog">
      <form
        action="javascript:"
        class="modal-content"
        @submit.prevent="sendNotification"
        id="customSMSForm"
      >
        <div class="modal-header py-2">
          <h6 class="modal-title py-2">Send Message</h6>
          <a
            aria-label="Close"
            class="close py-1"
            data-dismiss="modal"
            href="javascript:"
          >
            <span class="modal-close text-danger"
              ><i class="fas fa-times"></i
            ></span>
          </a>
        </div>
        <div class="modal-body" id="index" v-if="customer">
          <div class="form-group clearfix">
            <div class="clearfix">
              <div class="form-group">
                <label>Customer's phone no.</label>
                <input
                  class="form-control"
                  disabled
                  :value="telephone + ' - ' + customerName"
                  type="text"
                />
              </div>
              <div class="form-group d-none">
                <label>Customer ID</label>
                <input
                  class="form-control"
                  disabled
                  :value="customer.id"
                  type="text"
                />
              </div>
              <div class="form-group">
                <label>Subject</label>
                <input
                  class="form-control"
                  v-model="subject"
                  type="text"
                  v-validate="'required'"
                  name="subject"
                />
                <small v-if="errors.first('subject')">{{
                  errors.first("subject")
                }}</small>
              </div>
              <div class="form-group">
                <label>Text message</label>
                <textarea
                  rows="4"
                  v-model="message"
                  class="form-control"
                  v-validate="'required'"
                  placeholder="message goes here..."
                  name="message"
                ></textarea>
                <small v-if="errors.first('message')">{{
                  errors.first("message")
                }}</small>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer d-flex justify-content-between">
          <button class="btn status approved" type="submit">
            Send Notification
          </button>
          <a data-dismiss="modal" href="javascript:" class="text-link"
            >close dialogue</a
          >
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import { mapGetters } from "vuex";
import { post } from "../../utilities/api";
import Flash from "../../utilities/flash";
import { EventBus } from "../../utilities/event-bus";

export default {
  data() {
    return {
      value: null,
      message: null,
      subject: "Altara Update",
      customer: null,
    };
  },

  computed: {
    telephone() {
      if (this.customer != null) return this.customer.telephone;
      return null;
    },

    customerName() {
      let customer;
      if (this.customer != null) customer = this.customer;
      return this.$getCustomerFullName(customer);
    },

    ...mapGetters(["getAuthUserDetails"]),
  },

  methods: {
    async handleModalToggle({ customer }) {
      await Vue.set(this.$data, "customer", customer);
      this.toggleModal();
    },
    toggleModal() {
      $("#mobileMessageModal").modal("toggle");
    },
    async sendNotification() {
      this.$validator.validateAll().then(async (result) => {
        if (result) {
          if (this.$network()) {
            this.$LIPS(true);
            const data = await post("/api/send/customer/mobile/notification", {
              customer_id: this.customer.id,
              message: this.message,
              subject: this.subject,
            })
              .then((response) => {
                return response.data;
              })
              .catch((error) =>
                this.$displayErrorMessage(
                  "Error Sending customer mobile notification!"
                )
              );
            if (data.status =='success') {
             this.done(data.message);
            }
          } else {
            this.$networkErr();
          }
        } else {
          this.$networkErr("form");
        }
      });
    },
    done(message) {
      Flash.setSuccess(message);
      this.$scrollToTop();
      this.toggleModal();
      this.$LIPS(false);
      this.message = null;
    },
  },
  created() {
    EventBus.$on("mobileMessageModal", this.handleModalToggle);
  },
};
</script>