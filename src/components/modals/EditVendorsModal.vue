<template>
  <div class="">
    <div class="modal-header py-2">
      <div class="p-2 my-2">
        <span class="h4 mx-3">Update Vendor</span>
      </div>
      <a
        aria-label="Close"
        class="close py-1"
        data-dismiss="modal"
        @click="closeModal"
      >
        <span aria-hidden="true" class="modal-close text-danger">
          <i class="fas fa-times close-button"></i>
        </span>
      </a>
    </div>
    <div class="px-4 mx-3 py-2 mt-5">
      <div class="mx-4">
        <small
          v-for="item in err"
          :key="item"
          class="text-danger d-block h6 text-center"
          >{{ item[0] }}</small
        >
      </div>
      <form @submit.prevent="createVendor">
        <div class="form-group d-flex mx-4 my-4">
          <div class="w-100 mx-4">
            <label for="first_name" class="label"> First Name </label>
            <input
              v-model="firstName"
              name="first_name"
              placeholder="First Name"
              v-validate="'required'"
              type="text"
              class="form-control w-100 border-dark"
            />
            <small v-if="errors.first('first_name')">{{
              errors.first("first_name")
            }}</small>
          </div>
          <div class="w-100 mx-4">
            <label for="last_name" class="label"> Last Name </label>
            <input
              v-model="lastName"
              name="last_name"
              v-validate="'required'"
              placeholder="Last Name"
              type="text"
              class="form-control w-100 border-dark"
            />
            <small v-if="errors.first('last_name')">{{
              errors.first("last_name")
            }}</small>
          </div>
        </div>
        <div class="form-group d-flex mx-4 my-4">
          <div class="w-100 mx-4">
            <label for="email" class="label"> Email </label>
            <input
              v-model="email"
              name="email"
              placeholder="Email"
              type="email"
              class="form-control w-100 border-dark"
            />
            <small v-if="errors.first('email')">{{
              errors.first("email")
            }}</small>
          </div>
          <div class="w-100 mx-4">
            <label for="phone" class="label"> Phone </label>
            <input
              v-model="phone"
              name="phone"
              v-validate="'required'"
              placeholder="Phone Number"
              type="text"
              class="form-control w-100 border-dark"
            />
            <small v-if="errors.first('phone')">{{
              errors.first("phone")
            }}</small>
          </div>
        </div>
        <div class="form-group d-flex mx-4 my-4">
          <div class="w-100 mx-4">
            <label for="address" class="label"> Address </label>
            <input
              v-model="address"
              name="address"
              v-validate="'required'"
              placeholder="Address"
              type="text"
              class="form-control w-100 border-dark"
            />
            <small v-if="errors.first('address')">{{
              errors.first("address")
            }}</small>
          </div>
        </div>
        <div class="form-group d-flex mx-4 my-4">
          <div class="w-100 mx-4">
            <label class="label"> Date Of Birth: </label>
            <input
              v-model="dateOfBirth"
              name="dob"
              placeholder="Date of Birth"
              type="date"
              class="form-control border-dark w-100"
              v-validate="'required'"
            />
            <small v-if="errors.first('dob')">{{ errors.first("dob") }}</small>
          </div>
        </div>
        <div class="form-group d-flex mx-4 my-3 px-2">
          <div class="w-100 mx-2">
            <label class="my-2 label d-block">Gender</label>

            <label class="mx-2 pointer">
              <input
                v-model="gender"
                value="male"
                type="radio"
                class="custom-radio mt-3 mx-1"
                name="gender"
                v-validate="'required'"
              />
              Male
            </label>
            <label class="mx-2 pointer">
              <input
                v-model="gender"
                value="female"
                type="radio"
                class="custom-radio mt-3 mx-1"
                name="gender"
                v-validate="'required'"
              />
              Female
            </label>
            <small v-if="errors.first('gender')">{{
              errors.first("gender")
            }}</small>
          </div>
        </div>

        <div class="text-right mt-5 mb-2 py-5 px-3">
          <span
            class="bg-danger border-0 text-white px-5 py-3 mx-3 pointer d-inline-block rounded"
            @click="closeModal"
          >
            Cancel
          </span>

          <span
            class="bg-default border-0 px-5 py-3 mx-3 pointer d-inline-block rounded"
            style="font-size="
            @click="createVendor"
          >
            Submit
          </span>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
  import { patch } from "../../utilities/api";
  import "vue2-datepicker/index.css";
  import { EventBus } from "../../utilities/event-bus";

  export default {
    components: {},
    props: {
      vendor: {
        required: true,
      },
    },
    data() {
      return {
        showError: false,
        apiUrl: `${process.env.VUE_APP_BNPL_URL}/api/update/vendor/${this.vendor.id}`,
        firstName: this.vendor?.full_name?.split(" ")[0],
        lastName: this.vendor?.full_name?.split(" ")[1],
        email: this.vendor?.email,
        phone: this.vendor?.phone_number,
        address: this.vendor?.address,
        dateOfBirth: this.vendor?.date_of_birth,
        gender: this.vendor?.gender,
        err: [],
      };
    },

    methods: {
      closeModal() {
        this.$emit("close");
      },

      createVendor() {
        this.$validator.validateAll().then(async (result) => {
          if (result) {
            try {
              let data = {
                full_name: `${this.firstName} ${this.lastName}`,
                email: this.email,
                phone_number: this.phone,
                address: this.address,
                gender: this.gender,
                date_of_birth: this.dateOfBirth,
              };
              this.$LIPS(true);

              await patch(this.apiUrl, data);

              this.$swal({
                icon: "success",
                title: "Vendor updated Successfully",
              });
              EventBus.$emit("fetchVendors");

              this.closeModal();
            } catch (e) {
              this.err = e.response.data.errors;
            } finally {
              this.$LIPS(false);
            }
          }
        });
      },
    },
  };
</script>

<style lang="scss" scoped>
  input::placeholder {
    color: darkslategrey;
  }
  .close-button {
    font-size: 24px;
  }
</style>
