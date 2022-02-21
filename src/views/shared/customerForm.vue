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
      <div class="card-body pl-4 pr-4 clearfix">
        <form-wizard
          @onComplete="register"
          class="form-group m-top"
          v-if="(mode === 'register') && !registered"
        >
          <tab-content title="Account Info">
            <AccountInfoVue
              :formData="formData"
              :memberHasError="memberHasError"
              :error="error"
              :civilStatus="civilStatus"
              :gender="gender"
              :highestLevelOfEdu="highestLevelOfEdu"
              :$v= $v
            />
          </tab-content>

          <tab-content title="Contact Address">
            <ContactAddressVue
              :formData="formData"
              :memberHasError="memberHasError"
              :error="error"
              :states="states"
              :$v= $v
            />
          </tab-content>

          <tab-content title="Household Info">
            <HouseholdInfoVue
              :formData="formData"
              :memberHasError="memberHasError"
              :error="error"
              :typesOfHome="typesOfHome"
              :noOfRooms="noOfRooms"
              :$v= $v
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
              :isClick= "isClick"
              :setOccupation="setOccupation"
              :durations="durations"
              :newCustomer="newCustomer"
              :states="states"
              :weekdays="weekdays"
              :$v= $v
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
  </div>
</template>
<script>

import AccountInfoVue from "../../components/FormSteps/AccountInfo.vue";
import ContactAddressVue from "../../components/FormSteps/ContactAddress.vue";
import WorkDetailsVue from "../../components/FormSteps/WorkDetails.vue";
import HouseholdInfoVue from "../../components/FormSteps/HouseholdInfo.vue";
import { FormWizard, TabContent, ValidationHelper } from "mulltistep-checker";
import check from '../../assets/css/svgs/check.vue'
import "../../assets/css/vue-step-wizard.css";
import { Message } from "../../utilities/sms";
import { log } from "../../utilities/log";
import Flash from "../../utilities/flash";
import { get, post } from "../../utilities/api";
import Verification from "../DVA/verification/verification";
import flash from "../../utilities/flash";
import CustomerData from "../../mixins/CustomerData";
export default {
  components: { 
    Verification, 
    FormWizard, 
    TabContent, 
    check, 
    AccountInfoVue, 
    ContactAddressVue, 
    HouseholdInfoVue, 
    WorkDetailsVue 
    },
  mixins: [ValidationHelper, CustomerData],
  
  methods: {

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
            if (this.mode === "update") {
              let acc = this.$editAccess(this.user, this.formData.newCustomer);
              if (!acc) return this.$networkErr("edit");
            }
            await post(
              `/api/customer${this.mode === "update" ? "/" + this.formData.newCustomer.id : ""
              }`,
              this.formData.newCustomer
            )
              .then(({ data }) => {
                let {
                  first_name: FN,
                  last_name: LN,
                  id,
                  branch,
                  telephone: tel,
                } = data.customer;
                this.identity = id
                this.registered = true;
                this.formData.newCustomer = this.data
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
                console.log(e);
                Flash.setError(
                  e.status === 422
                    ? this.$displayErrorText(this.error.data.errors)
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
          $(`.occupation-title[data-id="${id}"]`).addClass("active shadow-sm");
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
      this.states = data.states;
      this.branches = data.branches;
      let newData = {}
      this.data = data.form
      if (data.form) {
        for (const key in data.form) {
          if (data.form[key]) {
            newData[key] = data.form[key]
          }
        }
      }
      this.formData.newCustomer = {
        ...this.formData.newCustomer,
        ...newData
      }
      this.user = data.user;
    },
    updateCustomer(customer) {
      if (this.mode === "update")
        [this.fillWorkGuarantor, this.fillPersonalGuarantor] = [true, true];
      this.formData.newCustomer = customer;
    },
    memberHasError(fieldName) {
      if (!fieldName) return false

      let splitFields = fieldName.split(".")
      let lastValidator = this.$v.formData;

      if (!lastValidator) return false

      if (splitFields.length == 1) {
        return fieldName in lastValidator && !lastValidator[fieldName].$error;
      }


      for (let index = 0; index < splitFields.length; index++) {
        const element = splitFields[index];
        if (!lastValidator) {
          return false
        }

        if (!element in lastValidator) {
          return false
        }

        lastValidator = lastValidator[element]

      }
      if(this.formData.newCustomer.civil_status == ""){
        return lastValidator?.$error;
      }
      return lastValidator?.$error;
    },


  },
  mounted() {
    if (localStorage.data) {
      this.formData.newCustomer = JSON.parse(localStorage.data)
    }
  },
  watch: {
    "formData.newCustomer": {
      handler(newData, oldData) {
        localStorage.data = JSON.stringify(newData)
      },
      deep: true
    }
  },
  created() {
    get("/api/customer/create").then(({ data }) => this.prepareForm(data));
    /*on create of the component fetch the data required to prepare the form
     * states, branches and the currently logged in dsa details*/
  }
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
</style>