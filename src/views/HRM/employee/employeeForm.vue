<template>
    <transition name="fade">
        <div class="pt-md-3 pt-2" id="employeeRegister">
            <div class="card">
                <ul class="nav nav-tabs justify-content-center bg-default">
                    <h6>{{ mode }} Staff</h6>
                </ul>
                <div class="card-body pl-4 pr-4">
                    <form @submit.prevent="onSave" v-if="show">
                        <div class="clearfix">
                            <h5>
                                Employee Personal Details
                                <span class="float-right" v-if="mode === 'edit'">
                                    <a href="javascript:" class="text-link mr-5 float-left" @click="transfer = !transfer">
                                        click here to activate/deactivate transfer!
                                    </a>
                                    {{ `Transfer ${transfer ? "ON" : "OFF"}` }}
                                </span>
                            </h5>

                            <div class="form-group col-md-6 col-12 float-left px-0 px-md-3">
                                <label>Full Name</label>
                                <input
                                    class="form-control"
                                    name="name"
                                    placeholder="employee full name"
                                    type="text"
                                    v-model="form.full_name"
                                    v-validate="'required|max:100'"
                                />
                                <small v-if="errors.first('name')">{{ errors.first("name") }}</small>
                            </div>

                            <div class="form-group col-md-6 col-12 float-left px-0 px-md-3">
                                <label>Phone Number</label>
                                <input
                                    :class="{ 'is-invalid': error.phone_number }"
                                    class="form-control"
                                    data-vv-as="phone number"
                                    name="phone_number"
                                    placeholder="081xxxxxxxx"
                                    type="tel"
                                    v-model="form.phone_number"
                                    v-validate="'required|numeric|max:11|min:11'"
                                />
                                <small v-if="errors.first('phone_number')">
                                    {{ errors.first("phone_number") }}
                                </small>
                                <small v-if="error.phone_number">
                                    {{ error.phone_number[0] }}
                                </small>
                            </div>

                            <div class="spaceBetween mb-md-2 mb-0"></div>

                            <div class="form-group col-md-6 col-12 float-left px-0 px-md-3">
                                <label>Marital Status</label>
                                <select
                                    class="custom-select w-100"
                                    data-vv-validate-on="blur"
                                    name="status"
                                    v-model="form.status"
                                    v-validate="'required'"
                                >
                                    <option selected value="">select status</option>
                                    <option :value="status" v-for="status in statuses" :key="status">
                                        {{ status | capitalize }}
                                    </option>
                                </select>
                                <small v-if="errors.first('status')">
                                    {{ errors.first("status") }}
                                </small>
                            </div>

                            <div class="form-group col-md-6 col-12 float-left px-0 px-md-3">
                                <label>Nationality</label>
                                <select
                                    class="custom-select w-100"
                                    data-vv-validate-on="blur"
                                    name="nationality"
                                    v-model="form.nationality"
                                    v-validate="'required'"
                                >
                                    <option selected value="">select nationality</option>
                                    <option :value="country" v-for="country in countries" :key="country">
                                        {{ country | capitalize }}
                                    </option>
                                </select>
                                <small v-if="errors.first('nationality')">
                                    {{ errors.first("nationality") }}
                                </small>
                            </div>

                            <div class="spaceBetween mb-md-2 mb-0"></div>

                            <div class="form-group col-md-6 col-12 float-left px-0 px-md-3">
                                <label>Date of Birth</label>
                                <input
                                    class="form-control"
                                    data-vv-as="date of birth"
                                    name="date_of_birth"
                                    type="date"
                                    v-model="form.date_of_birth"
                                    v-validate="'required'"
                                />
                                <small v-if="errors.first('date_of_birth')">{{ errors.first("date_of_birth") }}</small>
                                <small v-if="error.date_of_birth">{{ error.date_of_birth[0] }}</small>
                            </div>

                            <div class="form-group col-md-6 col-12 float-left px-0 px-md-3">
                                <label>Email</label>
                                <input
                                    :class="{ 'is-invalid': error.email }"
                                    class="form-control"
                                    name="email"
                                    placeholder="name@example.com"
                                    type="email"
                                    v-model="form.email"
                                    v-validate="'required|email|min:1'"
                                />
                                <small v-if="errors.first('email')">
                                    {{ errors.first("email") }}
                                </small>
                                <small v-if="error.email">
                                    {{ error.email[0] }}
                                </small>
                            </div>

                            <div class="spaceBetween mb-md-2 mb-0"></div>

                            <div class="form-group col-md-6 col-12 float-left px-0 px-md-3">
                                <label>Role in the company</label>
                                <select
                                    class="custom-select w-100"
                                    data-vv-name="role"
                                    data-vv-validate-on="blur"
                                    name="role"
                                    v-model="form.role_id"
                                    v-validate="'required'"
                                    :disabled="mode === 'edit' ? !transfer : false"
                                >
                                    <option selected value="">select role</option>
                                    <option :value="id" v-for="{ name, id } in roles" :key="name">
                                        {{ name | capitalize }}
                                    </option>
                                </select>
                                <small v-if="errors.first('role')">
                                    {{ errors.first("role") }}
                                </small>
                            </div>

                            <div class="form-group col-md-6 col-12 float-left px-0 px-md-3">
                                <label>Staff Category</label>
                                <select
                                    class="custom-select w-100"
                                    data-vv-name="category"
                                    data-vv-validate-on="blur"
                                    name="qualification"
                                    v-model="form.category"
                                    v-validate="'required'"
                                    :disabled="mode === 'edit' ? !transfer : false"
                                >
                                    <option selected value="">select category</option>
                                    <option :value="name" v-for="{ name } in categories" :key="name">
                                        {{ name | capitalize }}
                                    </option>
                                </select>
                                <small v-if="errors.has('category')">
                                    {{ errors.first("category") }}
                                </small>
                            </div>

                            <div class="spaceBetween mb-md-2 mb-0"></div>

                            <div class="form-group col-md-6 col-12 float-left px-0 px-md-3">
                                <label>Operations Branch</label>
                                <select
                                    class="custom-select w-100"
                                    data-vv-name="branch"
                                    data-vv-validate-on="blur"
                                    name="branch"
                                    v-model="form.branch_id"
                                    v-validate="'required'"
                                >
                                    <option selected value="">select branch</option>
                                    <option :value="id" v-for="{ name, id } in branches" :key="id">
                                        {{ name | capitalize }}
                                    </option>
                                </select>
                                <small v-if="errors.has('branch')">
                                    {{ errors.first("branch") }}
                                </small>
                            </div>

                            <div class="form-group col-md-6 col-12 float-left px-0 px-md-3">
                                <label>Date of Appointment</label>
                                <input
                                    class="form-control"
                                    data-vv-as="date of appointment"
                                    name="date_of_appointment"
                                    type="date"
                                    v-model="form.date_of_appointment"
                                    v-validate="'required'"
                                />
                                <small v-if="errors.first('date_of_appointment')">
                                    {{ errors.first("date_of_appointment") }}
                                </small>
                            </div>

                            <div class="spaceBetween mb-md-2 mb-0"></div>

                            <div class="form-group col-md-6 col-12 float-left px-0 px-md-3" v-if="mode === 'edit'">
                                <label>Date of Exit</label>
                                <input class="form-control" type="date" v-model="form.date_of_exit" />
                            </div>

                            <div class="form-group col-md-6 col-12 float-left px-0 px-md-3">
                                <label>Highest Qualification</label>
                                <select
                                    class="custom-select w-100"
                                    data-vv-name="qualification"
                                    data-vv-validate-on="blur"
                                    name="qualification"
                                    v-model="form.highest_qualification"
                                    v-validate="'required'"
                                >
                                    <option selected value="">select qualification</option>
                                    <option :value="qualification" v-for="qualification in qualifications" :key="qualification">
                                        {{ qualification | capitalize }}
                                    </option>
                                </select>
                                <small v-if="errors.has('qualification')">
                                    {{ errors.first("qualification") }}
                                </small>
                            </div>

                            <div class="spaceBetween mb-md-2 mb-0" v-if="mode === 'edit'"></div>

                            <div class="form-group col-md-6 col-12 float-left px-0 px-md-3">
                                <label class="w-100 float-left pl-1">Gender</label>
                                <div class="radio p-0 col-md-6 col-6 float-left" v-for="sex in gender" :key="sex">
                                    <input :id="sex" :value="sex" name="gender" type="radio" v-model="form.gender" v-validate="'required'" />
                                    <label :for="sex">
                                        {{ sex }}
                                    </label>
                                </div>
                                <small v-if="errors.first('gender')">
                                    {{ errors.first("gender") }}
                                </small>
                            </div>

                            <div class="spaceBetween mb-md-2 mb-0"></div>

                            <div class="form-group col-md-6 col-12 float-left px-0 px-md-3">
                                <label>Describe Location</label>
                                <textarea
                                    class="form-control w-100"
                                    name="address"
                                    placeholder="address"
                                    rows="1"
                                    v-model="form.address"
                                    v-validate="'required|max:255'"
                                ></textarea>
                                <small v-if="errors.first('address')">
                                    {{ errors.first("address") }}
                                </small>
                            </div>
                            <div class="form-group col-md-6 col-12 float-left px-0 px-md-3">
                                <label>Tenants</label>
                                <select
                                    class="custom-select w-100"
                                    data-vv-name="tenant"
                                    data-vv-validate-on="blur"
                                    name="tenant"
                                    v-model="form.tenant_id"
                                    v-validate="'required'"
                                >
                                    <option selected value="select tenant">select tenant</option>
                                    <option :value="id" v-for="{ name, id } in tenants" :key="id">
                                        {{ name | capitalize }}
                                    </option>
                                </select>
                                <small v-if="errors.has('tenant')">
                                    {{ errors.first("tenant") }}
                                </small>
                            </div>

                            <div class="spaceAfter"></div>
                            <h5>Referee Details</h5>

                            <div class="form-group col-md-6 col-12 float-left px-0 px-md-3">
                                <label>Referee 1 Full Name</label>
                                <input
                                    class="form-control"
                                    data-vv-as="referee 1 full name"
                                    name="referee_1"
                                    placeholder="enter full name here"
                                    type="text"
                                    v-model="form.referee_1"
                                    v-validate="'required|max:50'"
                                />
                                <small v-if="errors.first('referee_1')">
                                    {{ errors.first("referee_1") }}
                                </small>
                            </div>

                            <div class="form-group col-md-6 col-12 float-left px-0 px-md-3">
                                <label>Referee 1 Phone Number</label>
                                <input
                                    class="form-control"
                                    data-vv-as="referee 1 phone number"
                                    name="referee_1_phone_no"
                                    placeholder="081xxxxxxxx"
                                    type="tel"
                                    v-model="form.referee_1_phone_no"
                                    v-validate="'required|numeric|max:11|min:11'"
                                />
                                <small v-if="errors.first('referee_1_phone_no')">
                                    {{ errors.first("referee_1_phone_no") }}
                                </small>
                            </div>

                            <div class="spaceBetween mb-md-2 mb-0"></div>

                            <div class="form-group col-md-6 col-12 float-left px-0 px-md-3">
                                <label>Referee 2 Full Name</label>
                                <input
                                    class="form-control"
                                    data-vv-as="referee 2 full name"
                                    name="referee_2"
                                    placeholder="enter full name here"
                                    type="text"
                                    v-model="form.referee_2"
                                    v-validate="'required|max:50'"
                                />
                                <small v-if="errors.first('referee_2')">
                                    {{ errors.first("referee_2") }}
                                </small>
                            </div>

                            <div class="form-group col-md-6 col-12 float-left px-0 px-md-3">
                                <label>Referee 2 Phone Number</label>
                                <input
                                    class="form-control"
                                    data-vv-as="referee 2 phone number"
                                    name="referee_2_phone_no"
                                    placeholder="081xxxxxxxx"
                                    type="tel"
                                    v-model="form.referee_2_phone_no"
                                    v-validate="'required|numeric|max:11|min:11'"
                                />
                                <small v-if="errors.first('referee_2_phone_no')">
                                    {{ errors.first("referee_2_phone_no") }}
                                </small>
                            </div>

                            <div class="spaceAfter"></div>

                            <h5>Next of Kin Details</h5>

                            <div class="form-group col-md-6 col-12 float-left px-0 px-md-3">
                                <label>Next of Kin Full Name</label>
                                <input
                                    class="form-control"
                                    data-vv-as="next of kin name"
                                    name="next_of_kin_name"
                                    placeholder="enter full name here"
                                    type="text"
                                    v-model="form.next_of_kin_name"
                                    v-validate="'required|max:50'"
                                />
                                <small v-if="errors.first('next_of_kin_name')">
                                    {{ errors.first("next_of_kin_name") }}
                                </small>
                            </div>

                            <div class="form-group col-md-6 col-12 float-left px-0 px-md-3">
                                <label>Next of Kin Phone Number</label>
                                <input
                                    class="form-control"
                                    data-vv-as="next of kin phone number"
                                    name="next_of_kin_phone_no"
                                    placeholder="081xxxxxxxx"
                                    type="tel"
                                    v-model="form.next_of_kin_phone_no"
                                    v-validate="'required|numeric|max:11|min:11'"
                                />
                                <small v-if="errors.first('next_of_kin_phone_no')">
                                    {{ errors.first("next_of_kin_phone_no") }}
                                </small>
                            </div>

                            <div class="spaceBetween mb-md-2 mb-0"></div>

                            <div class="spaceAfter"></div>

                            <h5>First Guarantor's Details</h5>

                            <div class="form-group col-md-6 col-12 float-left px-0 px-md-3">
                                <label>Guarantor's Full Name</label>
                                <input
                                    class="form-control"
                                    data-vv-as="guarantor name"
                                    name="guarantor_name"
                                    placeholder="enter full name here"
                                    type="text"
                                    v-model="form.guarantor_name"
                                    v-validate="'required|max:50'"
                                />
                                <small v-if="errors.first('guarantor_name')">
                                    {{ errors.first("guarantor_name") }}
                                </small>
                            </div>

                            <div class="form-group col-md-6 col-12 float-left px-0 px-md-3">
                                <label>Guarantor's Number</label>
                                <input
                                    :class="{ 'is-invalid': error.guarantor_phone_no }"
                                    class="form-control"
                                    data-vv-as="guarantor number"
                                    name="guarantor_phone_no"
                                    placeholder="081xxxxxxxx"
                                    type="tel"
                                    v-model="form.guarantor_phone_no"
                                    v-validate="'required|numeric|max:11|min:11'"
                                />
                                <small v-if="errors.first('guarantor_phone_no')">
                                    {{ errors.first("guarantor_phone_no") }}
                                </small>
                                <small v-if="error.guarantor_phone_no">
                                    {{ error.guarantor_phone_no[0] }}
                                </small>
                            </div>

                            <div class="spaceBetween mb-md-2 mb-0"></div>

                            <div class="form-group col-md-6 col-12 float-left px-0 px-md-3">
                                <label>Guarantor's relationship</label>
                                <input
                                    class="form-control"
                                    data-vv-as="guarantor relationship"
                                    name="guarantor_relationship"
                                    placeholder="enter guarantor relationship here"
                                    type="text"
                                    v-model="form.guarantor_relationship"
                                    v-validate="'required|max:50'"
                                />
                                <small v-if="errors.first('guarantor_relationship')">
                                    {{ errors.first("guarantor_relationship") }}
                                </small>
                            </div>

                            <div class="form-group col-md-6 col-12 float-left px-0 px-md-3">
                                <label>Guarantor's address</label>
                                <textarea
                                    class="form-control w-100"
                                    data-vv-as="guarantor address"
                                    name="guarantor_address"
                                    placeholder="guarantor address"
                                    rows="1"
                                    v-model="form.guarantor_address"
                                    v-validate="'required|max:255'"
                                ></textarea>
                                <small v-if="errors.first('guarantor_address')">
                                    {{ errors.first("guarantor_address") }}
                                </small>
                            </div>

                            <div class="spaceBetween mb-md-2 mb-0"></div>

                            <h5>Second Guarantor's Details</h5>

                            <div class="form-group col-md-6 col-12 float-left px-0 px-md-3">
                                <label>Guarantor's Full Name</label>
                                <input
                                    class="form-control"
                                    data-vv-as="guarantor name"
                                    name="guarantor_name_2"
                                    placeholder="enter full name here"
                                    type="text"
                                    v-model="form.guarantor_name_2"
                                    v-validate="'required|max:50'"
                                />
                                <small v-if="errors.first('guarantor_name_2')">
                                    {{ errors.first("guarantor_name_2") }}
                                </small>
                            </div>

                            <div class="form-group col-md-6 col-12 float-left px-0 px-md-3">
                                <label>Guarantor's Number</label>
                                <input
                                    :class="{ 'is-invalid': error.guarantor_phone_no_2 }"
                                    class="form-control"
                                    data-vv-as="guarantor number"
                                    name="guarantor_phone_no_2"
                                    placeholder="081xxxxxxxx"
                                    type="tel"
                                    v-model="form.guarantor_phone_no_2"
                                    v-validate="'required|numeric|max:11|min:11'"
                                />
                                <small v-if="errors.first('guarantor_phone_no_2')">
                                    {{ errors.first("guarantor_phone_no_2") }}
                                </small>
                                <small v-if="error.guarantor_phone_no_2">
                                    {{ error.guarantor_phone_no_2[0] }}
                                </small>
                            </div>

                            <div class="spaceBetween mb-md-2 mb-0"></div>

                            <div class="form-group col-md-6 col-12 float-left px-0 px-md-3">
                                <label>Guarantor's relationship</label>
                                <input
                                    class="form-control"
                                    data-vv-as="guarantor relationship"
                                    name="guarantor_relationship_2"
                                    placeholder="enter guarantor relationship here"
                                    type="text"
                                    v-model="form.guarantor_relationship_2"
                                    v-validate="'required|max:50'"
                                />
                                <small v-if="errors.first('guarantor_relationship_2')">
                                    {{ errors.first("guarantor_relationship_2") }}
                                </small>
                            </div>

                            <div class="form-group col-md-6 col-12 float-left px-0 px-md-3">
                                <label>Guarantor's address</label>
                                <textarea
                                    class="form-control w-100"
                                    data-vv-as="guarantor address"
                                    name="guarantor_address_2"
                                    placeholder="guarantor address"
                                    rows="1"
                                    v-model="form.guarantor_address_2"
                                    v-validate="'required|max:255'"
                                ></textarea>
                                <small v-if="errors.first('guarantor_address_2')">
                                    {{ errors.first("guarantor_address_2") }}
                                </small>
                            </div>

                            <div class="spaceBetween mb-md-2 mb-0"></div>

                            <h5>Upload Documents</h5>

                            <div class="form-group col-md-6 col-12 float-left px-0 px-md-3">
                                <div>
                                    <div v-if="mode === 'edit' && $data.form['cv_url']">
                                        <a @click="viewCV(form.cv_url)" class="view_cv mr-4">{{ form.cv_url.substring(3) }}</a>
                                        ||
                                        <a @click="form.cv_url = ''" class="view_cv ml-4">Edit CV</a>
                                    </div>
                                    <div v-else>
                                        <label class="cv_label mr-4">CV</label>
                                        <image-upload :usage="`cv`" class="cv_upload" v-model="imgForm.cv" />
                                    </div>
                                </div>
                            </div>
                            <hr class="style-two" />
                        </div>

                        <div class="col-sm-12 ml-auto mr-auto mt-md-2 mt-0 px-md-3 px-1 mb-3">
                            <div class="clearfix d-flex justify-content-end">
                                <button @click="done" class="mx-3 btn btn-secondary" type="button" v-if="mode === 'edit'">Cancel</button>
                                <button :disabled="$isProcessing" class="mx-3 btn bg-default" type="submit">
                                    {{ mode | capitalize }} Employee <i class="far fa-paper-plane ml-1"></i>
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </transition>
</template>
<script>
import { Message } from "../../../utilities/sms";
import { log } from "../../../utilities/log";
import Flash from "../../../utilities/flash";
import { byMethod, get, post } from "../../../utilities/api";
import { toMulipartedForm } from "../../../utilities/form";
import ImageUpload from "../../../components/ImageUpload";

function initialize(to) {
    let urls = { create: `user/create`, edit: `user/${to.params.id}/edit` };
    return urls[to.meta.mode];
}

export default {
    components: { ImageUpload },

    data() {
        return {
            imgForm: {
                cv: null,
            },
            mode: null,
            show: false,
            store: "/api/user",
            method: "POST",
            form: {},
            error: {},
            roles: {},
            branches: {},
            countries: ["nigeria"],
            gender: ["male", "female"],
            categories: {},
            tenants: [],
            statuses: ["married", "single", "divorced", "complicated"],
            qualifications: ["NCE", "HND", "OND", "bachelors", "masters", "doctorate"],
            transfer: false,
        };
    },

    beforeRouteEnter(to, from, next) {
        get(`/api/${initialize(to)}`).then(({ data }) => next((vm) => vm.prepareForm(data)));
    },

    beforeRouteUpdate(to, from, next) {
        this.show = false;
        get(initialize(to)).then(({ data }) => {
            this.prepareForm(data);
            next();
        });
    },

    methods: {
        async getTenants() {
            get("/api/tenants").then((res) => {
                this.tenants = res.data.data.tenants;
            });
        },
        done() {
            this.$router.push("/hrm/employee");
        },

        async prepareForm(data) {
            await this.getTenants();
            await this.$prepareStates();
            this.mode = this.$route.meta.mode;
            this.error = {};
            this.errors.clear();
            this.form = data.form;
            this.form.tenant_id = 1;
            this.roles = data.roles;
            this.branches = data.branches;
            this.categories = data.categories;
            if (this.$route.meta.mode === "edit") {
                this.store = `/api/user/${this.$route.params.id}`;
                this.method = "PUT";
            }
            this.show = true;
        },

        onSave() {
            this.$validator.validateAll().then((result) => {
                if (result) {
                    if (this.$network()) {
                        this.$LIPS(true);
                        this.error = {};

                        this.form.transfer = this.transfer;
                        byMethod(this.method, this.store, this.form)
                            .then(({ data }) => {
                                if (this.imgForm.cv) this.onSaveCV();
                                let { staff_id, password, message, success, transfer } = data,
                                    mode = this.mode;
                                if (success || transfer) {
                                    let text = success
                                        ? `Welcome to Altara credit. Please secure your login
                                        details. Staff ID: ${staff_id}, password: ${password}`
                                        : `Transfer Successful, your new staff ID is ${staff_id} `;
                                    new Message(text, this.form.phone_number).send();
                                }
                                log(`Staff ${mode}`, String(staff_id));
                                Flash.setSuccess(
                                    mode === "edit"
                                        ? message
                                        : `Staff ${mode}d with ID ${staff_id}.
                                        Login details has been sent via SMS to the employee!`,
                                    20000
                                );
                                this.done();
                            })
                            .catch((e) => {
                                e = e.response;
                                if (e.status === 422) {
                                    this.error = e.data.errors ? e.data.errors : e.data;
                                    this.$networkErr("unique");
                                }
                            })
                            .finally(() => {
                                this.$scrollToTop();
                                this.$LIPS(false);
                            });
                    } else this.$networkErr();
                } else this.$networkErr("form");
            });
        },

        onSaveCV() {
            const cv = toMulipartedForm(this.imgForm, "edit");
            post(`/api/user/${this.$route.params.id}/cv`, cv).then(({ data }) => {
                if (data.cv_saved) Flash.setSuccess("CV Successfully updated!");
            });
        },

        viewCV(path) {
            window.open(`https://s3.eu-west-2.amazonaws.com/altara-one/${path}`, "_blank");
        },
    },
};
</script>
