<template>
    <transition>
        <div>
    
            <div class=" d-flex justify-content-center gap-5">
                <div class="text-center my-2 flex-grow-1">
                    <button class="btn bg-default px-3" @click="verifyFormalModal">
                    Formal
                    </button>
                </div>
                <div class="text-center my-2 flex-grow-1">
                    <button class="btn bg-default px-3" @click="verifyInformalModal">
                    Informal
                    </button>
                </div>
            </div>
            <modal
                name="customer-guarantor"
                :adaptive="true"
                :height="'auto'"
                :clickToClose="false"
                :reset="true"
            >
                <customer-guarantors-modal
                :modalItem="customer.guarantor_paystack"
                :customer="customer"
                @close="hide('customer-guarantor')"
        />
            </modal>
        </div>
    
    </transition>

  </template>
  
  <script>
  import Vue from 'vue'
  import InformalQuestions from './InformalQuestions.vue';
  import FormalQuestions from './FormalQuestions.vue';
  import { mapActions, mapGetters } from 'vuex'
  export default {
    props: ["viewCustomer"],
    name: '',
    data() {
    return {
      customer: "",
      showCustomer: false,
    }
  },

  components: {
    InformalQuestions,
    FormalQuestions
  },
  computed: {
    ...mapGetters(["auth"]),
    full() {
      return this.$route.meta.mode === "full"
    },
  },

  created() {
    $(".tooltip").remove()
    if (this.viewCustomer) this.setCustomer(this.viewCustomer)
    EventBus.$on("customer", customer => this.setCustomer(customer))
    this.addCustomerOptionsModalsToDom()
  },

    methods: {
        setCustomer(customer) {
      Vue.set(this.$data, "customer", customer)
      this.showCustomer = true
    },

    show(modal) {
      this.$modal.show(modal)
    },

    hide(modal) {
      this.$modal.hide(modal)
    },
        verifyFormalModal() {
            this.$modal.show(
                FormalQuestions,
                { customer: this.customer },
                {
                name: "verificationForm",
                classes: ["w-50", "overflow-hidden"],
                adaptive: true,
                resizable: true,
                height: "auto",
                width: "50%",
                clickToClose: true,
                maxHeight: 200,
                },
                {
                closed: event => {},
                }
        )
    },
        verifyInformalModal() {
            this.$modal.show(
                InformalQuestions,
                { customer: this.customer },
                {
                name: "verificationForm",
                classes: ["w-50", "overflow-hidden"],
                adaptive: true,
                resizable: true,
                height: "auto",
                width: "50%",
                clickToClose: true,
                maxHeight: 200,
                },
                {
                closed: event => {},
                }
        )
    },
    },
  };
  </script>
  
  <style scoped>
  
  </style>
  