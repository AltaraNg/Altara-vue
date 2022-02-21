<template>
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
</template>
<script>
import { validationMixin } from 'vuelidate'
export default{
    mixins: [validationMixin],
     props:{
        formData:{
            type: Object,
            required: true
        },
        getCustomerDetails:{
            type: Function
        },
        memberHasError:{
            type:Function
        },
        error:{
            required: true
        },
         occupations:{
            required: true
        },
         occName:{
            required: true
        },
         isOther:{
            required: true
        },
        checkOccupation:{
            required:true
        },
        isClick:{
            required: true
        },
        setOccupation:{
            required: true,
        },
        durations:{
            required: true,
        },
        newCustomer:{
            required: true,
        },
         states:{
            required: true,
        },
         weekdays:{
            required: true,
        },
        $v:{

        },
        receiveIncomeMeans:{
            required: true,
        },
        paymentPeriod:{
            required: true,
        }
       


        
    }
}
</script>