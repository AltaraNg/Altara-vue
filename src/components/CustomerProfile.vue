<template>
  <transition name="fade">
    <div
      :class="full && 'px-md-4 px-2'"
      style="margin-left: 5rem; margin-right: 5rem"
    >
      <!--TODO cleanup-->

      <app-navigation
        :forward="{ path: $routerHistory.next().path }"
        :previous="{ path: $routerHistory.previous().path }"
        :pageTitle="'Customer Profile'"
        :pageTitleSmall="'Customer Profile'"
        v-if="full"
      />
      <div
        class="pt-md-3 pt-2 verification"
        id="employeeRegister"
        v-if="showCustomer"
      >
        <div class="customer-profile card position-relative">
          <div class="design"></div>
          <div
            class="
              col-md-4 col-sm-4 col-12
              px-0
              pb-md-4 pb-sm-3 pb-0
              pt-md-5 pt-4
              float-left
            "
          >
            <div class="pt-md-3 pt-sm-2 pt-1">
              <div class="justify-content-center d-flex position-relative z-1">
                <span class="img-border">
                  <img
                    :src="passport"
                    alt="customer profile pic"
                    class="profile-picture rounded-circle"
                    v-if="customer.document.passport_url"
                  />
                  <i class="no-image fas fa-user-alt" v-else></i>
                </span>
              </div>
              <div
                class="
                  justify-content-center
                  d-flex
                  position-relative
                  z-1
                  pt-md-4 pt-sm-4 pt-2
                "
              >
                <span class="w-50">
                  <div class="text-right px-4 py-3 text-light text-muted m-0">
                    Status<i class="ml-3 fas fa-briefcase"></i>
                  </div>
                  <div class="data text-right px-4 py-3 m-0">
                    {{ customer.employment_status | capitalize }}
                  </div>
                </span>
                <span class="separator"></span>
                <span class="w-50">
                  <div class="px-4 py-3 text-muted text-light m-0">
                    <i class="mr-3 fas fa-transgender"></i>Gender
                  </div>
                  <div class="data px-4 py-3 m-0">
                    {{ customer.gender | capitalize }}
                  </div>
                </span>
              </div>
              <div class="text-center my-2" v-if="forDVA">
                <button class="btn bg-default px-3" @click="verifyModal">
                  Verify Customer
                </button>
              </div>
              <div class="text-center my-2" v-if="forCreditChecker">
                <button class="btn bg-default px-4" @click="creditReportModal">
                  Credit Report
                </button>
              </div>
            </div>
          </div>
          <div
            class="
              col-md-8 col-sm-8 col-12
              px-0
              pb-4
              pt-md-5 pt-sm-5 pt-0
              float-left
            "
          >
            <div class="pt-md-4 pt-0 clearfix">
              <div class="float-left p-0 m-0 col-md-4 col-sm-6 small-center">
                <h4 class="mt-0 pt-md-5 pt-sm-4 pt-0 mb-md-5 mb-sm-4 mb-3">
                  <i class="mr-3 far fa-user-circle"></i>
                  <strong>{{
                    $getCustomerFullName(customer) | capitalize
                  }}</strong>
                </h4>
              </div>
              <div
                class="
                  float-left
                  p-0
                  m-0
                  col-md-4 col-sm-6
                  d-flex
                  justify-content-center
                "
              >
                <h4
                  class="
                    mt-0
                    pt-md-5 pt-sm-4 pt-0
                    mb-md-5 mb-sm-4 mb-4
                    text-muted
                  "
                >
                  <strong>Customer ID: {{ customer.id }}</strong>
                </h4>
                <span
                  class="mt-0 pt-md-4 pt-sm-3 pt-0 mb-md-5 mb-sm-4 mb-4 px-3"
                  v-if="
                    auth('DVAAccess') ||
                      auth('ALTARAPAYAccess') ||
                      auth('FSLAccess')
                  "
                >
                  <CustomerMobileButton
                    :customer="customer"
                    :key="customer.id"
                  />
                </span>
              </div>
              <div
                class="
                  float-left
                  p-0
                  m-0
                  col-md-4 col-12
                  d-flex
                  justify-content-center
                "
              >
                <ApprovalStatusButton
                  size="big"
                  :key="customer.id"
                  :customer="customer"
                />
              </div>
              <div
                class="float-left px-5 col-4 col-md-4 col-sm-6 small-center pointer position-relative mt-2"
              >
                <h6
                  class="mt-2 py-3 mx-auto  bg-default rounded-2 w-75 text-center"
                  v-if="customer.guarantor_paystack.length === 0"
                  @click="showModal"
                >
                  Add Guarantors
                </h6>
                <h6
                  v-else
                  class="mt-2 py-3 mx-auto bg-default rounded-2 w-75 text-center"
                  @click="showModal"
                >
                  View Guarantor(s)<span
                    class="badge border-0 h6 mt-0 position-absolute px-2
                    "
                    >{{ customer.guarantor_paystack.length }}</span
                  >
                </h6>
              </div>
            </div>
            <div class="pt-4">
              <table class="table">
                <tbody>
                  <tr>
                    <th class="text-muted " style="width: 120px;">
                      <i class="pr-3 fas fa-mobile-alt"></i>Phone Number
                    </th>
                    <td>{{ customer.telephone }}</td>
                  </tr>
                  <tr v-if="auth('DVAAccess')">
                    <th class="text-muted">
                      <i class="mr-3 fas fa-home"></i>Address
                    </th>
                    <td>
                      <span class="pad">Home :</span>
                      <span v-if="$getCustomerAddress(customer).length > 12"
                        >{{ $getCustomerAddress(customer) | capitalize }}
                      </span>
                      <span v-if="$getCustomerAddress(customer).length < 12"
                        >Not Available</span
                      >
                      <span class="pad">|</span>
                      <span class="pad">Work :</span>
                      <span
                        v-if="$getCustomerOfficeAddress(customer).length > 12"
                        >{{ $getCustomerOfficeAddress(customer) | capitalize }}
                      </span>
                      <span
                        v-if="$getCustomerOfficeAddress(customer).length < 12"
                        >Not Available</span
                      >
                    </td>
                  </tr>
                  <!-- <tr v-if="auth('DVAAccess')">
                                    <th class="text-muted"><i class="mr-3 fas fa-map-marker-alt"></i>Work Address</th>
                                    <td v-if="$getCustomerOfficeAddress(customer).length > 12">{{$getCustomerOfficeAddress(customer) | capitalize }} </td>
                                    <td v-if="$getCustomerOfficeAddress(customer).length < 12">Not Available</td>
                                </tr> -->
                  <tr>
                    <th class="text-muted">
                      <i class="mr-3 fas fa-briefcase"></i
                      >{{
                        customer.employment_status === "formal" ||
                        customer.employment_status === "salaried"
                          ? "Occupation"
                          : "Kind of business"
                      }}
                    </th>
                    <td>
                      {{
                        !customer.occupation
                          ? "Not Available"
                          : customer.occupation
                      }}
                    </td>
                  </tr>
                  <tr>
                    <th class="text-muted">
                      <i class="mr-3 fas fa-envelope"></i>Email
                    </th>
                    <td>
                      {{ !customer.email ? "Not Available" : customer.email }}
                    </td>
                  </tr>
                  <tr>
                    <th class="text-muted">
                      <i class="mr-3 fas fa-gift"></i>Registered On
                    </th>
                    <td>
                      {{ customer.date_of_registration }}
                    </td>
                  </tr>
                  <tr>
                    <th class="text-muted">
                      <i class="mr-3 far fa-user-circle"></i>Registered By
                    </th>
                    <td>
                      {{
                        customer.user
                          ? customer.user.full_name
                          : "user not in record" | capitalize
                      }}
                    </td>
                  </tr>
                  <tr>
                    <th class="text-muted">
                      <i class="mr-3 far fa-building"></i>Branch
                    </th>
                    <td>{{ branch | capitalize }}</td>
                  </tr>
                  <tr v-if="forCreditChecker">
                    <th class="text-muted">
                      <i class="mr-3 fas fa-university"></i>BVN
                    </th>
                    <td>
                      {{ customer.bvn ||  "Not Available" }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div v-if="full">Full profile goes here</div>
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
import Auth from '../utilities/auth'
import { mapActions, mapGetters } from 'vuex'
import { EventBus } from '../utilities/event-bus'
import AppNavigation from '../components/AppNavigation'
import ApprovalStatusButton from '../components/ApprovalStatusButton'
import CustomSMSButton from '../components/CustomSMSButton/CustomSMSButton'
import CustomerMobileButton from '../components/customerMobileSms/customerMobileButton.vue'
import paystack from 'vue-paystack'
import CustomerGuarantorsModal from '../components/modals/CustomerGuarantorsModal.vue'
import VerificationCheckList from '../components/modals/VerificationCheckList.vue'
import CreditReportModal from '../components/modals/CreditReportModal.vue'
import FormalQuestions from './modals/FormalQuestions.vue'
import Lookup from '../views/FSL/lookup/lookup.vue'

import { post } from '../utilities/api'
import { relative } from 'path'

export default {
  props: {
    viewCustomer: {
      required: false,
      default: ()=> {}
    },
    verificationList: {
      required: false,
      default: ()=> []
    
  }
  },

  components: {
    CreditReportModal,
    VerificationCheckList,
    ApprovalStatusButton,
    AppNavigation,
    CustomSMSButton,
    CustomerMobileButton,
    paystack,
    CustomerGuarantorsModal,
    FormalQuestions
  },

  data() {
    return {
      customer: "",
      showCustomer: false,
    }
  },

  computed: {
    ...mapGetters(["auth"]),
    full() {
      return this.$route.meta.mode === "full"
    },

    passport() {
      return `${process.env.VUE_APP_S3_URL}/${this.customer.document.passport_url}`
    },

    branch() {
      return `${this.customer.branch?.description} ${this.customer.branch?.name}`
    },

    approved() {
      return this.$getCustomerApprovalStatus(this.customer.verification)
    },
    forDVA() {
      return this.auth("DVAAccess")
    },
    forCreditChecker() {
      return this.auth("CreditChecker")
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

    showModal() {
      this.show("customer-guarantor")
    },

    show(modal) {
      this.$modal.show(modal)
    },

    hide(modal) {
      this.$modal.hide(modal)
    },
    verifyModal() {
      this.$modal.show(
        FormalQuestions,
        // {Verification:this.verificationList},
        {customer: this.customer,
          verificationList: this.verificationList
        
        },
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
    creditReportModal() {
      this.$modal.show(
        CreditReportModal,
        { customer: this.customer },
        {
          name: "creditReportForm",
          classes: ["w-50", "overflow-hidden"],
          adaptive: true,
          resizable: true,
          height: 'auto',
          width: '50%',
          clickToClose: true,
        },
        {
          closed: event => {},
        }
      )
    },
    creditReportModal(){
      this.$modal.show(
        CreditReportModal,
        { customer: this.customer },
        {
          name: 'creditReportForm',
          classes: ['w-50', 'overflow-hidden'],
          adaptive: true,
          resizable: true,
          height: 'auto',
          width: '50%',
          clickToClose: true,
        },
        {
          closed: event => {
          }
        }
      )
    },

    ...mapActions("ModalAccess", [
      "addCustomerOptionsModalsToDom",
      "removeCustomerOptionsModalsFromDom",
    ]),
  },

  destroyed() {
    this.removeCustomerOptionsModalsFromDom()
  },
}
</script>
<style>
.pad {
  margin: 0 2px;
}

.add-g h4:active {
  background-color: beige;
  border: 1px solid cadetblue;
}
</style>
