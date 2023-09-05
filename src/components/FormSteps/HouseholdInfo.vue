<template>
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
        :class="
          memberHasError('newCustomer.duration_of_residence')
            ? 'is-invalid'
            : ''
        "
        v-validate="'required|numeric|max:2'"
      />
      <div
        v-if="memberHasError('newCustomer.duration_of_residence')"
        class="invalid-feedback"
      >
        <div
          class="error"
          v-if="!$v.formData.newCustomer.duration_of_residence.required"
        >
          Please provide duration of residence.
        </div>
      </div>
      <small v-if="errors.first('duration_of_residence')">{{
        errors.first("duration_of_residence")
      }}</small>
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
        :class="
          memberHasError('newCustomer.people_in_household') ? 'is-invalid' : ''
        "
        v-validate="'required|numeric|max:2'"
      />
      <div
        v-if="memberHasError('newCustomer.people_in_household')"
        class="invalid-feedback"
      >
        <div
          class="error"
          v-if="!$v.formData.newCustomer.people_in_household.required"
        >
          Please provide people in household.
        </div>
      </div>
      <small v-if="errors.first('number_in_household')">{{
        errors.first("number_in_household")
      }}</small>
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
      <div
        v-if="memberHasError('newCustomer.depend_on_you')"
        class="invalid-feedback"
      >
        <div
          class="error"
          v-if="!$v.formData.newCustomer.depend_on_you.required"
        >
          Please provide how many people depend on you.
        </div>
      </div>
      <small v-if="errors.first('no_depend_on_you')">
        {{ errors.first("no_depend_on_you") }}
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
        :class="
          memberHasError('newCustomer.number_of_work') ? 'is-invalid' : ''
        "
        v-validate="'required|numeric|max:2'"
      />
      <div
        v-if="memberHasError('newCustomer.number_of_work')"
        class="invalid-feedback"
      >
        <div
          class="error"
          v-if="!$v.formData.newCustomer.number_of_work.required"
        >
          Please provide how many work.
        </div>
      </div>
      <small v-if="errors.first('how_many_work')">
        {{ errors.first("how_many_work") }}
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
        :class="
          memberHasError('newCustomer.visit_hour_from') ? 'is-invalid' : ''
        "
        v-validate="'required'"
      />
      <div
        v-if="memberHasError('newCustomer.visit_hour_from')"
        class="invalid-feedback"
      >
        <div
          class="error"
          v-if="!$v.formData.newCustomer.visit_hour_from.required"
        >
          Please provide time of visit.
        </div>
      </div>
      <small v-if="errors.first('time_from')">
        {{ errors.first("time_from") }}
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
      <div
        v-if="memberHasError('newCustomer.visit_hour_to')"
        class="invalid-feedback"
      >
        <div
          class="error"
          v-if="!$v.formData.newCustomer.visit_hour_to.required"
        >
          Please provide time of visit.
        </div>
      </div>
      <small v-if="errors.first('time_to')">
        {{ errors.first("time_to") }}
      </small>
    </div>
    <div class="spaceAfter"></div>
    <div class="form-group col-md-6 px-md-3 px-1 float-left">
      <label class="w-100 float-left pl-1">Type of Home</label>
      <div class="radio pl-1 float-left">
        <input
          class="form-control"
          id="family"
          value="family"
          name="typeOfHome"
          type="radio"
          v-model="formData.newCustomer.type_of_home"
          :class="
            memberHasError('newCustomer.type_of_home') ? 'is-invalid' : ''
          "
          v-validate="'required'"
        />
        <label for="family">family</label>
        <div
          v-if="memberHasError('newCustomer.type_of_home')"
          class="invalid-feedback"
        >
          <div
            class="error"
            v-if="!$v.formData.newCustomer.type_of_home.required"
          >
            Type of home is required.
          </div>
        </div>
      </div>
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
          :class="
            memberHasError('newCustomer.type_of_home') ? 'is-invalid' : ''
          "
          v-validate="'required'"
        />
        <label :for="typeOfHome">{{ typeOfHome }}</label>
      </div>
    </div>

    <div class="form-group col-md-6 px-md-3 px-1 float-left">
      <label class="w-100 float-left pl-1">Number of Rooms</label>
      <div class="radio pl-1 float-left">
        <input
          class="form-control"
          id="one room"
          value="one room"
          name="noOfRoom"
          type="radio"
          v-model="formData.newCustomer.no_of_rooms"
          :class="memberHasError('newCustomer.no_of_rooms') ? 'is-invalid' : ''"
          v-validate="'required'"
        />
        <label for="one room">one room</label>
        <div
          v-if="memberHasError('newCustomer.no_of_rooms')"
          class="invalid-feedback"
        >
          <div
            class="error"
            v-if="!$v.formData.newCustomer.no_of_rooms.required"
          >
            No of rooms is required.
          </div>
        </div>
      </div>
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
        :class="
          memberHasError('newCustomer.nextofkin_first_name') ? 'is-invalid' : ''
        "
        v-validate="'required|max:25'"
      />
      <div
        v-if="memberHasError('newCustomer.last_name')"
        class="invalid-feedback"
      >
        <div class="error" v-if="!$v.formData.newCustomer.last_name.minLength">
          The minimum phone number is 11 digits.
        </div>
      </div>
      <div
        v-if="memberHasError('newCustomer.nextofkin_first_name')"
        class="invalid-feedback"
      >
        <div
          class="error"
          v-if="!$v.formData.newCustomer.nextofkin_first_name.required"
        >
          Please provide a First Name.
        </div>
      </div>
      <small v-if="errors.first('NOK_first_name')">
        {{ errors.first("NOK_first_name") }}
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
        :class="
          memberHasError('newCustomer.nextofkin_last_name') ? 'is-invalid' : ''
        "
        v-validate="'required|max:25'"
      />
      <div
        v-if="memberHasError('newCustomer.nextofkin_last_name')"
        class="invalid-feedback"
      >
        <div
          class="error"
          v-if="!$v.formData.newCustomer.nextofkin_last_name.required"
        >
          Please provide a Last Name.
        </div>
      </div>
      <small v-if="errors.first('NOK_last_name')">
        {{ errors.first("NOK_last_name") }}
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
        :class="
          memberHasError('newCustomer.nextofkin_telno') ? 'is-invalid' : ''
        "
        v-validate="'required|numeric|max:11|min:11'"
      />
      <div
        v-if="memberHasError('newCustomer.nextofkin_telno')"
        class="invalid-feedback"
      >
        <div
          class="error"
          v-if="!$v.formData.newCustomer.nextofkin_telno.required"
        >
          Please provide next of kin phone number.
        </div>
        <div
          class="error"
          v-if="!$v.formData.newCustomer.nextofkin_telno.minLength"
        >
          The minimum phone number is 11digit.
        </div>
        <div
          class="error"
          v-if="!$v.formData.newCustomer.nextofkin_telno.maxLength"
        >
          The maximum phone number is 11digit.
        </div>
      </div>

      <small v-if="errors.first('NOK_phone_number')">
        {{ errors.first("NOK_phone_number") }}
      </small>
    </div>
    <div class="spaceAfter"></div>
  </div>
</template>
<script>
  import { validationMixin } from "vuelidate";
  export default {
    mixins: [validationMixin],
    props: {
      formData: {
        type: Object,
        required: true,
      },
      getCustomerDetails: {
        type: Function,
      },
      memberHasError: {
        type: Function,
      },
      error: {
        required: true,
      },
      typesOfHome: {
        required: true,
      },
      noOfRooms: {
        required: true,
      },
      $v: {},
    },
  };
</script>
