<template>
    <transition name="fade" key="index">
        <div v-if="loading">
            <p>It is processing</p>
        </div>
        <div v-else>
            <div style="display: flex">
                <custom-header
                    :title="'Upload'"
                    @click.native="selectType('upload')"
                    :style="!states.upload ? 'opacity: 0.2; cursor:pointer;' : 'cursor:pointer;'"
                />
                <custom-header
                    :title="'View Uploaded'"
                    @click.native="selectType('viewUploaded')"
                    :style="!states.viewUploaded ? 'opacity: 0.2; cursor:pointer;' : 'cursor:pointer; '"
                    style="margin-left: -10px"
                />
                <custom-header
                    :title="'View Customers'"
                    @click.native="selectType('viewCustomers')"
                    :style="!states.viewCustomers ? 'opacity: 0.2; cursor:pointer;' : 'cursor:pointer; '"
                    style="margin-left: -10px"
                />
            </div>

            <div class="mt-1 attendance-body mx-5" v-if="states.upload">
                <form @submit.prevent="onSave">
                    <div class="my-4 clearfix p-5 row bg-white shadow-sm card-radius">
                        <div class="form-group col-md-6 float-left px-0 px-md-3">
                            <label>Client name</label><br />
                            <select
                                name="product_type"
                                id="product_type"
                                v-model="form.tenant_id"
                                class="custom-select w-100"
                                :disabled="isValidated"
                                required
                            >
                                <option value="all" selected="selected">--select--</option>
                                <option :value="tenant.id" v-for="tenant of tenants" :key="tenant.id">{{ tenant.name }}</option>
                            </select>
                            <!-- <small v-if="error.name">{{ error.name[0] }}</small> -->
                        </div>

                        <div class="form-group col-md-6 float-left px-0 px-md-3">
                            <label>Upload Doc</label><br />
                            <input type="file" @change="getFile" class="" :disabled="isValidated" />
                            <div class="pointer text-link">
                                <a
                                    href="https://docs.google.com/spreadsheets/d/1GkMgXrnJhBhQQRcIm7NLkg0GfVBf9FwDUveiCncUSLU/edit?usp=sharing"
                                    target="_blank"
                                    >sample document</a
                                >
                            </div>
                            <!-- <small v-if="error.name">{{ error.name[0] }}</small> -->
                        </div>
                        <!-- <div class="form-group col-md-6 col-12 float-left px-0 px-md-3">
                            <label>Retail Price</label>
                            <input class="form-control" name="price" placeholder="retail price" type="number"
                                v-model="retailPrice" v-validate="'required|max:50'">
                            <small v-if="errors.first('price')">{{ errors.first('price') }}</small>

                        </div> -->
                        <!-- <div class="form-group col-md-6 col-12 float-left px-0 px-md-3">
                            <label>Product feature</label>
                            <input class="form-control" name="feature" placeholder="product feature" type="text"
                                :disabled="mode === 'edit'" v-model="form.feature" v-validate="'required|max:50'">
                            <small v-if="errors.first('feature')">{{ errors.first('feature') }}</small>
                        </div> -->
                        <div class="spaceBetween mb-md-2 mb-0"></div>
                        <!-- <div class="form-group col-md-6 col-12 ">
                            <label for="brand" class="form-control-label">Brand </label>
                            <br>
                            <select name="brand" id="brand" v-model="form.brand_id" class="custom-select"
                                data-vv-as="brand id" :disabled="mode === 'edit'">
                                <option disabled value="">--select--</option>
                                <option :value="brand.id" v-for="brand of brands" :key="brand.id">{{ brand.name }}</option>
                            </select>
                        </div>
                        <div class="form-group col-md-6 col-12 float-left px-0 px-md-3">
                            <label class="form-control-label" for="category">Category</label>
                            <br>
                            <select name="category" id="category" v-model="form.category_id" class="custom-select"
                                data-vv-as="category id" :disabled="mode === 'edit'">
                                <option disabled value="">--select--</option>
                                <option :value="category.id" v-for="category of categories" :key="category.id">{{ category.name }}</option>
                            </select>
                        </div> -->
                        <div class="spaceBetween mb-md-2 mb-0"></div>

                        <!-- <div class="form-group col-md-6 col-12 ">
                            <label for="product_type" class="form-control-label">Product Type </label>
                            <br>
                            <select name="product_type" id="product_type" v-model="form.product_type_id"
                                class="custom-select" :disabled="mode === 'edit'">
                                <option value="all" selected="selected">--select--</option>
                                <option :value="type.id" v-for="type of product_types" :key="type.id">{{ type.name }}
                                </option>
                            </select>
                        </div> -->
                        <div v-if="errorMessages.length > 0">
                            <h5 class="text-danger">Something has gone wrong</h5>
                            <ul>
                                <li v-for="(msg, index) in errorMessages" :key="index" class="text-danger">
                                    {{ msg }}
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div class="mb-5 px-0 row align-items-center">
                        <div class="clearfix d-flex justify-content-end w-100">
                            <router-link to="/log/products" class="mx-5 text-link mt-4 pt-2"> Cancel </router-link>
                            <button :disabled="$isProcessing" class="btn bg-default" type="submit" @click="submit">
                                {{ "Validate" }} <i class="far fa-paper-plane ml-1"></i>
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            <div class="mt-1 mx-5" v-if="states.viewUploaded">
                <div class="mt-5 mb-3 attendance-head">
                    <div class="row px-4 pt-3 pb-4 text-center">
                        <div class="col light-heading" style="max-width: 100px">S/No.</div>
                        <div class="col light-heading" v-for="(header, index) in headers" :key="index">
                            {{ header }}
                        </div>
                    </div>
                </div>
                <div class="tab-content mt-1 attendance-body">
                    <div class="tab-pane active text-center" v-if="(show && uploadedCustomers.length > 0) || uploadedCustomers.length > 0">
                        <div class="mb-3 row attendance-item" v-for="(item, index) in uploadedCustomers" :key="item.id">
                            <div class="col-12 col-xs-2 col-md col-lg d-flex align-items-center">
                                <span class="user mx-auto">{{ index + 1 }}</span>
                            </div>
                            <div class="col-12 col-xs-2 col-md col-lg d-flex user-name align-items-center justify-content-center">
                                {{ $humanizeDate(item.created_at) }}
                            </div>
                            <div class="col-12 col-xs-2 col-md col-lg d-flex user-name align-items-center justify-content-center">
                                {{ item.total_rows }}
                            </div>
                            <div class="col-12 col-xs-2 col-md col-lg d-flex user-name align-items-center justify-content-center">
                                {{ item.number_of_rows_processed }}
                            </div>
                            <div class="col-12 col-xs-3 col-md col-lg d-flex align-items-center justify-content-center">
                                {{ item.number_of_rows_failed }}
                            </div>

                            <div class="col-12 col-xs-3 col-md col-lg d-flex align-items-center justify-content-center">
                                {{ item.status }}
                            </div>

                            <div class="col-12 col-xs-3 col-md col-lg d-flex align-items-center justify-content-center">
                                {{ item.uploaded_by.full_name }}
                            </div>

                            <div class="col-12 col-xs-3 col-md col-lg d-flex align-items-center justify-content-center">
                                {{ item.client.name }}
                            </div>
                            <div class="col-12 col-xs-3 col-md col-lg d-flex align-items-center justify-content-center">
                                <a :href="item.uploaded_file_url" target="_blank">link</a>
                            </div>
                        </div>
                    </div>

                    <div class="tab-pane active text-center" v-else>
                        <div class="mb-3 row attendance-item">
                            <div class="col d-flex light-heading align-items-center justify-content-center">No records found!</div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="mt-1 mx-5" v-if="states.viewCustomers">
                <div class="mt-5 mb-3 attendance-head">
                    <div class="row px-4 pt-3 pb-4 text-center">
                        <div class="col light-heading" style="max-width: 100px">S/No.</div>
                        <div class="col light-heading" v-for="(header, index) in headers" :key="index">
                            {{ header }}
                        </div>
                    </div>
                </div>
                <div class="tab-content mt-1 attendance-body">
                    <div class="tab-pane active text-center" v-if="(show && customers.length > 0) || customers.length > 0">
                        <div class="mb-3 row attendance-item" v-for="(item, index) in customers" :key="item.id">
                            <div class="col-12 col-xs-2 col-md col-lg d-flex align-items-center">
                                <span class="user mx-auto">{{ index + 1 }}</span>
                            </div>
                            <div class="col-12 col-xs-2 col-md col-lg d-flex user-name align-items-center justify-content-center">
                                {{ $humanizeDate(item.created_at) }}
                            </div>
                            <div class="col-12 col-xs-2 col-md col-lg d-flex user-name align-items-center justify-content-center">
                                {{ item.total_rows }}
                            </div>
                            <div class="col-12 col-xs-2 col-md col-lg d-flex user-name align-items-center justify-content-center">
                                {{ item.number_of_rows_processed }}
                            </div>
                            <div class="col-12 col-xs-3 col-md col-lg d-flex align-items-center justify-content-center">
                                {{ item.number_of_rows_failed }}
                            </div>

                            <div class="col-12 col-xs-3 col-md col-lg d-flex align-items-center justify-content-center">
                                {{ item.status }}
                            </div>

                            <div class="col-12 col-xs-3 col-md col-lg d-flex align-items-center justify-content-center">
                                {{ item.uploaded_by.full_name }}
                            </div>

                            <div class="col-12 col-xs-3 col-md col-lg d-flex align-items-center justify-content-center">
                                {{ item.client.name }}
                            </div>
                            <div class="col-12 col-xs-3 col-md col-lg d-flex align-items-center justify-content-center">
                                <a :href="item.uploaded_file_url" target="_blank">link</a>
                            </div>
                        </div>
                    </div>

                    <div class="tab-pane active text-center" v-else>
                        <div class="mb-3 row attendance-item">
                            <div class="col d-flex light-heading align-items-center justify-content-center">No records found!</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>
<script>
import { get, post } from "../../utilities/api";
import CustomHeader from "../../components/customHeader";
import { toMulipartedForm } from "../../utilities/form";
import Flash from "../../utilities/flash";
import { selectType } from "../../utilities/log.js";

export default {
    props: {},

    components: { CustomHeader },

    data() {
        return {
            error: null,
            isValidated: false,
            states: {
                upload: true,
                viewUploaded: false,
                viewCustomers: false,
            },
            loading: false,
            branch_id: "",
            errorMessages: [],
            form: {},
            flash: Flash.state,
            selectedCreditCheck: {},
            selectedStatus: "",
            searchQuery: { status: "pending", searchTerm: "", ctype: "mobile-loan" },
            show: false,
            repaymentDuration: null,
            tenants: [],
            customers: [],
            uploadedCustomers: [],
            file: null,
            pageParams: {
                page: 1,
                limit: 15,
            },
            apiUrls: {
                tenants: `/api/tenants`,
                uploadClients: "/api/upload/client/customer",
                uploadedCustomers: "/api/uploaded/client/customer/collection/data",
                customers: "/api/uploaded/client/customers",
            },
            headers: ["Date", "Total Records", "Successful", "Failed", "Status", "Uploaded By", "Client", "View File"],
            customerHeaders: ["Date", "Total Records", "Successful", "Failed", "Status", "Uploaded By", "Client", "View File"],
        };
    },

    methods: {
        async getTenants() {
            this.$LIPS(true);
            try {
                const tenantList = await get(this.apiUrls.tenants);
                this.tenants = tenantList?.data?.data?.tenants;
            } catch (err) {
                this.$displayErrorMessage(err);
            } finally {
                this.$LIPS(false);
            }
        },

        async downloadSample() {},
        selectType(type) {
            selectType(type, this.states);
            if (type === "viewUploaded") {
                this.fetchUploadedCustomers();
            }
            if (type === "viewCustomers") {
                this.fetchCustomers();
            }
        },

        async submit() {
            this.$LIPS(true);
            this.loading = true;

            try {
                this.errorMessages = [];
                let data = toMulipartedForm({
                    client_id: this.form.tenant_id,
                    file: this.file,
                });
                if (!this.isValidated) {
                    data.append("is_validation", 1);
                } else {
                    data.append("is_validation", 0);
                }

                let res = await post(this.apiUrls.uploadClients, data);
                if (res.data.status === "success" && !this.isValidated) {
                    // this.isValidated = true;
                } else {
                    this.isValidated = false;
                    this.file = null;
                    this.form.tenant_id = null;
                }
                Flash.setSuccess(res.data.message);
                this.errorMessages = [];
                // this.branch_id = null;
                // this.file = null;
            } catch (err) {
                this.errorMessages = err.response.data.data;
                this.$displayErrorMessage(err.response.data.message);
            } finally {
                this.$LIPS(false);
                this.loading = false;
            }
        },
        getFile(e) {
            this.file = e.target.files[0];
        },

        async fetchUploadedCustomers() {
            this.$LIPS(true);
            try {
                const tenantList = await get(this.apiUrls.uploadedCustomers);
                this.uploadedCustomers = tenantList?.data?.data?.clientCustomerCollections.data;
            } catch (err) {
                this.$displayErrorMessage(err);
            } finally {
                this.$LIPS(false);
            }
        },

        async fetchCustomers() {
            this.$LIPS(true);
            try {
                const tenantList = await get(this.apiUrls.customers);
                this.customers = tenantList?.data?.data?.customers.data;
            } catch (err) {
                this.$displayErrorMessage(err);
            } finally {
                this.$LIPS(false);
            }
        },
    },

    created() {},
    mounted() {
        this.getTenants();
    },

    destroyed() {
        // this.removeCustomerOptionsModalsFromDom();
    },
};
</script>

<style scoped>
.flex-row-bottom {
    display: flex;
    flex-direction: row;
    align-items: flex-end;
    justify-content: flex-end;
}
</style>
