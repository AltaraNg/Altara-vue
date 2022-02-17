<template>
<div>
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

        },
        states:{
            required: true
        },
        $v:{

        }
    }
}
</script>