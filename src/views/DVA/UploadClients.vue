<template>
    <transition name="fade" key="index">
        <div v-if="$isProcessing"></div>
        <div v-else>
            <div id="reminder" class="attendance" key="header">
                <custom-header :title="'Upload Clients'" />
            </div>

            <div class="mt-1 attendance-body w-75 mx-auto">
                <form @submit.prevent="onSave">
                    <div class="my-4 clearfix p-5 row bg-white shadow-sm card-radius">
                        <div class="form-group col-md-6  float-left px-0 px-md-3">
                            <label>Client name</label><br>
                            <select name="product_type" id="product_type" v-model="form.tenant_id"
                                class="custom-select w-100" required>
                                <option value="all" selected="selected">--select--</option>
                                <option :value="tenant.id" v-for="tenant of tenants" :key="tenant.id">{{ tenant.name }}
                                </option>
                            </select>
                            <!-- <small v-if="error.name">{{ error.name[0] }}</small> -->
                        </div>

                        <div class="form-group col-md-6  float-left px-0 px-md-3">
                            <label>Upload Doc</label><br>
                            <input type="file" @change="getFile" class="">
                            <div class="pointer text-link"><a
                                    href="https://docs.google.com/spreadsheets/d/1GkMgXrnJhBhQQRcIm7NLkg0GfVBf9FwDUveiCncUSLU/edit?usp=sharing"
                                    target="_blank">sample document</a></div>
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
                            <router-link to="/log/products" class="mx-5 text-link mt-4 pt-2">
                                Cancel
                            </router-link>
                            <button :disabled="$isProcessing" class="btn bg-default" type="submit" @click="submit">
                                Submit <i class="far fa-paper-plane ml-1"></i>
                            </button>
                        </div>
                    </div>

                </form>
            </div>



        </div>
    </transition>
</template>
<script>
import { get, post } from "../../utilities/api";
import CustomHeader from "../../components/customHeader";
import { toMulipartedForm } from "../../utilities/form";
import Flash from "../../utilities/flash";



export default {
    props: {},

    components: { CustomHeader },

    data() {
        return {
            error: null,
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
            file: null,
            pageParams: {
                page: 1,
                limit: 15,
            },
            apiUrls: {
                tenants: `/api/tenants`,
                uploadClients: '/api/upload/client/customer'
            },
        };
    },


    methods: {
        async getTenants() {
            this.$LIPS(true);
            try {
                const tenantList = await get(this.apiUrls.tenants);
                this.tenants = tenantList?.data?.data?.tenants
            } catch (err) {
                this.$displayErrorMessage(err);
            } finally {
                this.$LIPS(false);

            }
        },

        async downloadSample() {

        },

        async submit() {
            this.$LIPS(true);

            try {
                this.errorMessages = [];
                let data = toMulipartedForm({
                    client_id: this.form.tenant_id,
                    file: this.file
                })
                let res = await post(this.apiUrls.uploadClients, data);
                Flash.setSuccess(res.data.message);
                this.branch_id = null;
                this.file = null;
                
            } catch (err) {
                this.errorMessages = err.response.data.data
                this.$displayErrorMessage(err.response.data.message);
            }
            finally {
                this.$LIPS(false);
            }
        },
        getFile(e) {
            console.log(e);
            this.file = e.target.files[0];
        }


    },


    created() {

    },
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
