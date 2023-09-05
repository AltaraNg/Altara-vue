<template>
  <transition name="fade">
    <div class="pt-md-3 pt-2 verification" id="employeeRegister">
      <AutocompleteSearch
        title="customer verification"
        @customer-selected="processForm"
        :url="'/api/customer/autocomplete'"
      />

      <transition name="fade">
        <div v-if="customer">
          <customer-profile :view-customer="customer" />
        </div>
      </transition>
    </div>
  </transition>
</template>
<script>
  import Vue from "vue";
  import { log } from "../../../utilities/log";
  import Flash from "../../../utilities/flash";
  import { get, post } from "../../../utilities/api";
  import { EventBus } from "../../../utilities/event-bus";
  import { toMulipartedForm } from "../../../utilities/form";
  import CustomerProfile from "../../../components/CustomerProfile";
  import AutocompleteSearch from "../../../components/AutocompleteSearch/AutocompleteSearch";

  const init = ({ id }) => `/api/customer/${id}`;

  export default {
    props: {
      action: { default: "verify" },
      /*by default this component is used for dva verifications purposed but its customer search feature and
       * customer profile display feature is borrowed by other component to avoid duplication of
       * features hence the props: action is 'verify by default.'*/
    },

    components: {
      /*the image upload is used for the customer id and passport upload.
       * its a separate component on its own and can be called
       * anywhere on the application*/
      CustomerProfile,
      AutocompleteSearch,
    },

    data() {
      return {
        customer: null,
        customer_id: "",
        addressBtns: true,
        work_guarantorBtns: true,
        personal_guarantorBtns: true,
        processing_feeBtns: true,
        info_from_neighbors: "",
        address: {},
        work_guarantor: {},
        personal_guarantor: {},
        processing_fee: {},
        picsView: ["id_card", "passport", "proof_of_income", "guarantor_id"],
        veriView: ["work_guarantor", "personal_guarantor", "processing_fee"],
        veriData: [
          "address",
          "work_guarantor",
          "personal_guarantor",
          "processing_fee",
        ],
        cardView: [
          "passport",
          "id_card",
          "address",
          "work_guarantor",
          "personal_guarantor",
          "processing_fee",
          "guarantor_id",
          "proof_of_income",
        ],
        verification: {},
        form: {
          id_card: "",
          passport: "",
          document: "",
          proof_of_income: "",
          guarantor_id: "",
        },
        error: {},
        storeURL: "",
        user: {},
        work_guarantor_address: "",
        personal_guarantor_address: "",
      };
    },

    beforeRouteEnter({ query }, from, next) {
      if (query.id)
        get(init(query))
          .then((res) => next((vm) => vm.updateView(res.data)))
          .catch((e) => next((vm) => vm.updateView(e.response.data)));
      else next();
    },

    beforeRouteUpdate({ query }, from, next) {
      if (query.id)
        get(init(query))
          .then((res) => this.updateView(res.data))
          .catch((e) => this.updateView(e.response.data))
          .finally(() => next());
      else next();
    },

    methods: {
      modal(name) {
        $(`#${name}`).modal("toggle");
        /*this method is used to automatically
         * toggle the modal with the id of
         * "name passed to it"*/
        this.errors.clear(name);
      },

      key(key) {
        return this.customer.verification[key];
        /*the 'key' is a value that exists in the cardView array. anytime its called it checks the the customer
         * to know the status of that particular parameter eg. is the passport have not been uploaded
         * it will be 0 else 1 if uploaded with will return true */
      },

      IconClass(key) {
        return {
          "fa-check": this.key(key),
          "fa-times": !this.key(key),
        };
        /*return the 'fa-check' css class is that particular
         * card param is set to 1 else the 'fa-times'
         * css class ie false */
      },

      DivClass(key) {
        return {
          success: this.key(key),
          "no-success": !this.key(key),
        };
        /*this is similar to the DivClass method only
         * that it return a different class
         * success and no-success*/
      },

      updateView(data) {
        console.log(" i got here");
        /*$emit update event is used to send data to the parent component where this serves as a child
         * component. eg. dsa utility form. NB: The customer registration component(form)
         * is used as the customer update form for both dsa and dva portal.*/
        // eslint-disable-next-line no-prototype-builtins
        this.user = data.hasOwnProperty("user") ? data.user : null;
        Vue.set(this.$data, "customer", data.customer);
        this.$emit("update", data.customer);
        EventBus.$emit("customer", data.customer);
        if (data.customer) {
          this.verification = JSON.parse(
            JSON.stringify(data.customer.verification)
          );
          this.form.id_card = data.customer.document.id_card_url;
          this.form.passport = data.customer.document.passport_url;
          this.work_guarantor_address = `${this.customer.guaadd_houseno},
                        ${this.customer.guaadd_street},
                        ${this.customer.gua_area},
                        ${this.customer.work_guarantor_city},
                        ${this.customer.work_guarantor_state}`;
          this.personal_guarantor_address = `${this.customer?.pguaadd_houseno},
                        ${this.customer?.pguaadd_street},
                        ${this.customer?.pgua_area},
                        ${this.customer?.personal_guarantor_city},
                        ${this.customer?.personal_guarantor_state}`;
          this.form.guarantor_id = data?.customer?.document?.guarantor_id_url;
          this.form.proof_of_income =
            data?.customer?.document?.proof_of_income_url;
          this.veriData.forEach((e) => {
            //e is the current array element during the foreach call;
            this[`${e}Btns`] = !data.customer[e];
            //eg this.work_guarantorBtns = if (data.customer.work_guarantor) {return true} else {return false}
            //and anything the if return will be inverted.
            this[e] = data.customer[e] ? data.customer[e] : data[`empty_${e}`];
            //eg this.work_guarantor = if(data.customer.work_guarantor){ return data.customer.work_guarantor }
            // else {return data.empty_work_guarantor}
            //the empty_work_guarantor is returned from backend when no work guarantor has been added.
          });
        } else Flash.setError(data.message, 5000);
      },

      done() {
        return null; //TODO:I was asked to disable the sms sent when a customer is approved
        /*if (this.$getCustomerApprovalStatus(this.verification)){
                    let body =
                        "Dear " + this.$getCustomerFullName(this.customer) + ", Congratulations, You have been approved. Come to the store to make a purchase. Altara Credit Limited.";
                    (new Message(body, this.customer.telephone, true, this.user.id)).send();
                }*/
      },

      processForm(id) {
        if (this.$route.meta.mode === "verification") {
          this.$router.push(`verification?id=${id}`);
        }
        if (this.$route.name === "customerUpdate") {
          this.$router.push(`update?id=${id}`);
          get(init(this.$route.query))
            .then((res) => this.updateView(res.data))
            .catch((e) => this.updateView(e.response.data));
        }
      },

      validate(type) {
        if (this.$network()) {
          this.$LIPS(true);
          if (
            this.veriView.includes(type) &&
            !this.customer.work_guarantor_first_name
          ) {
            this.modal(`${type}_modal`);
            this.$LIPS(false);
            this.$scrollToTop();
            Flash.setError(
              "Can not process verification. Update the customer guarantors details and try again!",
              10000
            );
            return;
          }
          this.info_from_neighbors === "no"
            ? (this.address.info_from_neighbors_desc = "")
            : "";
          this[type].customer_id = this.customer.id;
          this[type].user_id = this.user.id;
          this[type].staff_name = this.user.full_name;
          this.$validator.validateAll(type).then(async (result) => {
            if (result) {
              await post(`/api/${type}`, this[type])
                .then(({ data }) => {
                  this.updateView(data.response);
                  let id = `Customer ID : ${this.customer.id}`,
                    typeCaps = this.$options.filters.capitalize(type),
                    action = `Customer${typeCaps}Verification`;
                  if (type === "address")
                    action += this.address.approval_status
                      ? "Passed"
                      : "NotPassed";
                  log(action, id);
                  Flash.setSuccess(`${typeCaps} status updated!`);
                  this.modal(`${type}_modal`);
                  this.done();
                })
                .catch((e) => Flash.setError(e.response.data.message));
              this.$LIPS(false);
              this.$scrollToTop();
            } else this.$networkErr("form");
          });
        } else this.$networkErr();
      },

      async save(document, modal) {
        this.storeURL = `/api/document/${this.customer.document.id}?_method=PUT&document=${document}`;
        this.$LIPS(true);
        this.form.document = document;
        const form = toMulipartedForm(this.form, "edit");
        await post(this.storeURL, form)
          .then(({ data }) => {
            this.updateView(data.response);
            log(
              `Customer${this.$options.filters.capitalize(document)}Upload`,
              `Customer ID : ${this.customer.id}`
            );
            this.modal(modal);
            Flash.setSuccess("Document Updated Successfully!");
            this.done();
          })
          .catch((e) => {
            this.error = e.response.data.data.errors;
          });
        this.$LIPS(false);
        this.$scrollToTop();
      },
    },

    computed: {
      check() {
        return !(!this.$isProcessing && !!this.customer_id);
      },
    },

    mounted() {
      $(document).on("hidden.bs.modal", ".modal", () => {
        this.verification = JSON.parse(
          JSON.stringify(this.customer.verification)
        );
        /*this.verification holds a copy of the this.customer.verification. this.verification is what is used to style
         * the card. this.customer.verification on the other hand is used to calculate the approval status, when
         * changing the status on the front end the this.verification is what is changed but when it is
         * reflected in the backend then the changes will be reflected on this.customer.verification
         * after going to database and returning the data again. NB: the purpose of this method
         * is revert the values of the this.verification to this.customer.verification
         * values, when a user selects a different option but doesn't submit
         * it after opening and closing the modal responsible for that
         * particular action*/
      });
    },
  };
</script>

<style lang="scss" scoped></style>
