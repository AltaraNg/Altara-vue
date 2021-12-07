<template>
  <div class="clearfix pt-md-3 pt-2" id="customerRegister">
    <verification
      :action="'update'"
      @update="updateCustomer"
      v-if="mode === 'update'"
    />
    <div
      class="card"
      v-if="(newCustomer.id && mode === 'update') || mode === 'register'"
      :style="
        mode === 'update'
          ? 'margin-left: 5rem;margin-right: 5rem;width: auto;'
          : ''
      "
    >
      <!--TODO cleanup-->

      <ul class="nav nav-tabs justify-content-center bg-default">
        <h6>{{ mode | capitalize }} Customer</h6>
      </ul>
      <div class="card-body pl-4 pr-4 clearfix">
        <form-wizard @onComplete="register">
          <tab-content title="Account Info" :selected="true">
            <div class="form-group">
              <h5>Prospects Reg ID</h5>
              <label
                >Reg ID <span class="text-success mx-4">OPTIONAL</span>
              </label>
              <input
                class="form-control"
                data-vv-name="customer_contact reg"
                name="cc_reg_id"
                placeholder="Reg ID from sales app"
                type="text"
                v-model="cc_reg_id"
                v-validate="'max:50'"
                @blur="getCustomerDetails"
              />
              <small v-if="errors.first('cc_reg_id')">{{
                errors.first("cc_reg_id")
              }}</small>
            </div>
          </tab-content>
          <tab-content title="Contact Address">
            <div class="form-group">
              <label for="companyName">Your Company Name</label>
              <input
                type="text"
                class="form-control"
                placeholder="Enter your Company / Organization name"
                v-model="companyName"
              />
            </div>
          </tab-content>
          <tab-content title="Household Info">
            <div class="form-group">
              <label for="companyName">Your Company Name</label>
              <input
                type="text"
                class="form-control"
                placeholder="Enter your Company / Organization name"
                v-model="companyName"
              />
            </div>
          </tab-content>
          <tab-content title="Work Details">
            <div class="form-group">
              <label for="companyName">Your Company Name</label>
              <input
                type="text"
                class="form-control"
                placeholder="Enter your Company / Organization name"
                v-model="companyName"
              />
            </div>
          </tab-content>
        </form-wizard>
      </div>
    </div>
  </div>
</template>
<script>
import { FormWizard, TabContent } from "vue-step-wizard";
import "../../assets/css/vue-step-wizard.css";
import { Message } from "../../utilities/sms";
import { log } from "../../utilities/log";
import Flash from "../../utilities/flash";
import { get, post } from "../../utilities/api";
import Verification from "../DVA/verification/verification";
import flash from "../../utilities/flash";

export default {
  components: { Verification, FormWizard, TabContent },
  data() {
    return {
      fullName: "",
      companyName: "",
      referral: "",
      occupations: [
        {
          id: 1,
          jobType: "Trader",
          category: "informal(business)",
          names: ["Food", "Drinks", "Homeware", "Clothing", "Miscellaneous"],
        },
        {
          id: 2,
          jobType: "Driver",
          category: "informal(business)",
          names: ["Keke Napep", "Taxi", "Motorbike", "Bus driver", "Private"],
        },
        {
          id: 3,
          jobType: "Banker",
          category: "formal",
          names: [
            "Teller",
            "Financial Analyst",
            "Loan Officer",
            "Operation",
            "Risk Specialist",
            "Security & Fraud Specialist",
          ],
        },
        {
          id: 4,
          jobType: "Elementary workers",
          category: "informal(business)",
          names: [
            "Mining worker",
            "Construction worker",
            "Manufacturing laborer",
          ],
        },
        {
          id: 5,
          jobType: "Maintenance Worker",
          category: "informal(business)",
          names: [
            "Cleaner",
            "Electrician",
            "Plumber",
            "Carpenter",
            "Welder",
            "Painter",
            "Vulcanizer",
            "Security Guard",
          ],
        },
        {
          id: 6,
          jobType: "Farming",
          category: "informal(business)",
          names: ["Livestock farmer", "Crop farmer"],
        },
        {
          id: 7,
          jobType: "Civil Servant",
          category: "formal",
          names: [],
        },
        {
          id: 8,
          jobType: "Sales & Services",
          category: "informal(business)",
          names: [
            "Car-wash",
            "Laundry",
            "Sales Assistant",
            "Cook",
            "Hairdresser/Barber",
            "Cashier",
            "Waiter",
            "Hotel Assistant",
            "Receptionist",
          ],
        },
        {
          id: 9,
          jobType: "Technical Professionals",
          category: "formal",
          names: [
            "Teacher",
            "Doctor",
            "Lawyer",
            "Nurse",
            "Pharmacist",
            "Journalist",
            "Engineer",
            "Civic",
            "Electrical",
            "Chemical",
            "Mechanical",
            "I.T.",
          ],
        },
        {
          id: 10,
          jobType: "Pastor",
          category: "informal(business)",
          names: [],
        },
        {
          id: 11,
          jobType: "Entertainment",
          category: "informal(business)",
          names: [
            "Actor/Actress",
            "Event Planner",
            "Musician",
            "Producer",
            "Tailor/Fashion Designer",
          ],
        },
        {
          id: 12,
          jobType: "NYSC",
          category: "formal",
          names: [],
        },
        {
          id: 13,
          jobType: "Other",
          category: "informal(business)",
          names: [],
        },
      ],
      mode: this.$route.meta.mode,
      cc_reg_id: "",
      user: {},
      error: {},
      states: {},
      branches: {},
      newCustomer: {},
      fillWorkGuarantor: false,
      gender: ["male", "female"],
      fillPersonalGuarantor: false,
      typesOfHome: ["family", "owned", "rented"],
      paymentPeriod: ["daily", "weekly", "monthly"],
      receiveIncomeMeans: ["bank deposit", "cheque", "cash"],
      noOfRooms: ["one room", "two room", "more than Two room"],
      employmentStatus: ["formal", "informal(business)", "unemployed"],
      relationshipPG: ["friend", "family", "co-worker", "employee", "other"],
      civilStatus: ["single", "married", "divorced", "widow", "live together"],
      relationshipWG: [
        "supervisor",
        "neighbouring worker",
        "co-worker",
        "employee",
      ],
      weekdays: [
        "sunday",
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
      ],
      highestLevelOfEdu: [
        "no studies",
        "secondary",
        "polytechnic",
        "primary",
        "university",
        "masters",
      ],
      durations: [
        "less than 1 year",
        "1 year",
        "2 years",
        "3 years",
        "between 4 - 9 years",
        "more than 10 years",
        "more than 20 years",
      ],
      relationships: [
        "spouse",
        "mother",
        "sibling",
        "uncle",
        "nephew",
        "in-law",
        "friend",
        "child",
        "father",
        "grandparent",
        "cousin",
        "caretaker",
        "grandchild",
      ],

      isLifestyle: false,
      isClick: false,
      occName: [],
      isActive: false,
      isOther: false,
    };
  },
  methods: {
    register() {
      $('input[name="occ"]').attr("disabled", false);
      this.$validator.validateAll().then(async (result) => {
        if (result) {
          if (this.newCustomer.employment_status === "unemployed") {
            Flash.setError(
              "you can only register customer from formal and informal sectors at the moment!"
            );
            return this.$scrollToTop();
          }
          if (this.$network()) {
            this.$LIPS(true);
            this.error = {};
            if (this.mode === "update") {
              let acc = this.$editAccess(this.user, this.newCustomer);
              if (!acc) return this.$networkErr("edit");
            }
            await post(
              `/api/customer${
                this.mode === "update" ? "/" + this.newCustomer.id : ""
              }`,
              this.newCustomer
            )
              .then(({ data }) => {
                let {
                  first_name: FN,
                  last_name: LN,
                  id,
                  branch,
                  telephone: tel,
                } = data.customer;
                Flash.setSuccess(
                  `Customer ${this.mode}d successful! Customer ID is: ${id}`,
                  30000
                );
                log(`${this.mode}dCustomer`, `Customer ID :${id}`);
                if (this.mode === "register") {
                  this.prepareForm(data.prepareForm);
                }
              })
              .catch((e) => {
                e = e.response;
                if (e.status === 422)
                  this.error = e.data.errors ? e.data.errors : e.data;
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
          // this.newCustomer.employment_status = element.category;
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

    getCustomerDetails() {
      this.$LIPS(true);
      get(`/api/customer-contact/get-by-id/${this.cc_reg_id}`)
        .then((res) => {
          let customer = res.data.data;
          this.newCustomer.first_name = customer.name.split(" ")[0];
          this.newCustomer.last_name = customer.name.split(" ")[1];
          this.newCustomer.telephone = customer.phone;
          this.newCustomer.email = customer.email;
          this.newCustomer.reg_id = this.cc_reg_id;
        })
        .catch((err) => {
          flash.setError(
            err.status === 400
              ? err.message
              : this.$displayErrorText("Reg Id does not exist"),
            10000
          );

          const field = this.$validator.fields.find({ name: "cc_reg_id" });
          field.setFlags({ invalid: true });
        })
        .finally(() => {
          this.$LIPS(false);
        });
    },

    setOccupation(name) {
      $(".occupation-option").removeClass("active shadow-sm");
      this.occName.forEach((element) => {
        if (element == name) {
          this.newCustomer.occupation = element;
          $(`.occupation-option[data-name="${name}"]`).addClass(
            "active shadow-sm"
          );
        }
      });
    },
    prepareForm(data) {
      this.states = data.states;
      this.branches = data.branches;
      this.newCustomer = data.form;
      this.user = data.user;
    },
    updateCustomer(customer) {
      if (this.mode === "update")
        [this.fillWorkGuarantor, this.fillPersonalGuarantor] = [true, true];
      this.newCustomer = customer;
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
</style>