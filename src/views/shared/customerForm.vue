<template>
  <div class="clearfix pt-md-3 pt-2" id="customerRegister">
    <!-- <verification :action="'update'" @update="updateCustomer" v-if="mode === 'update'" /> -->
    <div
      class="card"
      :style="
        mode === 'update'
          ? 'margin-left: 5rem;margin-right: 5rem;width: auto;'
          : ''
      "
    >
      <ul class="nav nav-tabs justify-content-center bg-default">
        <h6>{{ mode | capitalize }} Customer</h6>
      </ul>
      <div style="display: flex">
        <custom-header
          :title="'Customer Registration'"
          @click.native="selectType('normalCustomer')"
          :style="
            !formMode.normalCustomer
              ? 'opacity: 0.2; cursor:pointer;'
              : 'cursor:pointer;'
          "
        />
        <custom-header
          v-if="mode !== 'update'"
          :title="'Cash N Carry Customer Registration'"
          @click.native="selectType('vendorCustomer')"
          :style="
            !formMode.vendorCustomer
              ? 'opacity: 0.2; cursor:pointer;'
              : 'cursor:pointer; '
          "
          style="margin-left: -10px"
        />
      </div>
      <div v-if="formMode.normalCustomer">
        <div class="card-body pl-4 pr-4 clearfix">
          <form-wizard
            @onComplete="register"
            class="form-group m-top"
            v-if="mode === 'register' && !registered"
          >
            <tab-content title="Account Info">
              <AccountInfoVue
                :formData="formData"
                :memberHasError="memberHasError"
                :error="error"
                :civilStatus="civilStatus"
                :gender="gender"
                :channels="channels"
                :highestLevelOfEdu="highestLevelOfEdu"
                :$v="$v"
              />
            </tab-content>

            <tab-content title="Contact Address">
              <ContactAddressVue
                :formData="formData"
                :memberHasError="memberHasError"
                :error="error"
                :states="states"
                :$v="$v"
              />
            </tab-content>

            <tab-content title="Household Info">
              <HouseholdInfoVue
                :formData="formData"
                :memberHasError="memberHasError"
                :error="error"
                :typesOfHome="typesOfHome"
                :noOfRooms="noOfRooms"
                :$v="$v"
              />
            </tab-content>
            <tab-content title="Work Details">
              <WorkDetailsVue
                :formData="formData"
                :memberHasError="memberHasError"
                :error="error"
                :occupations="occupations"
                :occName="occName"
                :isOther="isOther"
                :checkOccupation="checkOccupation"
                :isClick="isClick"
                :setOccupation="setOccupation"
                :durations="durations"
                :newCustomer="newCustomer"
                :states="states"
                :weekdays="weekdays"
                :$v="$v"
                :receiveIncomeMeans="receiveIncomeMeans"
                :paymentPeriod="paymentPeriod"
              />
            </tab-content>
          </form-wizard>

          <div v-if="registered" class="success">
            <h2 class="headeer">SUCCESS !</h2>
            <check />
            <p class="text">
              You have successfully signed up Customer ID is
              <span class="id">{{ identity }}</span>
            </p>
          </div>
        </div>
      </div>
      <div v-else>
        <div class="card-body pl-4 pr-4 clearfix">
          <div class="form-group">
            <div class="form-group col-md-4 px-md-3 px-1 float-left">
              <label>First Name</label>
              <input
                class="form-control"
                data-vv-as="first name"
                name="first_name"
                placeholder="Enter First name here.."
                type="text"
                v-model="vendorCustomer.first_name"
                v-validate="'required|max:25'"
              />
              <span
                v-if="errors.first('first_name')"
                class="font-weight-light text-danger"
              >
                {{ errors.first("first_name") }}
              </span>
            </div>
            <div class="form-group col-md-4 px-md-3 px-1 float-left">
              <label>Middle Name</label>
              <input
                class="form-control"
                placeholder="Enter Middle name here.."
                type="text"
                v-model="vendorCustomer.middle_name"
              />
            </div>

            <div class="form-group col-md-4 px-md-3 px-1 float-left">
              <label>Last Name</label>
              <input
                class="form-control"
                data-vv-as="last name"
                name="last_name"
                placeholder="Enter Last name here.."
                type="text"
                v-model="vendorCustomer.last_name"
                v-validate="'required|max:25'"
              />

              <span
                v-if="errors.first('last_name')"
                class="font-weight-light text-danger"
              >
                {{ errors.first("last_name") }}
              </span>
            </div>
            <div class="spaceAfter"></div>

            <div class="form-group col-md-4 px-md-3 px-1 float-left">
              <label>Phone Number</label>
              <input
                class="form-control"
                name="telephone"
                placeholder="Enter Phone number here.."
                type="number"
                v-model="vendorCustomer.telephone"
                v-validate="'required|max:11|min:11'"
              />
              <span
                v-if="errors.first('telephone')"
                class="font-weight-light text-danger"
              >
                {{ errors.first("telephone") }}
              </span>
            </div>
            <div class="form-group col-md-4 px-md-3 px-1 float-left">
              <label>Address</label>
              <input
                class="form-control"
                data-vv-as="address"
                name="address"
                placeholder="Enter Address here.."
                type="text"
                v-model="vendorCustomer.add_street"
                v-validate="'required|max:55'"
              />

              <span
                v-if="errors.first('address')"
                class="font-weight-light text-danger"
              >
                {{ errors.first("address") }}
              </span>
            </div>
          </div>
        </div>
        <div class="text-center my-3">
          <button class="btn bg-default" type="button" @click="registerCNC">
            Submit
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import AccountInfoVue from "../../components/FormSteps/AccountInfo.vue";
  import ContactAddressVue from "../../components/FormSteps/ContactAddress.vue";
  import WorkDetailsVue from "../../components/FormSteps/WorkDetails.vue";
  import HouseholdInfoVue from "../../components/FormSteps/HouseholdInfo.vue";
  import { FormWizard, TabContent, ValidationHelper } from "mulltistep-checker";
  import CustomHeader from "../../components/customHeader";
  import check from "../../assets/css/svgs/check.vue";
  import "../../assets/css/vue-step-wizard.css";
  import { log } from "../../utilities/log";
  import Flash from "../../utilities/flash";
  import { get, post } from "../../utilities/api";
  import CustomerData from "../../mixins/CustomerData";
  import { selectType } from "../../utilities/log.js";

  export default {
    components: {
      FormWizard,
      TabContent,
      check,
      AccountInfoVue,
      ContactAddressVue,
      HouseholdInfoVue,
      WorkDetailsVue,
      CustomHeader,
    },
    mixins: [ValidationHelper, CustomerData],

    data() {
      return {
        formMode: {
          normalCustomer: true,
          vendorCustomer: false,
        },
        vendorCustomer: {
          customer_type: "cash_carry",
        },
        staff: {},
      };
    },

    methods: {
      selectType(type) {
        selectType(type, this.formMode);
      },

      async registerCNC() {
        this.$validator.validateAll().then(async (result) => {
          if (result) {
            if (this.$network()) {
              this.$LIPS(true);
              try {
                this.vendorCustomer.branch_id = this.staff.branch_id;
                this.vendorCustomer.employee_id = this.staff.id;
                this.vendorCustomer.employee_name = this.staff.full_name;
                this.vendorCustomer.date_of_registration =
                  this.formData?.newCustomer?.date_of_registration;
                this.vendorCustomer.user_id =
                  this.formData?.newCustomer?.user_id;

                let res = await post("/api/customer", this.vendorCustomer);
                if (res.status === 200) {
                  this.$swal({
                    icon: "success",
                    title: "Customer Registered Successfully",
                    text: `Customer ID: ${res.data.customer.id}`,
                    html: `<div class="h3">Customer ID: <b class="text-success">${res.data.customer.id}</b></div>`,
                  });
                  this.vendorCustomer = {};
                } else {
                  this.$swal({
                    icon: "error",
                    title: "Unable to Complete",
                    message: res.data.message,
                  });
                }
                this.$LIPS(false);
              } catch (err) {
                this.$swal({
                  icon: "error",
                  title: "Unable to Complete",
                  text: err.response?.data?.data?.errors?.telephone,
                });
                this.$LIPS(false);
              }
            }
          }
        });
      },

      register() {
        $('input[name="occ"]').attr("disabled", false);
        this.$validator.validateAll().then(async (result) => {
          if (result) {
            if (this.formData.newCustomer.employment_status === "unemployed") {
              Flash.setError(
                "you can only register customer from formal and informal sectors at the moment!"
              );
              return this.$scrollToTop();
            }
            if (this.$network()) {
              this.$LIPS(true);
              this.error = {};
              if (this.formData.newCustomer.bvn === "") {
                delete this.formData.newCustomer.bvn;
              }
              if (this.mode === "update") {
                let acc = this.$editAccess(
                  this.user,
                  this.formData.newCustomer
                );
                if (!acc) return this.$networkErr("edit");
              }
              await post(
                `/api/customer${
                  this.mode === "update"
                    ? "/" + this.formData.newCustomer.id
                    : ""
                }`,
                this.formData.newCustomer
              )
                .then(({ data }) => {
                  let { id } = data.customer;
                  this.identity = id;
                  this.registered = true;
                  this.formData.newCustomer = this.data;
                  // Flash.setSuccess(
                  //   `Customer ${this.mode}ed successful! Customer ID is: ${id}`,
                  //   30000
                  // );
                  log(`${this.mode}ed Customer`, `Customer ID :${id}`);
                  if (this.mode === "register") {
                    this.prepareForm(data.prepareForm);
                  }
                })
                .catch((e) => {
                  e = e.response;
                  if (e.status === 422)
                    this.error = e.data.errors ? e.data.errors : e.data;

                  Flash.setError(
                    e.status === 422 &&
                      e.data.data.errors.telephone &&
                      e.data.data.errors.email
                      ? this.$displayErrorText(
                          "This customer's phone number and email is already taken"
                        )
                      : e.status === 422 && e.data.data.errors.telephone
                      ? this.$displayErrorText(
                          "This customer's phone number is already taken"
                        )
                      : e.status === 422 && e.data.data.errors.email
                      ? this.$displayErrorText(
                          "This customer's email is already taken"
                        )
                      : e.message,
                    10000
                  );
                })
                .finally(() => {
                  this.$isProcessing = false;
                });
              this.$scrollToTop();
              this.$LIPS(false);
            } else this.$networkErr();
          } else this.$networkErr("form");
          $('input[name="occ"]').attr(
            "disabled",
            !(this.isOther && this.isClick)
          );
        });
      },

      checkOccupation(id) {
        $(".occupation-title, .occupation-option").removeClass(
          "active shadow-sm"
        );
        this.occupations.forEach((element) => {
          if (element.id === id) {
            $(`.occupation-title[data-id="${id}"]`).addClass(
              "active shadow-sm"
            );
            this.occName = element.names;
            // this.formData.newCustomer.employment_status = element.category;
            this.isClick = true;
            this.isOther = element.id === 12 ? true : false;
            if (element.id === 12) {
              this.isOther = true;
            } else {
              this.isOther = false;
            }
          }
        });
      },

      setOccupation(name) {
        $(".occupation-option").removeClass("active shadow-sm");
        this.occName.forEach((element) => {
          if (element == name) {
            this.formData.newCustomer.occupation = element;
            $(`.occupation-option[data-name="${name}"]`).addClass(
              "active shadow-sm"
            );
          }
        });
      },
      prepareForm(data) {
        this.staff = data.user;
        this.states = data.states;
        this.branches = data.branches;
        let newData = {};
        this.data = data.form;
        if (data.form) {
          for (const key in data.form) {
            if (data.form[key]) {
              newData[key] = data.form[key];
            }
          }
        }
        this.formData.newCustomer = {
          ...this.formData.newCustomer,
          ...newData,
        };
        this.user = data.user;
      },
      updateCustomer(customer) {
        if (this.mode === "update")
          [this.fillWorkGuarantor, this.fillPersonalGuarantor] = [true, true];
        this.formData.newCustomer = customer;
      },
      memberHasError(fieldName) {
        if (!fieldName) return false;

        let splitFields = fieldName.split(".");
        let lastValidator = this.$v.formData;

        if (!lastValidator) return false;

        if (splitFields.length == 1) {
          return fieldName in lastValidator && !lastValidator[fieldName].$error;
        }

        for (let index = 0; index < splitFields.length; index++) {
          const element = splitFields[index];
          if (!lastValidator) {
            return false;
          }

          if (!element in lastValidator) {
            return false;
          }

          lastValidator = lastValidator[element];
        }
        if (this.formData.newCustomer.civil_status == "") {
          return lastValidator?.$error;
        }
        return lastValidator?.$error;
      },
    },
    mounted() {
      if (localStorage.data) {
        this.formData.newCustomer = JSON.parse(localStorage.data);
      }
    },
    watch: {
      "formData.newCustomer": {
        handler(newData) {
          localStorage.data = JSON.stringify(newData);
        },
        deep: true,
      },
    },
    created() {
      get("/api/customer/create").then(({ data }) => this.prepareForm(data));
      /*on create of the component fetch the data required to prepare the form
       * states, branches and the currently logged in dsa details*/
    },
  };
</script>

<style lang="scss">
  .badge {
    cursor: pointer;
    font-size: 1.2rem;
    font-weight: 500;

    &:nth-child(n + 3) {
      margin-left: 20px;
    }

    &-primary {
      border-color: #084a73;
      color: #084a73;

      &.active {
        background-color: #084a73;
        color: white;
      }
    }

    &-default {
      &.active {
        border-color: #084a73;
        color: #084a73;
        font-weight: 700;
      }
    }
  }

  hr.my-4 + span.occupation-option {
    margin-left: 0;
  }
  .m-top {
    margin-top: 30px;
  }
  .check {
    width: 2rem;
    height: 2rem;
    position: absolute;
    top: 0px;
  }
  .relative {
    position: relative;
  }
  .success {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-items: start;
    align-items: center;
  }
  .headeer {
    color: #074a74;
    font-weight: 700;
    font-size: 55px;
    padding: 30px 0 0 0;
  }
  .id {
    color: #074a74;
    font-weight: 600;
    font-size: 25px;
  }
  .text {
    color: #0f0f0f;
    font-size: 20px;
  }
  .bottom {
    position: absolute;
    bottom: 0px;
    right: 50%;
  }
  .invalid-feedback {
    font-size: 10px;
  }
</style>
