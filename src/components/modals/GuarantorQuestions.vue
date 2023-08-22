<template>
    <transition>
  
      <div>
        <div class="modal-header">
          <h3 class=" my-1" id="exampleModalLongTitle">
            Verification Checklists
          </h3>
          <div slot="top-right">
            <span
              type="button"
              class="close text-danger h4 my-0 py-0 pointer"
              data-dismiss="modal"
              aria-label="Close"
              @click="$modal.hide('verificationForm')"
            >
              <span aria-hidden="true" class="h5">&times;</span>
            </span>
          </div>
        </div>
        <div class="modal-body mx-4">
          <div class="d-flex align-items-center" v-if="verificationList.length > 0">
            <div class="circle-icon mt-4">
              <i class="fa fa-check" aria-hidden="true"></i>
            </div>
            <h4 class="ml-2  ">Verified</h4>
          </div>
          <h4>This section is for Guarantors, <strong @click="verifyInformalModal">Click to view the InFormal section</strong></h4>
          <div class="spaceAfter"></div>
          <form>
            <h5>Guarantor</h5>
            <div class="form-group my-3">
              <label for="exampleFormControlSelect2"
                >How long have you known the customer</label
              >
              <br />
    
              <div class="form-check form-check-radio form-check-inline">
                <label class="form-check-label">
                  <input
                    v-model="verificationData.guarantorHowLong"
                    type="radio"
                    class="form-check-input "
                    value="More than 1 year"
                    name="checklist2"
                    v-validate="'required'"
                  />
                  <span class="px-2">More than 1 year</span>
                  <span class="form-check-sign"> </span>
                </label>
              </div>
              <div class="form-check form-check-radio form-check-inline">
                <label class="form-check-label">
                  <input
                    v-model="verificationData.guarantorHowLong"
                    type="radio"
                    class="form-check-input "
                    value="Less than 1 year"
                    name="checklist2"
                    v-validate="'required'"
                  />
                  <span class="px-2">Less than 1 year</span>
                  <span class="form-check-sign"> </span>
                </label>
              </div>
            </div>
    
            <div class="form-group my-3">
              <label for="exampleFormControlSelect2"
                >What is your relationship with this customer?</label
              >
              <br />
    
              <div class="form-check form-check-radio form-check-inline">
                <label class="form-check-label">
                  <input
                    v-model="verificationData.guarantorCustomerRelationship"
                    type="radio"
                    class="form-check-input "
                    value="Family member"
                    name="checklist3"
                    v-validate="'required'"
                  />
                  <span class="px-2">Family member</span>
                  <span class="form-check-sign"> </span>
                </label>
              </div>
              <div class="form-check form-check-radio form-check-inline">
                <label class="form-check-label">
                  <input
                    v-model="verificationData.guarantorCustomerRelationship"
                    type="radio"
                    class="form-check-input "
                    value="Non-family member/work related/mentor"
                    name="checklist3"
                    v-validate="'required'"
                  />
                  <span class="px-2">Non-family member/work related/mentor</span>
                  <span class="form-check-sign"> </span>
                </label>
              </div>
            </div>
            <div class="form-group my-3">
              <label for="checklist5" class=""
                >What is the customer occupation?</label
              ><br />
              <div class="form-check form-check-radio form-check-inline">
                <label class="form-check-label">
                  <input
                    v-model="verificationData.guarantorCustomerOccupation"
                    type="radio"
                    class="form-check-input "
                    value="Same with customer"
                    name="checklist5"
                    v-validate="'required'"
                  />
                  <span class="px-2">Same with customer</span>
                  <span class="form-check-sign"> </span>
                </label>
              </div>
              <div class="form-check form-check-radio form-check-inline">
                <label class="form-check-label">
                  <input
                    v-model="verificationData.guarantorCustomerOccupation"
                    type="radio"
                    class="form-check-input "
                    value="Different from customer"
                    name="checklist5"
                    v-validate="'required'"
                  />
                  <span class="px-2">Different from customer</span>
                  <span class="form-check-sign"> </span>
                </label>
              </div>
            </div>
            <div class="form-group my-3">
              <label for="checklist51" class=""
                >How long has the customer done this business or job?</label
              ><br />
              <div class="form-check form-check-radio form-check-inline">
                <label class="form-check-label">
                  <input
                    v-model="verificationData.guarantorCustomerBusinessYear"
                    type="radio"
                    class="form-check-input "
                    value="Same with customer"
                    name="checklist51"
                    v-validate="'required'"
                  />
                  <span class="px-2">Same with customer</span>
                  <span class="form-check-sign"> </span>
                </label>
              </div>
              <div class="form-check form-check-radio form-check-inline">
                <label class="form-check-label">
                  <input
                    v-model="verificationData.guarantorCustomerBusinessYear"
                    type="radio"
                    class="form-check-input "
                    value="Different from customer"
                    name="checklist51"
                    v-validate="'required'"
                  />
                  <span class="px-2">Different from customer</span>
                  <span class="form-check-sign"> </span>
                </label>
              </div>
            </div>
            <div class="form-group my-3">
              <label for="checklist52" class=""
                >Where does the customer work or where is the customer's business?</label
              ><br />
              <div class="form-check form-check-radio form-check-inline">
                <label class="form-check-label">
                  <input
                    v-model="verificationData.guarantorCustomerAddress"
                    type="radio"
                    class="form-check-input "
                    value="Same with customer"
                    name="checklist52"
                    v-validate="'required'"
                  />
                  <span class="px-2">Same with customer</span>
                  <span class="form-check-sign"> </span>
                </label>
              </div>
              <div class="form-check form-check-radio form-check-inline">
                <label class="form-check-label">
                  <input
                    v-model="verificationData.guarantorCustomerAddress"
                    type="radio"
                    class="form-check-input "
                    value="Different from customer"
                    name="checklist52"
                    v-validate="'required'"
                  />
                  <span class="px-2">Different from customer</span>
                  <span class="form-check-sign"> </span>
                </label>
              </div>
            </div>
  
            <div class="form-group my-3">
              <label for="checklist53" class=""
                >Does the customer own their own house or shop?  </label
              ><br />
              <div class="form-check form-check-radio form-check-inline">
                <label class="form-check-label">
                  <input
                    v-model="verificationData.guarantorCustomerOwnHouse"
                    type="radio"
                    class="form-check-input "
                    value="Yes"
                    name="checklist53"
                    v-validate="'required'"
                  />
                  <span class="px-2">Yes</span>
                  <span class="form-check-sign"> </span>
                </label>
              </div>
              <div class="form-check form-check-radio form-check-inline">
                <label class="form-check-label">
                  <input
                    v-model="verificationData.guarantorCustomerOwnHouse"
                    type="radio"
                    class="form-check-input "
                    value="No"
                    name="checklist53"
                    v-validate="'required'"
                  />
                  <span class="px-2">No</span>
                  <span class="form-check-sign"> </span>
                </label>
              </div>
            </div>
            <div class="form-group my-3">
              <label for="checklist6" class=""
                >How many times has the customer borrowed money in the last 6 months?</label
              ><br />
              <div class="form-check form-check-radio form-check-inline">
                <label class="form-check-label">
                  <input
                    v-model="verificationData.guarantorCustomerBorrowed"
                    type="radio"
                    class="form-check-input "
                    value="More than 2 times"
                    name="checklist6"
                    v-validate="'required'"
                  />
                  <span class="px-2">More than 2 times</span>
                  <span class="form-check-sign"> </span>
                </label>
              </div>
              <div class="form-check form-check-radio form-check-inline">
                <label class="form-check-label">
                  <input
                    v-model="verificationData.guarantorCustomerBorrowed"
                    type="radio"
                    class="form-check-input "
                    value="Less than 2 times"
                    name="checklist6"
                    v-validate="'required'"
                  />
                  <span class="px-2">Less than 2 times</span>
                  <span class="form-check-sign"> </span>
                </label>
              </div>
            </div>
            <div class="form-group my-3">
              <label for="checklist7" class=""
                >Has the customer ever been in trouble with the police?</label
              ><br />
              <div class="form-check form-check-radio form-check-inline">
                <label class="form-check-label">
                  <input
                    v-model="verificationData.guarantorCustomerTrouble"
                    type="radio"
                    class="form-check-input "
                    value="Yes"
                    name="checklist7"
                    v-validate="'required'"
                  />
                  <span class="px-2">Yes</span>
                  <span class="form-check-sign"> </span>
                </label>
              </div>
              <div class="form-check form-check-radio form-check-inline">
                <label class="form-check-label">
                  <input
                    v-model="verificationData.guarantorCustomerTrouble"
                    type="radio"
                    class="form-check-input "
                    value="No"
                    name="checklist7"
                    v-validate="'required'"
                  />
                  <span class="px-2">No</span>
                  <span class="form-check-sign"> </span>
                </label>
              </div>
            </div>
            <div class="form-group my-3">
              <label for="checklist19" class=""
                >What is the name and address of the customer's mosque/church?</label
              ><br />
              
            </div>
            <div class="form-group my-3">
              <textarea
                cols="2"
                class="form-control "
                v-model="verificationData.guarantorCustomerChurchAddress"
              ></textarea>
            </div>
            <div class="form-group my-3">
              <label for="checklist8" class=""
                >Does the customer plan to relocate in the next 6 months?</label
              ><br />
              <div class="form-check form-check-radio form-check-inline">
                <label class="form-check-label">
                  <input
                    v-model="verificationData.guarantorCustomerRelocate"
                    type="radio"
                    class="form-check-input "
                    value="yes"
                    name="checklist8"
                    v-validate="'required'"
                  />
                  <span class="px-2">Yes</span>
                  <span class="form-check-sign"> </span>
                </label>
              </div>
              <div class="form-check form-check-radio form-check-inline">
                <label class="form-check-label">
                  <input
                    v-model="verificationData.guarantorCustomerRelocate"
                    type="radio"
                    class="form-check-input "
                    value="no"
                    name="checklist8"
                    v-validate="'required'"
                  />
                  <span class="px-2">No</span>
                  <span class="form-check-sign"> </span>
                </label>
              </div>
            </div>
            <div class="form-group my-3">
              <label for="checklist9" class=""
                >Does the customer spend a lot of time outside their current location [Ibadan/Ilorin/OgunState]?</label
              ><br />
              <div class="form-check form-check-radio form-check-inline">
                <label class="form-check-label">
                  <input
                    v-model="verificationData.guarantorCustomerTimeOutside"
                    type="radio"
                    class="form-check-input "
                    value="yes"
                    name="checklist9"
                    v-validate="'required'"
                  />
                  <span class="px-2">Yes</span>
                  <span class="form-check-sign"> </span>
                </label>
              </div>
              <div class="form-check form-check-radio form-check-inline">
                <label class="form-check-label">
                  <input
                    v-model="verificationData.guarantorCustomerTimeOutside"
                    type="radio"
                    class="form-check-input "
                    value="no"
                    name="checklist9"
                    v-validate="'required'"
                  />
                  <span class="px-2">No</span>
                  <span class="form-check-sign"> </span>
                </label>
              </div>
            </div>
            <div class="form-group my-3">
              <label for="checklist20" class=""
                >What is the customer called in the neighborhood?</label
              ><br />
              
            </div>
            <div class="form-group my-3">
              <textarea
                cols="2"
                class="form-control "
                v-model="verificationData.guarantorCustomerNameByNeighbor"
              ></textarea>
            </div>
            <div class="form-group my-3">
              <label for="checklist10" class=""
                >Does the customer have a large life event in the next 6 months ? (e.g. birth of a child, burial, children going to university)</label
              ><br />
              <div class="form-check form-check-radio form-check-inline">
                <label class="form-check-label">
                  <input
                    v-model="verificationData.guarantorCustomerLargeLife"
                    type="radio"
                    class="form-check-input "
                    value="yes"
                    name="checklist10"
                    v-validate="'required'"
                  />
                  <span class="px-2">Yes</span>
                  <span class="form-check-sign"> </span>
                </label>
              </div>
              <div class="form-check form-check-radio form-check-inline">
                <label class="form-check-label">
                  <input
                    v-model="verificationData.guarantorCustomerLargeLife"
                    type="radio"
                    class="form-check-input "
                    value="no"
                    name="checklist10"
                    v-validate="'required'"
                  />
                  <span class="px-2">No</span>
                  <span class="form-check-sign"> </span>
                </label>
              </div>
            </div>
            <div class="form-group my-3">
              <label for="checklist11" class=""
              >Can you share the name of anyone else who can vouch for the customer?</label
              ><br />
              <div class="form-check form-check-radio form-check-inline">
                <label class="form-check-label">
                  <input
                    v-model="verificationData.guarantorCustomerVouch"
                    type="radio"
                    class="form-check-input "
                    value="yes"
                    name="checklist11"
                    v-validate="'required'"
                  />
                  <span class="px-2">Yes</span>
                  <span class="form-check-sign"> </span>
                </label>
              </div>
              <div class="form-check form-check-radio form-check-inline">
                <label class="form-check-label">
                  <input
                    v-model="verificationData.guarantorCustomerVouch"
                    type="radio"
                    class="form-check-input "
                    value="no"
                    name="checklist11"
                    v-validate="'required'"
                  />
                  <span class="px-2">No</span>
                  <span class="form-check-sign"> </span>
                </label>
              </div>
              <div class="form-group my-3">
              <label for="checklist21">If Yes</label>
              <textarea
                cols="2"
                class="form-control "
                v-model="verificationData.guarantorCustomerYesVouch"
              ></textarea>
              </div>
            </div>
    
            <div class="form-group my-3">
              <label for="bill"
                >Are you employed or do you own a business?</label
              >
              <br />
    
              <div class="form-check form-check-radio form-check-inline">
                <label class="form-check-label">
                  <input
                    v-model="verificationData.guarantorEmployStatus"
                    type="radio"
                    class="form-check-input "
                    value="yes"
                    name="checklist13"
                    
                  />
                  <span class="px-2">Yes</span>
                  <span class="form-check-sign"> </span>
                </label>
              </div>
              <div class="form-check form-check-radio form-check-inline">
                <label class="form-check-label">
                  <input
                    v-model="verificationData.guarantorEmployStatus"
                    type="radio"
                    class="form-check-input "
                    value="no"
                    name="checklist13"
                    
                  />
                  <span class="px-2">No</span>
                  <span class="form-check-sign"> </span>
                </label>
              </div>
            </div>
            <div class="form-group my-3">
              <label for="guarantorMonthlyPay"
                >Does your monthly pay expend 3x the customer's monthly repayment?</label
              >
              <br />
    
              <div class="form-check form-check-radio form-check-inline">
                <label class="form-check-label">
                  <input
                    v-model="verificationData.guarantorMonthlyPay"
                    type="radio"
                    class="form-check-input "
                    value="yes"
                    name="checklist14"
                    
                  />
                  <span class="px-2">Yes</span>
                  <span class="form-check-sign"> </span>
                </label>
              </div>
              <div class="form-check form-check-radio form-check-inline">
                <label class="form-check-label">
                  <input
                    v-model="verificationData.guarantorMonthlyPay"
                    type="radio"
                    class="form-check-input "
                    value="no"
                    name="checklist14"
                    
                  />
                  <span class="px-2">No</span>
                  <span class="form-check-sign"> </span>
                </label>
              </div>
            </div>
            <div class="form-group my-3">
              <label for="guarantorAddress"
                >Can you provide your own address?</label
              >
              <br />
    
              <div class="form-check form-check-radio form-check-inline">
                <label class="form-check-label">
                  <input
                    v-model="verificationData.guarantorAddress"
                    type="radio"
                    class="form-check-input "
                    value="yes"
                    name="checklist15"
                    
                  />
                  <span class="px-2">Yes</span>
                  <span class="form-check-sign"> </span>
                </label>
              </div>
              <div class="form-check form-check-radio form-check-inline">
                <label class="form-check-label">
                  <input
                    v-model="verificationData.guarantorAddress"
                    type="radio"
                    class="form-check-input "
                    value="no"
                    name="checklist15"
                    
                  />
                  <span class="px-2">No</span>
                  <span class="form-check-sign"> </span>
                </label>
              </div>
            </div>
            <div class="form-group">
              <label for="exampleFormControlTextarea1"
                >Have you stood as a guarantor for this cutomer and/or anyone in particiular before?</label
              >
              <textarea
                v-model="verificationData.guarantorCustomerStoodFor"
                class="form-control"
                id="exampleFormControlTextarea1"
                rows="3"
              ></textarea>
            </div>
            <div class="form-group">
              <label for="exampleFormControlTextarea2"
                >What was the outcome of their payment? Did they ever default and if yes how did you handle it?</label
              >
              <textarea
                v-model="verificationData.guarantorCustomerDefault"
                class="form-control"
                id="exampleFormControlTextarea2"
                rows="3"
              ></textarea>
            </div>
          </form>
        </div>
        <div class="modal-footer mr-4">
          <button
            type="button"
            class="btn px-5 rounded bg-danger mx-3 my-5"
            data-dismiss="modal"
            @click="$modal.hide('verificationForm')"
          >
            Close
          </button>
          <button type="button" class="btn px-4 bg-default my-5" @click="save">
            Save changes
          </button>
        </div>
      </div>
    </transition>
      
    </template>
    
    <script>
    import { get, post } from "../../utilities/api"
    import { EventBus } from '../../utilities/event-bus'
    import Vue from 'vue'
    import InformalQuestions from './InformalQuestions.vue';
    import { mapGetters } from 'vuex'
    
    export default {
      props: {
      customer: {
        required: true,
        default: {},
      },
      verificationList: {
        required: false,
        default: () => [],
      },
  
    },
      data() {
        return {
          verifiedOptions: ["Home", "Business", "Office", "Other"],
          vAgents: null,
          verificationData: {
            locations: []
          },
          locationDurationOptions: ["less than 6 months","6months - 1 year","More than 1 year",],
          customerWorkingYearsOptions: ["less than 6 months","6months - 1 year","More than 1 year",],
          showCustomer: false,
          status: "Guarantor",
          showVerifyIcon: false,
        }
      },
      components: {
      InformalQuestions,
    },
    computed: {
      ...mapGetters(["auth"]),
      full() {
        return this.$route.meta.mode === "full"
      },
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
  
      async save() {
        this.$validator.validateAll().then(async result => {
          if (result) {
            try {
              this.$LIPS(true)
              this.verificationData.customer_id = this.customer.id
              this.verificationData.type = "verification"
              this.verificationData.status = this.status
  
              let res = await post("/api/recommendation", this.verificationData)
              if (res.status === 200) {
                this.$swal({
                  icon: "success",
                  title: `verification saved successfully`,
                })
                this.verificationData = {}
                EventBus.$emit("updateUser", this.customer.id)
  
                this.$modal.hide("verificationForm")
              }
            } catch (err) {
              this.$swal({
                icon: "error",
                title: `Unable to complete`,
              })
            } finally {
              this.$LIPS(false)
            }
          }
        })
      },
      },
    }
    </script>
    
    <style lang="scss" scoped>
    .modal-dialog {
      overflow-y: initial !important;
    }
    .modal-body {
      height: 75vh;
      overflow-y: auto;
    }
  
    h5 {
      background-color: rgba(8, 74, 115, 0.07);
      padding: 0.6rem 1.5rem;
      border-radius: 3px;
      font-size: 1.3rem !important;
      font-weight: 600;
      box-shadow: 0 0 0.5rem 0 rgba(8, 74, 115, 0.08) inset;
      float: left;
      width: 100%;
      color: rgba(8, 74, 115, 0.9);
    }
  
    .spaceAfter {
      padding: 1rem 0;
      float: left;
      width: 100%;
    }
  
    strong {
      color: #FF3636;
      cursor: pointer;
      
    }
    h4 {
      font-size: 1.3rem !important;
      font-weight: 600;
      color: rgba(8, 74, 115, 0.9);
    }
  
    .circle-icon {
      display: inline-flex;
    justify-content: center;
    align-items: center;
    width: 10px; /* Adjust the size of the circle */
    height: 10px; /* Adjust the size of the circle */
    background-color: #4CAF50; /* Replace with your desired background color */
    border-radius: 50%;
    padding: 10px; /* Adjust the padding as needed */
    font-size: 10px; /* Adjust the icon size */
    color: white; /* Optionally, set the icon color */
    }
    </style>
    