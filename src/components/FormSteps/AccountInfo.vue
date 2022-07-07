<template>
    <div>
         <div class="form-group">
              <h5>Prospects Reg ID</h5>
              <label>
                Reg ID
                <span class="text-success mx-4">OPTIONAL</span>
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
              <small v-if="errors.first('cc_reg_id')">
                {{
                  errors.first("cc_reg_id")
                }}
              </small>
            </div>
            <div>
              <h5>Employee Details</h5>

              <div class="form-group col-md-4 px-md-3 px-1 float-left">
                <label>Employee Name</label>
                <input
                  class="form-control"
                  data-vv-name="employee name"
                  disabled
                  name="emp_name"
                  placeholder="Enter Employee name here"
                  type="text"
                  v-model="formData.newCustomer.employee_name"
                  v-validate="'required|max:50'"
                />

                <small v-if="errors.first('emp_name')">
                  {{
                    errors.first("emp_name")
                  }}
                </small>
              </div>

              <div class="form-group col-md-4 px-md-3 px-1 float-left">
                <label>Employee ID (Staff ID)</label>
                <input
                  class="form-control"
                  data-vv-as="employee phone number"
                  disabled
                  name="employee_id"
                  placeholder="Enter Employee number here"
                  type="text"
                  v-model="formData.newCustomer.employee_id"
                  v-validate="'required'"
                />
                <small v-if="errors.first('employee_id')">
                  {{
                    errors.first("employee_id")
                  }}
                </small>
              </div>

              <div class="form-group col-md-4 px-md-3 px-1 float-left">
                <label>Date</label>
                <input
                  class="form-control"
                  data-vv-as="Date of Registration"
                  disabled
                  name="date_of_registration"
                  type="date"
                  v-model="formData.newCustomer.date_of_registration"
                  v-validate="'required'"
                />
                <small
                  v-if="errors.first('date_of_registration')"
                >{{ errors.first("date_of_registration") }}</small>
              </div>

              <div class="spaceAfter"></div>
              <h5>Customer Personal Details</h5>

              <div class="form-group col-md-4 px-md-3 px-1 float-left">
                <label>First Name</label>
                <input
                  class="form-control "
                  data-vv-as="first name"
                  name="first_name"
                  placeholder="Enter First name here.."
                  type="text"
                  v-model="formData.newCustomer.first_name"
                  :class="memberHasError('newCustomer.first_name') ? 'is-invalid' : ''"
                  v-validate="'required|max:25'"
                />
                <!-- <div class="error" v-if="!$v.formData.newCustomer.first_name.minLength ">Field is required.</div> -->
                <div v-if="memberHasError('newCustomer.first_name')" class="invalid-feedback">
                  <div
                    class="error"
                    v-if="!$v.formData.newCustomer.first_name.required"
                  >Please provide a First Name.</div>
                </div>
                <small v-if="errors.first('first_name')">
                  {{
                    errors.first("first_name")
                  }}
                </small>
              </div>

              <div class="form-group col-md-4 px-md-3 px-1 float-left">
                <label>Middle Name</label>
                <input
                  class="form-control"
                  placeholder="Enter Middle name here.."
                  type="text"
                  v-model="formData.newCustomer.middle_name"
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
                  v-model="formData.newCustomer.last_name"
                  :class="memberHasError('newCustomer.last_name') ? 'is-invalid' : ''"
                  v-validate="'required|max:25'"
                />
                <div v-if="memberHasError('newCustomer.last_name')" class="invalid-feedback">
                  <div
                    class="error"
                    v-if="!$v.formData.newCustomer.last_name.required"
                  >Please provide a Last Name.</div>
                </div>
                <small v-if="errors.first('last_name')">
                  {{
                    errors.first("last_name")
                  }}
                </small>
              </div>

              <div class="spaceAfter"></div>

              <div class="form-group col-md-4 px-md-3 px-1 float-left">
                <label>Phone Number</label>
                <input
                  class="form-control"
                  name="telephone"
                  placeholder="Enter Phone number here.."
                  type="number"
                  v-model="formData.newCustomer.telephone"
                  v-validate="'required|numeric|max:11|min:11'"
                  :class="memberHasError('newCustomer.telephone') ? 'is-invalid' : ''"
                />
                <div v-if="memberHasError('newCustomer.telephone')" class="invalid-feedback">
                  <div
                    class="error"
                    v-if="!$v.formData.newCustomer.telephone.required"
                  >Please provide your phone number.</div>
                </div>
                <div v-if="memberHasError('newCustomer.telephone')" class="invalid-feedback">
                  <div
                    class="error"
                    v-if="!$v.formData.newCustomer.telephone.minLength"
                  >The minimum phone number is 11digit.</div>
                </div>
                <div v-if="memberHasError('newCustomer.telephone')" class="invalid-feedback">
                  <div
                    class="error"
                    v-if="!$v.formData.newCustomer.telephone.maxLength"
                  >The maximum phone number is 11digit.</div>
                </div>
                <small v-if="errors.first('telephone')">
                  {{
                    errors.first("telephone")
                  }}
                </small>
                <small v-if="error.telephone">{{ error.telephone[0] }}</small>
              </div>
              <div class="form-group col-md-4 px-md-3 px-1 float-left">
                <label>Email</label>
                <input
                  class="form-control"
                  name="email"
                  placeholder="Enter Email.."
                  type="email"
                  v-model="formData.newCustomer.email"
                  :class="memberHasError('newCustomer.email') ? 'is-invalid' : ''"
                  v-validate="'required|email'"
                />
                <div v-if="memberHasError('newCustomer.email')" class="invalid-feedback">
                  <div
                    class="error"
                    v-if="!$v.formData.newCustomer.email.required"
                  >Please provide your email.</div>
                </div>
                <small v-if="errors.first('email')">
                  {{
                    errors.first("email")
                  }}
                </small>
                <small v-if="error.email">{{ error.email[0] }}</small>
              </div>
              <div class="form-group col-md-4 px-md-3 px-1 float-left">
                <label>Date of Birth</label>
                <input
                  class="form-control"
                  data-vv-as="date of birth"
                  name="date_of_birth"
                  type="date"
                  v-model="formData.newCustomer.date_of_birth"
                  :class="memberHasError('newCustomer.date_of_birth') ? 'is-invalid' : ''"
                  v-validate="'required'"
                />
                <div v-if="memberHasError('newCustomer.date_of_birth')" class="invalid-feedback">
                  <div
                    class="error"
                    v-if="!$v.formData.newCustomer.date_of_birth.required"
                  >Please provide your date of birth.</div>
                </div>
                <small v-if="errors.first('date_of_birth')">
                  {{
                    errors.first("date_of_birth")
                  }}
                </small>
              </div>

              <div class="spaceAfter"></div>

              <div
                class="form-group px-md-3 px-1 float-left"
                :class="(formData.newCustomer.civil_status === 'single') ? 'col-md-12' : 'col-md-8'"
              >
                <label class="w-100 float-left pl-1">Civil Status</label>
                <div
                  class="radio pl-1 float-left"
                >
                  <input
                    class="form-control"
                    id="single"
                    value="single"
                    name="civil_status"
                    type="radio"
                    v-model="formData.newCustomer.civil_status"
                    :class="memberHasError('newCustomer.civil_status') ? 'is-invalid' : ''"
                    v-validate="'required'"
                  />
                  <label for="single">single</label>
                  <div v-if="memberHasError('newCustomer.civil_status')" class="invalid-feedback">
                    <div
                      class="error"
                      v-if="!$v.formData.newCustomer.civil_status.required"
                    >Civil status is required.</div>
                  </div>
                </div>
                <div
                  class="radio pl-1 pr-3 float-left"
                  v-for="(status, index) in civilStatus"
                  :key="'civilStatu' + index"
                >
                  <input
                    :id="status"
                    :value="status"
                    data-vv-as="civil status"
                    name="civil_status"
                    type="radio"
                    @change="$emit('input', status)"
                    v-model="formData.newCustomer.civil_status"
                    :class="memberHasError('newCustomer.civil_status') ? 'is-invalid' : ''"
                    v-validate="'required'"
                  />
                  <label :for="status">{{ status }}</label>
                  
                </div>
                  
              </div>

              <div
                class="form-group col-md-4 px-md-3 px-1 float-left"
                v-if="!(formData.newCustomer.civil_status === 'single')"
              >
                <label>Years together</label>
                <input
                  class="form-control"
                  data-vv-as="years together"
                  name="years_together"
                  placeholder="years together.."
                  type="number"
                  v-model="formData.newCustomer.year_together"
                  v-validate="'required|numeric|max:2'"
                />

                <small v-if="errors.first('years_together')">
                  {{
                    errors.first("years_together")
                  }}
                </small>
              </div>
              <div class="spaceAfter" style='flex-direction: row; justify-content: ;'></div>
              <div class="form-group col-md-2 px-md-3 px-1 float-left">
                <label class="w-100 float-left">Gender</label>
                <div
                  class="radio pl-1 float-left"
                >
                  <input
                    class="form-control"
                    id="male"
                    value="male"
                    name="gender"
                    type="radio"
                    v-model="formData.newCustomer.gender"
                    :class="memberHasError('newCustomer.gender') ? 'is-invalid' : ''"
                    v-validate="'required'"
                  />
                  <label for="male">male</label>
                  <div v-if="memberHasError('newCustomer.gender')" class="invalid-feedback">
                    <div
                      class="error"
                      v-if="!$v.formData.newCustomer.gender.required"
                    >Gender is required.</div>
                  </div>
                </div>
                 <div
                  class="radio pl-1 float-left"
                  v-for="(sex, index) in gender"
                  :key="'gender' + index"
                >
                  <input
                    class="form-control"
                    :id="sex"
                    :value="sex"
                    name="gender"
                     @change="$emit('input', sex)"
                    type="radio"
                    v-model="formData.newCustomer.gender"
                    v-validate="'required'"
                  />
                  <label :for="sex">{{ sex }}</label>
                  
                </div>
              </div>
           <div class="form-group col-md-3 px-md-3 px-1 float-left" >
            <label>Customer Registration Channel</label>
             <select class="custom-select w-100" v-model="formData.newCustomer.channel" 
                  name="channel"
                  placeholder="Enter channel.."
                  type="channel"
                  :class="memberHasError('newCustomer.channel') ? 'is-invalid' : ''"
                  v-validate="'required|channel'">
                <option :value="channel" v-for="channel in channels">{{channel}}
                </option>
              </select>
                <!-- <label>Customer Registration Channel</label>
                <input
                  class="form-control"
                  name="email"
                  placeholder="Enter Email.."
                  type="email"
                  v-model="formData.newCustomer.email"
                  :class="memberHasError('newCustomer.email') ? 'is-invalid' : ''"
                  v-validate="'required|email'"
                /> -->
                <div v-if="memberHasError('newCustomer.channel')" class="invalid-feedback">
                  <div
                    class="error"
                    v-if="!$v.formData.newCustomer.channel.required"
                  >Please provide your channel.</div>
                </div> 
                
              </div>
              <div class="form-group col-md-7 px-md-3 px-1 float-left"  >
                <label class="w-100 float-left pl-1 pr-5"  >Highest Level of Education</label>
                  <div
                  class="radio pl-1 float-left"
                >
                  <input
                    class="form-control"
                    id="no studies"
                    value="no studies"
                    name="highestLevel"
                    type="radio"
                    v-model="formData.newCustomer.level_of_education"
                    :class="memberHasError('newCustomer.level_of_education') ? 'is-invalid' : ''"
                    v-validate="'required'"
                  />
                  <label for="no studies">no studies</label>
                  <div v-if="memberHasError('newCustomer.level_of_education')" class="invalid-feedback">
                    <div
                      class="error"
                      v-if="!$v.formData.newCustomer.level_of_education.required"
                    >Highest level of education is required.</div>
                  </div>
                </div>
                  <div
                    class="radio pl-1 pr-3 float-left"
                    v-for="(highestLevel, index) in highestLevelOfEdu"
                    :key="'highestLevel' + index"
                  >
                    <input
                      :id="highestLevel"
                      :value="highestLevel"
                      data-vv-as="highest level of education"
                      name="highestLevel"
                      type="radio"
                       @change="$emit('input', highestLevel)"
                      v-model="formData.newCustomer.level_of_education"
                      v-validate="'required'"
                    />
                    <label :for="highestLevel">{{ highestLevel }}</label>
                  </div>
               
              </div>
            </div>
    </div>

</template>
<script>
import { validationMixin } from 'vuelidate'
import { get, post } from "../../utilities/api";
import flash from "../../utilities/flash";
export default{
    mixins: [validationMixin],
    props:{
        formData:{
            type: Object,
            required: true
        },
        memberHasError:{
            type:Function
        },
        error:{

        },
        civilStatus:{
            type:Array,
            required:true 
        },
        gender:{
             type:Array,
            required:true 
        },
        highestLevelOfEdu:{
             type:Array,
            required:true 
        },
        $v:{

        },
        channels:{
          type:Array,
          required:true
        }
    },
   data(){
     return{
       cc_reg_id:"",
       
     }
   },
   methods:{
      getCustomerDetails() {
      this.$LIPS(true);
      get(`/api/customer-contact/get-by-id/${this.cc_reg_id}`)
        .then((res) => {
          let customer = res.data.data;
          this.formData.newCustomer.first_name = customer.name.split(" ")[0];
          this.formData.newCustomer.last_name = customer.name.split(" ")[1];
          this.formData.newCustomer.telephone = customer.phone;
          this.formData.newCustomer.email = customer.email;
          this.formData.newCustomer.reg_id = this.cc_reg_id;
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
   }
    
}

</script>
<style>
.red{
    background-color: brown;
}
</style>