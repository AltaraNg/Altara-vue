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
          <tab-content title="Account Info" >
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
                  class="form-control"
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
                    v-model="formData.newCustomer.civil_status"
                    :class="memberHasError('newCustomer.civil_status') ? 'is-invalid' : ''"
                    v-validate="'required'"
                  />
                  <label :for="status">{{ status }}</label>
                  <div v-if="memberHasError('newCustomer.civil_status')" class="invalid-feedback">
                    <div
                      class="error"
                      v-if="!$v.formData.newCustomer.civil_status.required"
                    >Please provide your civil status.</div>
                  </div>
                </div>
                <small v-if="errors.first('civil_status')">
                  {{
                    errors.first("civil_status")
                  }}
                </small>
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
              <div class="spaceAfter"></div>
              <div class="form-group col-md-4 px-md-3 px-1 float-left">
                <label class="w-100 float-left">Gender</label>
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
                    type="radio"
                    v-model="formData.newCustomer.gender"
                    :class="memberHasError('newCustomer.gender') ? 'is-invalid' : ''"
                    v-validate="'required'"
                  />
                  <label :for="sex">{{ sex }}</label>
                  <div v-if="memberHasError('newCustomer.gender')" class="invalid-feedback">
                    <div
                      class="error"
                      v-if="!$v.formData.newCustomer.gender.required"
                    >Please provide your gender.</div>
                  </div>
                </div>
                <small v-if="errors.first('gender')">
                  {{
                    errors.first("gender")
                  }}
                </small>
              </div>

              <div class="form-group col-md-8 px-md-3 px-1 float-left" >
                <label class="w-100 float-left pl-1">Highest Level of Education</label>
                <div class>
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
                      v-model="formData.newCustomer.level_of_education"
                      v-validate="'required'"
                    />
                    <label :for="highestLevel">{{ highestLevel }}</label>
                  </div>
                </div>

                <small v-if="errors.first('highestLevel')">
                  {{
                    errors.first("highestLevel")
                  }}
                </small>
              </div>
            </div>
          </tab-content>

          <tab-content title="Contact Address">
            <div class="form-group">
              <h5>Address</h5>

              <div class="form-group col-md-4 px-md-3 px-1 float-left">
                <label>Street Name</label>
                <input
                  class="form-control"
                  data-vv-as="street name"
                  name="street_name"
                  placeholder="Enter street name here.."
                  type="text"
                  v-model="formData.newCustomer.add_street"
                  :class="memberHasError('newCustomer.add_street') ? 'is-invalid' : ''"
                  v-validate="'required|max:25'"
                />
                <div v-if="memberHasError('newCustomer.add_street')" class="invalid-feedback">
                  <div
                    class="error"
                    v-if="!$v.formData.newCustomer.add_street.required"
                  >Please provide your street.</div>
                </div>
                <small v-if="errors.first('street_name')">
                  {{
                    errors.first("street_name")
                  }}
                </small>
              </div>

              <div class="form-group col-md-4 px-md-3 px-1 float-left">
                <label>House Number</label>
                <input
                  class="form-control"
                  data-vv-as="house number"
                  name="house_number"
                  placeholder="Enter House number here.."
                  type="text"
                  v-model="formData.newCustomer.add_houseno"
                  :class="memberHasError('newCustomer.add_houseno') ? 'is-invalid' : ''"
                  v-validate="'required'"
                />
                <div v-if="memberHasError('newCustomer.add_houseno')" class="invalid-feedback">
                  <div
                    class="error"
                    v-if="!$v.formData.newCustomer.add_houseno.required"
                  >Please provide a House Number.</div>
                </div>
                <small v-if="errors.first('house_number')">
                  {{
                    errors.first("house_number")
                  }}
                </small>
              </div>
              <div class="form-group col-md-4 px-md-3 px-1 float-left">
                <label>Nearest Bus Stop</label>
                <input
                  class="form-control"
                  data-vv-as="nearest bus stop"
                  name="nearest_bus_stop"
                  placeholder="Enter nearest bus stop here.."
                  type="text"
                  v-model="formData.newCustomer.add_nbstop"
                  :class="memberHasError('newCustomer.add_nbstop') ? 'is-invalid' : ''"
                  v-validate="'required'"
                />
                <div v-if="memberHasError('newCustomer.add_nbstop')" class="invalid-feedback">
                  <div
                    class="error"
                    v-if="!$v.formData.newCustomer.add_nbstop.required"
                  >Please provide the nearest Bustop.</div>
                </div>
                <small v-if="errors.first('nearest_bus_stop')">
                  {{
                    errors.first("nearest_bus_stop")
                  }}
                </small>
              </div>

              <div class="spaceAfter"></div>

              <div class="form-group col-md-4 px-md-3 px-1 float-left">
                <label>Area</label>
                <input
                  class="form-control"
                  name="area"
                  placeholder="Enter area here.."
                  type="text"
                  v-model="formData.newCustomer.area_address"
                  :class="memberHasError('newCustomer.area_address') ? 'is-invalid' : ''"
                  v-validate="'required|max:25'"
                />
                <div v-if="memberHasError('newCustomer.area_address')" class="invalid-feedback">
                  <div
                    class="error"
                    v-if="!$v.formData.newCustomer.area_address.required"
                  >Please provide your area.</div>
                </div>
                <small v-if="errors.first('area')">
                  {{
                    errors.first("area")
                  }}
                </small>
              </div>

              <div class="form-group col-md-4 px-md-3 px-1 float-left">
                <label>City</label>
                <input
                  class="form-control"
                  name="city"
                  placeholder="Enter city here.."
                  type="text"
                  v-model="formData.newCustomer.city"
                  :class="memberHasError('newCustomer.city') ? 'is-invalid' : ''"
                  v-validate="'required|max:25'"
                />
                <div v-if="memberHasError('newCustomer.city')" class="invalid-feedback">
                  <div
                    class="error"
                    v-if="!$v.formData.newCustomer.city.required"
                  >Please provide your city name.</div>
                </div>
                <small v-if="errors.first('city')">
                  {{
                    errors.first("city")
                  }}
                </small>
              </div>

              <div class="form-group col-md-4 px-md-3 px-1 float-left">
                <label>State</label>
                <select
                  class="custom-select w-100"
                  data-vv-validate-on="blur"
                  name="state"
                  v-model="formData.newCustomer.state"
                  :class="memberHasError('newCustomer.state') ? 'is-invalid' : ''"
                  v-validate="'required'"
                >
                  <option value>select state</option>
                  <option
                    v-bind:value="state.name"
                    v-for="(state, index) in states"
                    :key="'states' + index"
                  >{{ state.name }}</option>
                </select>
                <div v-if="memberHasError('newCustomer.state')" class="invalid-feedback">
                  <div
                    class="error"
                    v-if="!$v.formData.newCustomer.state.required"
                  >Please provide a State.</div>
                </div>
                <small v-if="errors.first('state')">
                  {{
                    errors.first("state")
                  }}
                </small>
              </div>

              <div class="spaceAfter"></div>

              <div class="form-group col-md-12 px-md-3 px-1 float-left">
                <label>Describe Location</label>
                <textarea
                  class="form-control col-sm-12"
                  placeholder="Describe the Location"
                  rows="1"
                  v-model="formData.newCustomer.add_addinfo_description"
                ></textarea>
              </div>
            </div>
          </tab-content>

          <tab-content title="Household Info">
            <div class="form-group">
              <div class="form-group col-md-4 px-md-3 px-1 float-left">
                <label>Duration of Residence</label>
                <input
                  class="form-control"
                  data-vv-as="duration of residence"
                  name="duration_of_residence"
                  placeholder="Duration of residence.."
                  type="number"
                  v-model="formData.newCustomer.duration_of_residence"
                  :class="memberHasError('newCustomer.duration_of_residence') ? 'is-invalid' : ''"
                  v-validate="'required|numeric|max:2'"
                />
                <div
                  v-if="memberHasError('newCustomer.duration_of_residence')"
                  class="invalid-feedback"
                >
                  <div
                    class="error"
                    v-if="!$v.formData.newCustomer.duration_of_residence.required"
                  >Please provide duration of residence.</div>
                </div>
                <small
                  v-if="errors.first('duration_of_residence')"
                >{{ errors.first("duration_of_residence") }}</small>
              </div>
              <div class="form-group col-md-4 px-md-3 px-1 float-left">
                <label>How many people live in your household?</label>
                <input
                  class="form-control"
                  data-vv-as="number in household"
                  name="number_in_household"
                  placeholder="Enter number here.."
                  type="number"
                  v-model="formData.newCustomer.people_in_household"
                  :class="memberHasError('newCustomer.people_in_household') ? 'is-invalid' : ''"
                  v-validate="'required|numeric|max:2'"
                />
                <div
                  v-if="memberHasError('newCustomer.people_in_household')"
                  class="invalid-feedback"
                >
                  <div
                    class="error"
                    v-if="!$v.formData.newCustomer.people_in_household.required"
                  >Please provide people in household.</div>
                </div>
                <small
                  v-if="errors.first('number_in_household')"
                >{{ errors.first("number_in_household") }}</small>
              </div>
              <div class="form-group col-md-4 px-md-3 px-1 float-left">
                <label>How many people depend on you?</label>
                <input
                  class="form-control"
                  data-vv-as="no depend on you"
                  name="no_depend_on_you"
                  placeholder="Enter number here.."
                  type="number"
                  v-model="formData.newCustomer.depend_on_you"
                  :class="memberHasError('newCustomer.depend_on_you') ? 'is-invalid' : ''"
                  v-validate="'required|numeric|max:2'"
                />
                <div v-if="memberHasError('newCustomer.depend_on_you')" class="invalid-feedback">
                  <div
                    class="error"
                    v-if="!$v.formData.newCustomer.depend_on_you.required"
                  >Please provide how many people depend on you.</div>
                </div>
                <small v-if="errors.first('no_depend_on_you')">
                  {{
                    errors.first("no_depend_on_you")
                  }}
                </small>
              </div>
              <div class="spaceAfter"></div>
              <div class="form-group col-md-4 float-left">
                <label>How many work?</label>
                <input
                  class="form-control"
                  data-vv-as="how many work"
                  name="how_many_work"
                  placeholder="Enter number here.."
                  type="number"
                  v-model="formData.newCustomer.number_of_work"
                  :class="memberHasError('newCustomer.number_of_work') ? 'is-invalid' : ''"
                  v-validate="'required|numeric|max:2'"
                />
                <div v-if="memberHasError('newCustomer.number_of_work')" class="invalid-feedback">
                  <div
                    class="error"
                    v-if="!$v.formData.newCustomer.number_of_work.required"
                  >Please provide how many work.</div>
                </div>
                <small v-if="errors.first('how_many_work')">
                  {{
                    errors.first("how_many_work")
                  }}
                </small>
              </div>
              <div class="form-group col-md-4 float-left">
                <label>Time Available for Visit</label>
                <input
                  class="form-control"
                  data-vv-as="time from"
                  placeholder="From"
                  name="time_from"
                  type="time"
                  v-model="formData.newCustomer.visit_hour_from"
                  :class="memberHasError('newCustomer.visit_hour_from') ? 'is-invalid' : ''"
                  v-validate="'required'"
                />
                <div v-if="memberHasError('newCustomer.visit_hour_from')" class="invalid-feedback">
                  <div
                    class="error"
                    v-if="!$v.formData.newCustomer.visit_hour_from.required"
                  >Please provide time of visit.</div>
                </div>
                <small v-if="errors.first('time_from')">
                  {{
                    errors.first("time_from")
                  }}
                </small>
              </div>

              <div class="form-group col-md-4 float-left">
                <label></label>
                <input
                  class="form-control"
                  placeholder="To"
                  data-vv-as="time to"
                  name="time_to"
                  type="time"
                  v-model="formData.newCustomer.visit_hour_to"
                  :class="memberHasError('newCustomer.visit_hour_to') ? 'is-invalid' : ''"
                  v-validate="'required'"
                />
                <div v-if="memberHasError('newCustomer.visit_hour_to')" class="invalid-feedback">
                  <div
                    class="error"
                    v-if="!$v.formData.newCustomer.visit_hour_to.required"
                  >Please provide time of visit.</div>
                </div>
                <small v-if="errors.first('time_to')">
                  {{
                    errors.first("time_to")
                  }}
                </small>
              </div>
              <div class="spaceAfter"></div>
              <div class="form-group col-md-6 px-md-3 px-1 float-left">
                <label class="w-100 float-left pl-1">Type of Home</label>
                <div
                  class="radio pl-1 pr-3 float-left"
                  v-for="(typeOfHome, index) in typesOfHome"
                  :key="'typesOfHome' + index"
                >
                  <input
                    :id="typeOfHome"
                    :value="typeOfHome"
                    data-vv-as="type of home"
                    name="typeOfHome"
                    type="radio"
                    v-model="formData.newCustomer.type_of_home"
                    :class="memberHasError('newCustomer.type_of_home') ? 'is-invalid' : ''"
                    v-validate="'required'"
                  />
                  <label :for="typeOfHome">{{ typeOfHome }}</label>
                </div>
                <div v-if="memberHasError('newCustomer.type_of_home')" class="invalid-feedback">
                  <div
                    class="error"
                    v-if="!$v.formData.newCustomer.type_of_home.required"
                  >Please provide type of home.</div>
                </div>
                <small v-if="errors.first('typeOfHome')">
                  {{
                    errors.first("typeOfHome")
                  }}
                </small>
              </div>

              <div class="form-group col-md-6 px-md-3 px-1 float-left">
                <label class="w-100 float-left pl-1">Number of Rooms</label>
                <div
                  class="radio pl-1 pr-3 float-left"
                  v-for="(noOfRoom, index) in noOfRooms"
                  :key="'noOfRooms' + index"
                >
                  <input
                    :id="noOfRoom"
                    :value="noOfRoom"
                    data-vv-as="number of rooms"
                    name="noOfRoom"
                    type="radio"
                    v-model="formData.newCustomer.no_of_rooms"
                    :class="memberHasError('newCustomer.no_of_rooms') ? 'is-invalid' : ''"
                    v-validate="'required'"
                  />
                  <label :for="noOfRoom">{{ noOfRoom }}</label>
                </div>
                <div v-if="memberHasError('newCustomer.no_of_rooms')" class="invalid-feedback">
                  <div
                    class="error"
                    v-if="!$v.formData.newCustomer.no_of_rooms.required"
                  >Please provide number of room(s).</div>
                </div>
                <small v-if="errors.first('noOfRoom')">
                  {{
                    errors.first("noOfRoom")
                  }}
                </small>
              </div>
              <div class="spaceAfter"></div>
              <h5>Next of Kin</h5>

              <div class="form-group col-md-6 px-md-3 px-1 float-left">
                <label>First Name</label>
                <input
                  class="form-control"
                  data-vv-as="next of kin first name"
                  name="NOK_first_name"
                  placeholder="Enter first name"
                  type="text"
                  v-model="formData.newCustomer.nextofkin_first_name"
                  :class="memberHasError('newCustomer.nextofkin_first_name') ? 'is-invalid' : ''"
                  v-validate="'required|max:25'"
                />
                <div v-if="memberHasError('newCustomer.last_name')" class="invalid-feedback">
                  <div
                    class="error"
                    v-if="!$v.formData.newCustomer.last_name.minLength"
                  >The minimum phone number is 11 digits.</div>
                </div>
                <div
                  v-if="memberHasError('newCustomer.nextofkin_first_name')"
                  class="invalid-feedback"
                >
                  <div
                    class="error"
                    v-if="!$v.formData.newCustomer.nextofkin_first_name.required"
                  >Please provide a First Name.</div>
                </div>
                <small v-if="errors.first('NOK_first_name')">
                  {{
                    errors.first("NOK_first_name")
                  }}
                </small>
              </div>

              <div class="form-group col-md-6 px-md-3 px-1 float-left">
                <label>Middle Name</label>
                <input
                  class="form-control"
                  placeholder="Enter middle name"
                  type="text"
                  v-model="formData.newCustomer.nextofkin_middle_name"
                />
              </div>
              <div class="spaceAfter"></div>
              <div class="form-group col-md-6 px-md-3 px-1 float-left">
                <label>Last Name</label>
                <input
                  class="form-control"
                  data-vv-as="next of kin last name"
                  name="NOK_last_name"
                  placeholder="Enter last name"
                  type="text"
                  v-model="formData.newCustomer.nextofkin_last_name"
                  :class="memberHasError('newCustomer.nextofkin_last_name') ? 'is-invalid' : ''"
                  v-validate="'required|max:25'"
                />
                <div
                  v-if="memberHasError('newCustomer.nextofkin_last_name')"
                  class="invalid-feedback"
                >
                  <div
                    class="error"
                    v-if="!$v.formData.newCustomer.nextofkin_last_name.required"
                  >Please provide a Last Name.</div>
                </div>
                <small v-if="errors.first('NOK_last_name')">
                  {{
                    errors.first("NOK_last_name")
                  }}
                </small>
              </div>

              <div class="form-group col-md-6 px-md-3 px-1 float-left">
                <label>Phone Number</label>
                <input
                  class="form-control"
                  data-vv-as="next of kin phone number"
                  name="NOK_phone_number"
                  placeholder="Enter phone number"
                  type="number"
                  v-model="formData.newCustomer.nextofkin_telno"
                  :class="memberHasError('newCustomer.nextofkin_telno') ? 'is-invalid' : ''"
                  v-validate="'required|numeric|max:11|min:11'"
                />
                <div v-if="memberHasError('newCustomer.nextofkin_telno')" class="invalid-feedback">
                  <div
                    class="error"
                    v-if="!$v.formData.newCustomer.nextofkin_telno.required"
                  >Please provide next of kin phone number.</div>
                  <div
                    class="error"
                    v-if="!$v.formData.newCustomer.nextofkin_telno.minLength"
                  >The minimum phone number is 11digit.</div>
                  <div
                    class="error"
                    v-if="!$v.formData.newCustomer.nextofkin_telno.maxLength"
                  >The maximum phone number is 11digit.</div>
                </div>

                <small v-if="errors.first('NOK_phone_number')">
                  {{
                    errors.first("NOK_phone_number")
                  }}
                </small>
              </div>
              <div class="spaceAfter"></div>
            </div>
          </tab-content>
          <tab-content title="Work Details">
            <div class="form-group">
              <h5>Work Details - Select Occupation</h5>

              <div class="form-group mb-5 col-md-12 px-md-3 px-1 float-left">
                <div class="form-group col-md-3 px-md-3 px-1 mt-2 float-left">
                  <label>Employment Status</label>
                  <select
                    class="custom-select w-100"
                    v-model="formData.newCustomer.employment_status"
                    :class="memberHasError('newCustomer.employment_status') ? 'is-invalid' : ''"
                    v-validate="'required'"
                    name="emp"
                  >
                    <option value="informal(business)">informal(business)</option>
                    <option value="formal">formal</option>
                    <option value="unemployed">unemployed</option>
                  </select>
                  <div
                    v-if="memberHasError('newCustomer.employment_status')"
                    class="invalid-feedback"
                  >
                    <div
                      class="error"
                      v-if="!$v.formData.newCustomer.employment_status.required"
                    >Please provide employment status.</div>
                  </div>
                  <small v-if="errors.has('emp')">{{ errors.first("emp") }}</small>
                </div>
                <br />
                <span
                  v-for="(occupation, index) in occupations"
                  :key="'occupations' + index"
                  class="badge badge-primary occupation-title"
                  @click="checkOccupation(occupation.id)"
                  :data-id="occupation.id"
                >{{ occupation.jobType }}</span>
                &nbsp;
                <hr class="my-4" />

                <span
                  v-if="isClick"
                  @click="setOccupation(name)"
                  v-for="(name, index) in occName"
                  :key="'occName' + index"
                  class="badge badge-default occupation-option"
                  :data-name="name"
                >{{ name }}</span>
                &nbsp;
                <div class="form-group col-md-3 col-12 px-md-3 px-1 mt-2 float-left">
                  <label>Occupation</label>
                  <input
                    class="form-control"
                    name="occ"
                    :disabled="!(isOther && isClick)"
                    placeholder="Enter occupation here"
                    type="text"
                    v-validate="'required'"
                    v-model="formData.newCustomer.occupation"
                    :class="memberHasError('newCustomer.occupation') ? 'is-invalid' : ''"
                  />
                </div>
                <div v-if="memberHasError('newCustomer.occupation')" class="invalid-feedback">
                  <div
                    class="error"
                    v-if="!$v.formData.newCustomer.occupation.required"
                  >Please provide occupation.</div>
                </div>
                <small v-if="errors.has('occ')">{{ errors.first("occ") }}</small>
              </div>

              <transition name="fade">
                <div
                  v-if="
                    formData.newCustomer.employment_status === 'formal' &&
                    formData.newCustomer.occupation !== ''
                  "
                >
                  <div class="form-group col-md-6 px-md-3 px-1 float-left">
                    <label>
                      Phone number of working/business individual in
                      household
                    </label>
                    <input
                      class="form-control"
                      data-vv-as="office phone"
                      name="office_phone"
                      placeholder="Enter Phone Number here"
                      type="number"
                      key="office_phone_formal"
                      v-model="formData.newCustomer.working_individual_Phone_number"
                      v-validate="'required|numeric|max:11|min:11'"
                    />
                    <div
                      v-if="memberHasError('newCustomer.working_individual_Phone_number')"
                      class="invalid-feedback"
                    >
                      <div
                        class="error"
                        v-if="!$v.formData.newCustomer.working_individual_Phone_number.minLength"
                      >The minimum phone number is 11 digits.</div>
                    </div>
                    <div
                      v-if="memberHasError('newCustomer.working_individual_Phone_number')"
                      class="invalid-feedback"
                    >
                      <div
                        class="error"
                        v-if="!$v.formData.newCustomer.working_individual_Phone_number.maxLength"
                      >The maximum phone number is 11 digits.</div>
                    </div>

                    <small v-if="errors.first('office_phone')">
                      {{
                        errors.first("office_phone")
                      }}
                    </small>
                  </div>

                  <div class="form-group col-md-6 px-md-3 px-1 float-left">
                    <label>Name of the company</label>
                    <input
                      class="form-control"
                      data-vv-as="name of firm"
                      name="name_of_firm"
                      placeholder="Enter name of company here"
                      type="text"
                      key="name_of_form_formal"
                      v-model="formData.newCustomer.name_of_company_or_business"
                      v-validate="'required|max:100'"
                    />

                    <small v-if="errors.first('name_of_firm')">
                      {{
                        errors.first("name_of_firm")
                      }}
                    </small>
                  </div>

                  <div class="spaceBetween"></div>

                  <div class="form-group col-md-6 px-md-3 px-1 float-left">
                    <label>Current Salary</label>
                    <input
                      class="form-control"
                      data-vv-as="current salary"
                      name="current_salary"
                      placeholder="Current Salary or Monthly income"
                      type="number"
                      key="current_salary_formal"
                      v-model="formData.newCustomer.current_sal_or_business_income"
                      v-validate="'required'"
                    />

                    <small v-if="errors.has('current_salary')">{{ errors.first("current_salary") }}</small>
                  </div>

                  <div class="form-group col-md-6 px-md-3 px-1 float-left">
                    <label>Position/post in the company</label>
                    <input
                      class="form-control"
                      placeholder="Enter position/post here"
                      type="text"
                      v-model="formData.newCustomer.post_in_company"
                    />
                  </div>

                  <div class="spaceBetween"></div>

                  <div class="form-group col-md-6 px-md-3 px-1 float-left">
                    <label class="w-100 float-left pl-1">How do you receive salary?</label>
                    <div
                      class="radio pl-1 pr-3 float-left"
                      v-for="(means, index) in receiveIncomeMeans"
                      :key="'receiveIncomeMeans' + index"
                    >
                      <input
                        :id="means"
                        :value="means"
                        data-vv-as="income means"
                        name="means"
                        type="radio"
                        v-model="formData.newCustomer.receive_income_means"
                        v-validate="'required'"
                      />
                      <label :for="means">{{ means }}</label>
                    </div>

                    <small v-if="errors.first('means')">
                      {{
                        errors.first("means")
                      }}
                    </small>
                  </div>

                  <div class="form-group col-md-6 px-md-3 px-1 float-left">
                    <label class="w-100 float-left pl-1">Payment Period</label>
                    <div
                      class="radio pl-1 pr-3 float-left"
                      v-for="(period, index) in paymentPeriod"
                      :key="'paymentPeriod' + index"
                    >
                      <input
                        :id="period"
                        :value="period"
                        data-vv-as="payment period"
                        name="period"
                        type="radio"
                        v-model="formData.newCustomer.payment_period"
                        v-validate="'required'"
                      />
                      <label :for="period">{{ period }}</label>
                    </div>

                    <small v-if="errors.first('period')">
                      {{
                        errors.first("period")
                      }}
                    </small>
                  </div>

                  <div class="spaceBetween"></div>

                  <div class="form-group col-md-3 px-md-3 px-1 float-left">
                    <label>Duration in Current work</label>
                    <select
                      class="custom-select w-100"
                      data-vv-as="work duration"
                      data-vv-validate-on="blur"
                      name="work_duration"
                      v-model="formData.newCustomer.years_of_existence_or_work_duration"
                      v-validate="'required'"
                    >
                      <option value>select duration</option>
                      <option
                        :value="duration"
                        v-for="(duration, index) in durations"
                        :key="'durations' + index"
                      >{{ duration }}</option>
                    </select>

                    <small v-if="errors.first('work_duration')">{{ errors.first("work_duration") }}</small>
                  </div>

                  <div class="form-group col-md-9 px-md-3 px-1 float-left">
                    <label class="w-100 float-left">Days of Work</label>
                    <div
                      class="checkbox float-left pr-3"
                      v-for="(day, index) in weekdays"
                      :key="'weekdays' + index"
                    >
                      <input
                        :id="day"
                        :value="day"
                        data-vv-as="days of work"
                        name="days_of_work"
                        type="checkbox"
                        v-model="formData.newCustomer.days_of_work"
                        v-validate="'required'"
                      />
                      <label :for="day">{{ day }}</label>
                    </div>

                    <div v-if="memberHasError('newCustomer.days_of_work')" class="invalid-feedback">
                      <div
                        class="error"
                        v-if="!$v.formData.newCustomer.days_of_work.required"
                      >Please provide days.</div>
                    </div>
                    <small v-if="errors.first('days_of_work')">
                      {{
                        errors.first("days_of_work")
                      }}
                    </small>
                  </div>

                  <div class="spaceAfter"></div>
                  <h5>Address of Office</h5>

                  <div class="form-group col-md-4 px-md-3 px-1 float-left">
                    <label>Street Name</label>
                    <input
                      class="form-control"
                      data-vv-as="office street name"
                      name="office_street_name"
                      placeholder="Enter Street name here"
                      type="text"
                      v-model="formData.newCustomer.comp_street_name"
                      v-validate="'required|max:50'"
                    />

                    <small
                      v-if="errors.first('office_street_name')"
                    >{{ errors.first("office_street_name") }}</small>
                  </div>

                  <div class="form-group col-md-4 px-md-3 px-1 float-left">
                    <label>Office Building Number</label>
                    <input
                      class="form-control"
                      data-vv-as="office building number"
                      name="office_building_number"
                      placeholder="Enter Building Number"
                      type="text"
                      v-model="formData.newCustomer.comp_house_no"
                      v-validate="'required|max:50'"
                    />

                    <small
                      v-if="errors.first('office_building_number')"
                    >{{ errors.first("office_building_number") }}</small>
                  </div>

                  <div class="form-group col-md-4 px-md-3 px-1 float-left">
                    <label>Nearest Bus Stop</label>
                    <input
                      class="form-control"
                      data-vv-as="office nearest bus stop"
                      name="office_nearest_bus_stop"
                      placeholder="Enter nearest bus stop"
                      type="text"
                      v-model="formData.newCustomer.cadd_nbstop"
                      v-validate="'required|max:50'"
                    />
                    <div v-if="memberHasError('newCustomer.cadd_nbstop')" class="invalid-feedback">
                      <div
                        class="error"
                        v-if="!$v.formData.newCustomer.cadd_nbstop.required"
                      >Please provide a bustop.</div>
                    </div>
                    <small
                      v-if="errors.first('office_nearest_bus_stop')"
                    >{{ errors.first("office_nearest_bus_stop") }}</small>
                  </div>

                  <div class="spaceBetween"></div>

                  <div class="form-group col-md-4 px-md-3 px-1 float-left">
                    <label>Area</label>
                    <input
                      class="form-control"
                      data-vv-as="company area"
                      name="company_area"
                      placeholder="Enter area"
                      type="text"
                      v-model="formData.newCustomer.comp_area"
                      v-validate="'required|max:50'"
                    />
                    <div v-if="memberHasError('newCustomer.comp_area')" class="invalid-feedback">
                      <div
                        class="error"
                        v-if="!$v.formData.newCustomer.comp_area.required"
                      >Please provide area.</div>
                    </div>
                    <small v-if="errors.first('company_area')">
                      {{
                        errors.first("company_area")
                      }}
                    </small>
                  </div>

                  <div class="form-group col-md-4 px-md-3 px-1 float-left">
                    <label>City</label>
                    <input
                      class="form-control"
                      data-vv-as="company city"
                      name="company_city"
                      placeholder="Enter city"
                      type="text"
                      v-model="formData.newCustomer.company_city"
                      v-validate="'required|max:50'"
                    />

                    <small v-if="errors.first('company_city')">
                      {{
                        errors.first("company_city")
                      }}
                    </small>
                  </div>

                  <div class="form-group col-md-4 px-md-3 px-1 float-left">
                    <label>State</label>
                    <select
                      class="custom-select w-100"
                      data-vv-as="company state"
                      data-vv-validate-on="blur"
                      name="company_state"
                      v-model="formData.newCustomer.company_state"
                      v-validate="'required'"
                    >
                      <option value>select state</option>
                      <option
                        :value="state.name"
                        v-for="(state, index) in states"
                        :key="'states2' + index"
                      >{{ state.name }}</option>
                    </select>

                    <small v-if="errors.first('company_state')">{{ errors.first("company_state") }}</small>
                  </div>

                  <div class="spaceBetween"></div>

                  <div class="form-group col-md-4 px-md-3 px-1 float-left">
                    <label>Phone Number</label>
                    <input
                      class="form-control"
                      data-vv-as="company phone number"
                      name="company_phone_number"
                      placeholder="Enter city"
                      type="number"
                      v-model="formData.newCustomer.company_telno"
                      v-validate="'required|numeric|max:11|min:11'"
                    />

                    <small
                      v-if="errors.first('company_phone_number')"
                    >{{ errors.first("company_phone_number") }}</small>
                  </div>

                  <div class="form-group col-md-4 px-md-3 px-1 float-left">
                    <label>Time Available for Visit: From</label>
                    <input
                      class="form-control"
                      data-vv-as="available from"
                      name="available_from"
                      type="time"
                      v-model="formData.newCustomer.cvisit_hour_from"
                      v-validate="'required'"
                    />

                    <small
                      v-if="errors.first('available_from')"
                    >{{ errors.first("available_from") }}</small>
                  </div>

                  <div class="form-group col-md-4 px-md-3 px-1 float-left">
                    <label>To</label>
                    <input
                      class="form-control"
                      data-vv-as="available to"
                      name="available_to"
                      type="time"
                      v-model="formData.newCustomer.cvisit_hour_to"
                      v-validate="'required'"
                    />

                    <small v-if="errors.first('available_to')">
                      {{
                        errors.first("available_to")
                      }}
                    </small>
                  </div>

                  <div class="spaceBetween"></div>

                  <div class="form-group col-md-12 px-md-3 px-1 float-left">
                    <label>Describe Location</label>
                    <textarea
                      class="form-control col-sm-12"
                      placeholder="Describe the Location"
                      rows="1"
                      v-model="formData.newCustomer.cadd_addinfo"
                    ></textarea>
                  </div>
                </div>

                <div
                  v-else-if="
                    formData.newCustomer.employment_status === 'informal(business)' &&
                    formData.newCustomer.occupation !== ''
                  "
                >
                  <div class="form-group col-md-6 px-md-3 px-1 float-left">
                    <label>
                      Phone number of working/business individual in
                      household
                    </label>
                    <input
                      class="form-control"
                      data-vv-as="office phone"
                      name="office_phone"
                      placeholder="Enter Phone Number here"
                      type="number"
                      key="office_phone_informal"
                      v-model="formData.newCustomer.working_individual_Phone_number"
                      v-validate="'required|numeric|max:11|min:11'"
                    />
                    <div v-if="memberHasError('newCustomer.last_name')" class="invalid-feedback">
                      <div
                        class="error"
                        v-if="!$v.formData.newCustomer.last_name.minLength"
                      >The minimum phone number is 11 digits.</div>
                    </div>
                    <div v-if="memberHasError('newCustomer.last_name')" class="invalid-feedback">
                      <div
                        class="error"
                        v-if="!$v.formData.newCustomer.last_name.maxLength"
                      >The maximum phone number is 11 digits.</div>
                    </div>

                    <small v-if="errors.first('office_phone')">
                      {{
                        errors.first("office_phone")
                      }}
                    </small>
                  </div>

                  <div class="form-group col-md-6 px-md-3 px-1 float-left">
                    <label>Name of the Business</label>
                    <input
                      class="form-control"
                      data-vv-as="name of firm"
                      name="name_of_firm"
                      placeholder="Enter name of company here"
                      type="text"
                      key="name_of_form_informal"
                      v-model="formData.newCustomer.name_of_company_or_business"
                      v-validate="'required|max:100'"
                    />

                    <small v-if="errors.first('name_of_firm')">
                      {{
                        errors.first("name_of_firm")
                      }}
                    </small>
                  </div>

                  <div class="spaceBetween"></div>

                  <div class="form-group col-md-6 px-md-3 px-1 float-left">
                    <label>Name of Market</label>
                    <input
                      class="form-control"
                      data-vv-as="name of market"
                      name="market_of_name"
                      placeholder="name of market"
                      type="text"
                      v-model="formData.newCustomer.market_name"
                      v-validate="'required'"
                    />
                    <div v-if="memberHasError('newCustomer.market_name')" class="invalid-feedback">
                      <div
                        class="error"
                        v-if="!$v.formData.newCustomer.market_name.required"
                      >Please provide a market name.</div>
                    </div>
                    <small v-if="errors.has('market_of_name')">
                      {{
                        errors.first("market_of_name")
                      }}
                    </small>
                  </div>

                  <div class="form-group col-md-6 px-md-3 px-1 float-left">
                    <label>Monthly Businesss income</label>
                    <input
                      class="form-control"
                      data-vv-as="current salary"
                      name="current_salary"
                      placeholder="Current Salary or Monthly income"
                      type="number"
                      key="current_salary_informal"
                      v-model="formData.newCustomer.current_sal_or_business_income"
                      v-validate="'required|numeric'"
                    />

                    <small v-if="errors.has('current_salary')">{{ errors.first("current_salary") }}</small>
                  </div>

                  <div class="spaceBetween"></div>

                  <div class="form-group col-md-6 px-md-3 px-1 float-left">
                    <label>Monthly Gains</label>
                    <input
                      class="form-control"
                      data-vv-as="monthly gains"
                      name="monthly_gains"
                      placeholder="monthly gains"
                      type="number"
                      v-model="formData.newCustomer.monthly_gains"
                      v-validate="'required|numeric'"
                    />

                    <small v-if="errors.first('monthly_gains')">{{ errors.first("monthly_gains") }}</small>
                  </div>

                  <div class="form-group col-md-6 px-md-3 px-1 float-left">
                    <label>Years of Existence</label>
                    <select
                      class="custom-select w-100"
                      data-vv-as="years of existence"
                      data-vv-validate-on="blur"
                      name="work_duration"
                      v-model="formData.newCustomer.years_of_existence_or_work_duration"
                      v-validate="'required'"
                    >
                      <option value>select duration</option>
                      <option
                        :value="duration"
                        v-for="(duration, index) in durations"
                        :key="'durations' + index"
                      >{{ duration }}</option>
                    </select>

                    <small v-if="errors.first('work_duration')">{{ errors.first("work_duration") }}</small>
                  </div>

                  <div class="spaceBetween"></div>

                  <div class="form-group col-md-3 col-6 px-md-3 px-1 float-left">
                    <label class="w-100 float-left pl-1">Do you have a bank account?</label>
                    <div class="radio pl-1 pr-3 float-left">
                      <input
                        data-vv-as="bank account"
                        id="bank_account_yes"
                        name="bank_account"
                        type="radio"
                        v-model="formData.newCustomer.bank_account"
                        v-validate="'required'"
                        value="Yes"
                      />
                      <label for="bank_account_yes">Yes</label>
                    </div>
                    <div class="radio pl-1 pr-3 float-left">
                      <input
                        id="bank_account_no"
                        name="bank_account"
                        type="radio"
                        v-model="newCustomer.bank_account"
                        value="No"
                      />
                      <label for="bank_account_no">No</label>
                    </div>
                    <div v-if="memberHasError('newCustomer.bank_account')" class="invalid-feedback">
                      <div
                        class="error"
                        v-if="!$v.formData.newCustomer.bank_account.required"
                      >Please provide bank account.</div>
                    </div>
                    <small v-if="errors.first('bank_account')">
                      {{
                        errors.first("bank_account")
                      }}
                    </small>
                  </div>

                  <div class="form-group col-md-9 px-md-3 px-1 float-left">
                    <label class="w-100 float-left">Days of Work</label>
                    <div
                      class="checkbox float-left pr-3"
                      v-for="(day, index) in weekdays"
                      :key="'weekdays' + index"
                    >
                      <input
                        :id="day"
                        :value="day"
                        data-vv-as="days of work"
                        name="days_of_work"
                        type="checkbox"
                        v-model="formData.newCustomer.days_of_work"
                        v-validate="'required'"
                      />
                      <label :for="day">{{ day }}</label>
                    </div>
                    <div v-if="memberHasError('newCustomer.days_of_work')" class="invalid-feedback">
                      <div
                        class="error"
                        v-if="!$v.formData.newCustomer.days_of_work.required"
                      >Please provide days of work.</div>
                    </div>
                    <small v-if="errors.first('days_of_work')">
                      {{
                        errors.first("days_of_work")
                      }}
                    </small>
                  </div>

                  <div class="spaceAfter"></div>
                  <h5>Address of Business</h5>

                  <div class="form-group col-md-4 px-md-3 px-1 float-left">
                    <label>Street Name</label>
                    <input
                      class="form-control"
                      data-vv-as="office street name"
                      name="office_street_name"
                      placeholder="Enter Street name here"
                      type="text"
                      v-model="formData.newCustomer.comp_street_name"
                      v-validate="'required|max:50'"
                    />

                    <small
                      v-if="errors.first('office_street_name')"
                    >{{ errors.first("office_street_name") }}</small>
                  </div>

                  <div class="form-group col-md-4 px-md-3 px-1 float-left">
                    <label>Shop Number</label>
                    <input
                      class="form-control"
                      data-vv-as="office building number"
                      name="office_building_number"
                      placeholder="Enter Building Number"
                      type="text"
                      v-model="formData.newCustomer.comp_house_no"
                      v-validate="'required|max:50'"
                    />

                    <small
                      v-if="errors.first('office_building_number')"
                    >{{ errors.first("office_building_number") }}</small>
                  </div>

                  <div class="form-group col-md-4 px-md-3 px-1 float-left">
                    <label>Nearest Bus Stop</label>
                    <input
                      class="form-control"
                      data-vv-as="office nearest bus stop"
                      name="office_nearest_bus_stop"
                      placeholder="Enter nearest bus stop"
                      type="text"
                      v-model="formData.newCustomer.cadd_nbstop"
                      v-validate="'required|max:50'"
                    />
                    <div v-if="memberHasError('newCustomer.cadd_nbstop')" class="invalid-feedback">
                      <div
                        class="error"
                        v-if="!$v.formData.newCustomer.cadd_nbstop.required"
                      >Please provide bustop.</div>
                    </div>
                    <small
                      v-if="errors.first('office_nearest_bus_stop')"
                    >{{ errors.first("office_nearest_bus_stop") }}</small>
                  </div>

                  <div class="spaceBetween"></div>

                  <div class="form-group col-md-4 px-md-3 px-1 float-left">
                    <label>Area</label>
                    <input
                      class="form-control"
                      data-vv-as="company area"
                      name="company_area"
                      placeholder="Enter area"
                      type="text"
                      v-model="formData.newCustomer.comp_area"
                      v-validate="'required|max:50'"
                    />
                    <div v-if="memberHasError('newCustomer.comp_area')" class="invalid-feedback">
                      <div
                        class="error"
                        v-if="!$v.formData.newCustomer.comp_area.required"
                      >Please provide area.</div>
                    </div>
                    <small v-if="errors.first('company_area')">
                      {{
                        errors.first("company_area")
                      }}
                    </small>
                  </div>

                  <div class="form-group col-md-4 px-md-3 px-1 float-left">
                    <label>City</label>
                    <input
                      class="form-control"
                      data-vv-as="company city"
                      name="company_city"
                      placeholder="Enter city"
                      type="text"
                      v-model="formData.newCustomer.company_city"
                      v-validate="'required|max:50'"
                    />
                    <div v-if="memberHasError('newCustomer.company_city')" class="invalid-feedback">
                      <div
                        class="error"
                        v-if="!$v.formData.newCustomer.company_city.required"
                      >Please provide a city name.</div>
                    </div>
                    <small v-if="errors.first('company_city')">
                      {{
                        errors.first("company_city")
                      }}
                    </small>
                  </div>

                  <div class="form-group col-md-4 px-md-3 px-1 float-left">
                    <label>State</label>
                    <select
                      class="custom-select w-100"
                      data-vv-as="company state"
                      data-vv-validate-on="blur"
                      name="company_state"
                      v-model="formData.newCustomer.company_state"
                      v-validate="'required'"
                    >
                      <option value>select state</option>
                      <option
                        :value="state.name"
                        v-for="(state, index) in states"
                        :key="'states3' + index"
                      >{{ state.name }}</option>
                    </select>

                    <small v-if="errors.first('company_state')">{{ errors.first("company_state") }}</small>
                  </div>

                  <div class="spaceBetween"></div>

                  <div class="form-group col-md-4 px-md-3 px-1 float-left">
                    <label>Phone Number</label>
                    <input
                      class="form-control"
                      data-vv-as="company phone number"
                      name="company_phone_number"
                      placeholder="Enter city"
                      type="number"
                      v-model="formData.newCustomer.company_telno"
                      v-validate="'required|numeric|max:11|min:11'"
                    />

                    <div
                      v-if="memberHasError('newCustomer.company_telno')"
                      class="invalid-feedback"
                    >
                      <div
                        class="error"
                        v-if="!$v.formData.newCustomer.company_telno.required"
                      >Please provide company's phone number.</div>
                      <div
                        class="error"
                        v-if="!$v.formData.newCustomer.company_telno.minLength"
                      >The minimum phone number is 11digit.</div>
                      <div
                        class="error"
                        v-if="!$v.formData.newCustomer.company_telno.maxLength"
                      >The maximum phone number is 11digit.</div>
                    </div>

                    <small
                      v-if="errors.first('company_phone_number')"
                    >{{ errors.first("company_phone_number") }}</small>
                  </div>

                  <div class="form-group col-md-4 px-md-3 px-1 float-left">
                    <label>Time Available for Visit: From</label>
                    <input
                      class="form-control"
                      data-vv-as="available from"
                      name="available_from"
                      type="time"
                      v-model="formData.newCustomer.cvisit_hour_from"
                      v-validate="'required'"
                    />

                    <small
                      v-if="errors.first('available_from')"
                    >{{ errors.first("available_from") }}</small>
                  </div>

                  <div class="form-group col-md-4 px-md-3 px-1 float-left">
                    <label>To</label>
                    <input
                      class="form-control"
                      data-vv-as="available to"
                      name="available_to"
                      type="time"
                      v-model="formData.newCustomer.cvisit_hour_to"
                      v-validate="'required'"
                    />

                    <small v-if="errors.first('available_to')">
                      {{
                        errors.first("available_to")
                      }}
                    </small>
                  </div>

                  <div class="spaceBetween"></div>

                  <div class="form-group col-md-12 px-md-3 px-1 float-left">
                    <label>Describe Location</label>
                    <textarea
                      class="form-control col-sm-12"
                      placeholder="Describe the Location"
                      rows="1"
                      v-model="formData.newCustomer.cadd_addinfo"
                    ></textarea>
                  </div>
                </div>
                <div v-else></div>
              </transition>
            </div>
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
import { required, minLength, maxLength } from "vuelidate/lib/validators";
import { email } from "vuelidate/lib/validators";
import { numeric } from "vuelidate/lib/validators";
import { FormWizard, TabContent, ValidationHelper } from "mulltistep-checker";
import check from '../../assets/css/svgs/check.vue'
import "../../assets/css/vue-step-wizard.css";
import { Message } from "../../utilities/sms";
import { log } from "../../utilities/log";
import Flash from "../../utilities/flash";
import { get, post } from "../../utilities/api";
import Verification from "../DVA/verification/verification";
import flash from "../../utilities/flash";

//name => $v.name.$model
//age => $v.age.$model
export default {
  components: { Verification, FormWizard, TabContent, check },
  mixins: [ValidationHelper],
  data() {
    return {
      data: {},
      newCustomer: {},
      formData: {
        cc_reg_id: "",
        newCustomer: {
          first_name: "",
          last_name: "",
          middle_name: "",
          telephone: "",
          email: "",
          date_of_birth: "",
          civil_status: "",
          year_together: "",
          gender: "",
          level_of_education: "",
          add_street: "",
          add_houseno: "",
          add_nbstop: "",
          area_address: "",
          city: "",
          state: "",
          add_addinfo_description: "",
          duration_of_residence: "",
          people_in_household: "",
          depend_on_you: "",
          number_of_work: "",
          visit_hour_from: "",
          visit_hour_to: "",
          type_of_home: "",
          no_of_rooms: "",
          nextofkin_first_name: "",
          nextofkin_middle_name: "",
          nextofkin_last_name: "",
          nextofkin_telno: "",
          employment_status: "",
          occupation: "",
          working_individual_Phone_number: "",
          name_of_company_or_business: "",
          current_sal_or_business_income: "",
          post_in_company: "",
          receive_income_means: "",
          payment_period: "",
          years_of_existence_or_work_duration: "",
          days_of_work: "",
          comp_street_name: "",
          comp_house_no: "",
          cadd_nbstop: "",
          comp_area: "",
          company_city: "",
          company_state: "",
          company_telno: "",
          cvisit_hour_from: "",
          cvisit_hour_to: "",
          market_name: "",
          monthly_gains: "",
          bank_account: "",
          cadd_addinfo: ""

        }
      },
      validationRules: [
        {
          newCustomer: {
            first_name: { required },
            last_name: { required, },
            telephone: { required, minLength: minLength(11), maxLength: maxLength(11), },
            email: { required },
            date_of_birth: { required },
            civil_status: { required },
            gender: { required },
            level_of_education: { required },
          }
        },
        {
          newCustomer: {
            add_street: { required },
            add_houseno: { required },
            add_nbstop: { required },
            area_address: { required },
            city: { required },
            state: { required },
          }
        },
        {
          newCustomer: {
            duration_of_residence: { required },
            people_in_household: { required },
            depend_on_you: { required },
            number_of_work: { required },
            visit_hour_from: { required },
            visit_hour_to: { required },
            type_of_home: { required },
            no_of_rooms: { required },
            nextofkin_first_name: { required },
            nextofkin_last_name: { required },
            nextofkin_telno: { required, minLength: minLength(11), maxLength: maxLength(11), },
          }
        },
        {
          newCustomer: {
            employment_status: { required },
            occupation: { required },
            working_individual_Phone_number: { minLength: minLength(11), maxLength: maxLength(11), },
            company_telno: { minLength: minLength(11), maxLength: maxLength(11), }
          }
        },
      ],
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
      registered: false,
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
      identity: 0
    };
  },
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