<template>
    <div>
        <div>
            <div style="display: flex">
                <custom-header
                    :title="'Existing Customer'"
                    @click.native="selectType('existingCustomer')"
                    :style="!formMode.existingCustomer ? 'opacity: 0.2; cursor:pointer;' : 'cursor:pointer;'"
                />
                <custom-header
                    :title="'New Customer'"
                    @click.native="selectType('newCustomer')"
                    :style="!formMode.newCustomer ? 'opacity: 0.2; cursor:pointer;' : 'cursor:pointer; '"
                    style="margin-left: -10px"
                />
            </div>

            <form enctype="multipart/form-data" @submit.prevent="uploadBankStatement" class="pb-5" style="background-color: #d7e2d861">
                <div v-if="formMode.existingCustomer">
                    <div style="width: 100%">
                        <AutocompleteSearch title="customer lookup" @customer-selected="processForm" :url="'/api/customer/autocomplete'" />
                    </div>
                    <div style="padding-bottom: 14px; display: flex; flex-wrap: wrap" class="pl-5 ml-5 mt-5">
                        <div style="width: 23%; margin-right: 2%" class="mt-5">
                            <label style="color: #074a74; font-weight: 800">Minimum Salary (Optional)</label>
                            <input
                                type="number"
                                name="repayment_duration"
                                class="custom-select flex-1 w-100"
                                v-model="bankStatementData.min_salary"
                            />
                        </div>
                        <div style="width: 23%; margin-right: 2%" class="mt-5">
                            <label style="color: #074a74; font-weight: 800">Maximum Salary (Optional)</label>
                            <input
                                type="number"
                                name="repayment_duration"
                                class="custom-select flex-1 w-100"
                                v-model="bankStatementData.max_salary"
                            />
                        </div>
                        <div style="width: 23%; margin-right: 2%" class="mt-5">
                            <div style="position: relative">
                                <label style="color: #074a74; font-weight: 800">Bank Name</label>
                                <select
                                    name="bank_statement_choice"
                                    class="customSelect flex-1 w-100"
                                    v-model="bankStatementData.bank_statement_choice"
                                >
                                    <option selected>Select bank</option>
                                    <option v-for="option in statementChoices" :value="option.key" :key="option.key">{{ option.name }}</option>
                                </select>
                                <input type="file" ref="pdfInput" accept="application/pdf" style="display: none" @change="handlePDFChange" />
                                <pdf style="position: absolute; right: 10px; bottom: 5px; cursor: pointer" @click.native="uploadPDF()" />
                            </div>
                            <div v-if="bankStatementData.bank_statement_pdf">Selected PDF: {{ bankStatementData.bank_statement_pdf.name }}</div>
                        </div>
                        <button
                            :disabled="isButtonDisabled"
                            class="btn bg-default"
                            style="display: flex; align-items: center; justify-content: center; width: 21%"
                            type="submit"
                        >
                            <i class="fas fa-cloud-upload-alt pr-2" style="font-size: large"></i>Upload Document
                        </button>
                    </div>
                </div>
            </form>
            <div v-if="formMode.newCustomer">
                <div
                    style="padding-bottom: 14px; display: flex; flex-wrap: wrap; background-color: #d7e2d861"
                    class="pl-5 pb-5 w-100"
                    v-if="!customerCreated"
                >
                    <div style="width: 30%; margin-right: 2%" class="mt-5">
                        <label style="color: #074a74; font-weight: 800">First Name</label>
                        <input type="text" name="first_name" class="customSelect flex-1 w-100" v-model="CreateCustomer.first_name" />
                    </div>
                    <div style="width: 30%; margin-right: 2%" class="mt-5">
                        <label style="color: #074a74; font-weight: 800">Middle Name</label>
                        <input type="text" name="middle_name" class="customSelect flex-1 w-100" v-model="CreateCustomer.middle_name" />
                    </div>
                    <div style="width: 30%; margin-right: 2%" class="mt-5">
                        <label style="color: #074a74; font-weight: 800">Last Name</label>
                        <input type="text" name="last_name" class="customSelect flex-1 w-100" v-model="CreateCustomer.last_name" />
                    </div>
                    <div style="width: 30%; margin-right: 2%" class="mt-5">
                        <label style="color: #074a74; font-weight: 800">Phone Number</label>
                        <input
                            @input="validatePhoneNumber"
                            type="number"
                            name="phone_number"
                            class="customSelect flex-1 w-100"
                            v-model="CreateCustomer.telephone"
                            max.length="11"
                        />
                    </div>
                    <div style="width: 30%; margin-right: 2%" class="mt-5">
                        <label style="color: #074a74; font-weight: 800">Address</label>
                        <input type="text" name="address" class="customSelect flex-1 w-100" v-model="CreateCustomer.add_street" />
                    </div>
                    <div class="" style="display: flex; width: 30%; align-items: end">
                        <button
                            :disabled="!Object.values(CreateCustomer).every((value) => value) || CreateCustomer.telephone.length !== 11"
                            class="btn bg-default"
                            @click="registerCNC"
                            style="display: flex; align-items: center; justify-content: center; width: 100%; height: 30px"
                            type="submit"
                        >
                            <i class="fas fa-cloud-upload-alt pr-2" style="font-size: large"></i>Create Customer
                        </button>
                    </div>
                </div>
                <div v-else>
                    <div style="padding-bottom: 14px; display: flex; flex-wrap: wrap; background-color: #d7e2d861" class="pl-5 w-100">
                        <div style="width: 30%; margin-right: 2%" class="mt-5">
                            <label style="color: #074a74; font-weight: 800">Customer ID</label>
                            <div type="number" name="customer_id" class="custom-select flex-1 w-100">{{ bankStatementData.customer_id }}</div>
                        </div>
                        <div style="width: 30%; margin-right: 2%" class="mt-5">
                            <label style="color: #074a74; font-weight: 800">Minimum Salary (Optional)</label>
                            <input
                                type="number"
                                name="repayment_duration"
                                class="custom-select flex-1 w-100"
                                v-model="bankStatementData.min_salary"
                            />
                        </div>
                        <div style="width: 30%; margin-right: 2%" class="mt-5">
                            <label style="color: #074a74; font-weight: 800">Maximum Salary (Optional)</label>
                            <input
                                type="number"
                                name="repayment_duration"
                                class="custom-select flex-1 w-100"
                                v-model="bankStatementData.max_salary"
                            />
                        </div>
                        <div style="width: 30%; margin-right: 2%" class="mt-5">
                            <div style="position: relative">
                                <label style="color: #074a74; font-weight: 800">Bank Name</label>
                                <select
                                    name="bank_statement_choice"
                                    class="customSelect flex-1 w-100"
                                    v-model="bankStatementData.bank_statement_choice"
                                >
                                    <option selected>Select bank</option>
                                    <option v-for="option in statementChoices" :value="option.key" :key="option.key">{{ option.name }}</option>
                                </select>
                                <input type="file" ref="pdfInput" accept="application/pdf" style="display: none" @change="handlePDFChange" />
                                <pdf style="position: absolute; right: 10px; bottom: 5px; cursor: pointer" @click.native="uploadPDF()" />
                            </div>
                            <div v-if="bankStatementData.bank_statement_pdf">Selected PDF: {{ bankStatementData.bank_statement_pdf.name }}</div>
                        </div>
                        <div style="width: 30%; display: flex; align-items: end">
                            <button
                                :disabled="isButtonDisabled"
                                class="btn bg-default"
                                style="display: flex; align-items: center; justify-content: center; width: 100%; height: 30px"
                                @click.prevent="uploadBankStatement"
                            >
                                <i class="fas fa-cloud-upload-alt pr-2" style="font-size: large"></i>Upload Document
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="space-between mb-5 pl-5 mt-5 ml-5 px-4">
            <h3 class="text-capitalize mb-0">Filters</h3>
        </div>
        <div class="center my-2 ml-5 pl-5" style="display: flex; align-items: center">
            <div style="width: 70%; display: flex">
                <div style="width: 20%; margin-right: 2%">
                    <label style="color: #074a74; font-weight: 800">DATE</label>
                    <date-picker
                        class="w-100"
                        v-model="dateRange"
                        :range="true"
                        :language="locale"
                        :format="dateFormat"
                        valueType="format"
                        placeholder="Date"
                    ></date-picker>
                </div>
                <div style="width: 20%; margin-right: 2%">
                    <label style="color: #074a74; font-weight: 800">ACCOUNT NAME</label>
                    <input type="text" name="account_name" class="customSelect flex-1 w-100" v-model="pageParams.account_name" />
                </div>
                <div style="width: 20%; margin-right: 2%">
                    <label style="color: #074a74; font-weight: 800">ACCOUNT NUMBER</label>
                    <input type="number" name="account_number" class="customSelect flex-1 w-100" v-model="pageParams.account_number" />
                </div>
                <div style="width: 20%; margin-right: 2%">
                    <label style="color: #074a74; font-weight: 800">CUSTOMER ID</label>
                    <input type="number" name="customer_id" class="custom-select flex-1 w-100" v-model="pageParams.customer_id" />
                </div>
                <div style="width: 20%; margin-right: 2%">
                    <label style="color: #074a74; font-weight: 800">BANK NAME</label>
                    <select name="bank_statement_choice" class="customSelect flex-1 w-100" v-model="pageParams.bank_statement_choice">
                        <option selected>Select bank</option>
                        <option v-for="option in statementChoices" :value="option.key" :key="option.key">{{ option.name }}</option>
                    </select>
                </div>
            </div>
            <div style="width: 30%; display: flex; justify-content: end; padding-right: 43px">
                <button style="width: 30%; margin-right: 2%" class="bg-default rounded py-2 px-4" @click="Search()">
                    <span class="h5" style="width: 5rem"> Search </span>
                </button>
                <button style="width: 30%; margin-right: 2%" class="bg-default rounded py-2 px-4" @click="resetFilter()">
                    <span class="h5" style="width: 5rem"> Reset </span>
                </button>
            </div>
        </div>
        <div>
            <div class="mt-5 pt-5 attendance-head">
                <div class="row mt-5 px-4 pt-3 pb-4 text-left">
                    <div class="col light-heading" v-for="(header, index) in headings" :key="index">
                        {{ header }}
                    </div>
                </div>
            </div>
            <div class="mt-1 attendance-body text-left" key="table" v-if="bankStatements.length > 0 && this.bankStatements">
                <div class="mb-3 row d-flex bg-white table-hover" :key="index" v-for="(bankStatement, index) in bankStatements">
                    <!-- {{ creditCheck }} -->
                    <div class="col-12 col-xs-3 col-md col-lg align-items-start">
                        <span class="user mx-auto text-white bg-default">{{ index + OId }}</span>
                    </div>

                    <div class="col-12 col-xs-3 col-md col-lg d-flex align-items-center justify-content-left">
                        {{ bankStatement.customer_id }}
                    </div>
                    <div class="col-12 col-xs-3 col-md col-lg d-flex align-items-center justify-content-left">
                        {{ bankStatement.account_name }}
                    </div>
                    <div class="col-12 col-xs-3 col-md col-lg d-flex align-items-center justify-content-left">
                        {{ new Date(bankStatement.created_at).toISOString().split("T")[0] }}
                    </div>

                    <div class="col-12 col-xs-3 col-md col-lg d-flex align-items-center">
                        {{ bankStatement.account_number }}
                    </div>
                    <div class="col-12 col-xs-3 col-md col-lg d-flex align-items-center justify-content-left">
                        <div class="dropdown">
                            <button
                                type="button"
                                class="btn btn-info bg-default"
                                :id="'dropdownMenuButton' + bankStatement.id"
                                @click="seeMore(bankStatement)"
                            >
                                View
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div v-else class="h4 text-center">No Data</div>
            <div v-if="pageParams">
                <base-pagination :page-param="pageParams" @fetchData="fetchData"> </base-pagination>
            </div>
        </div>
    </div>
</template>
<script>
import AutocompleteSearch from "../../components/AutocompleteSearch/AutocompleteSearch.vue";
import { get, post } from "../../utilities/api";
import CustomHeader from "../../components/customHeader";
import DatePicker from "vue2-datepicker";
import "vue2-datepicker/index.css";
import pdf from "../../assets/pdf.vue";
import BasePagination from "../../components/Pagination/BankStatementPagination.vue";
import { toMulipartedForm } from "../../utilities/form";
import Flash from "../../utilities/flash";
import { selectType } from "../../utilities/log.js";
import router from "../../router";
export default {
    components: {
        AutocompleteSearch,
        BasePagination,
        pdf,
        DatePicker,
        CustomHeader,
    },
    data() {
        return {
            customerCreated: false,
            CreateCustomer: {
                first_name: "",
                middle_name: "",
                last_name: "",
                add_street: "",
                telephone: "",
            },
            formMode: {
                newCustomer: false,
                existingCustomer: true,
            },
            selectedPDF: null,
            bankStatementData: {
                customer_id: "",
                min_salary: "",
                max_salary: "",
                bank_statement_choice: "Select bank",
                bank_statement_pdf: null,
                first_name: "",
                middle_name: "",
                last_name: "",
                phone_number: "",
                address: "",
            },
            repaymentPlan: "",
            BankStatement: {},
            seeDetails: false,
            locale: "en-US",
            dateFormat: "YYYY-MM-DD",
            Branches: [],
            creditChecks: [],
            headings: ["S/N", "Customer ID", "Full Name", "Date", "Account Number", "Action"],
            branch: "0",
            query: {},
            reports: null,
            availableRepaymentPlan: [],
            statementChoices: [],
            bankStatements: [],
            apiUrls: {
                getReports: "/api/repayment-schedule/report",
                repaymentDurations: "/api/repayment_duration",
                branches: "/api/branches",
                bank_statements: `${process.env.VUE_APP_PYTHON_API}/bank-statements`,
                statement_choices: `${process.env.VUE_APP_PYTHON_API}/bank-statement-choices`,
            },
            pageParams: { page: 1, size: 10, customer_id: "", account_name: "", account_number: "", bank_statement_choice: "" },
            MonthlyStat: [],
            orders: [],
            order2: [],
            isProcessing: true,
            barData: {},
            OId: null,
            dateRange: [],
        };
    },
    methods: {
        validatePhoneNumber() {
            if (this.CreateCustomer.telephone.length > 11) {
                this.CreateCustomer.telephone = this.CreateCustomer.telephone.slice(0, 11);
            }
        },
        async registerCNC() {
            this.$LIPS(true);
            try {
                this.CreateCustomer.branch_id = this.staff.branch_id;
                this.CreateCustomer.employee_id = this.staff.id;
                this.CreateCustomer.employee_name = this.staff.full_name;
                this.CreateCustomer.date_of_registration = new Date().toISOString().slice(0, 10);
                let res = await post("/api/customer", this.CreateCustomer);
                if (res.status === 200) {
                    this.$swal({
                        icon: "success",
                        title: "Customer Registered Successfully",
                        text: `Customer ID: ${res.data.customer.id}`,
                        html: `<div class="h3">Customer ID: <b class="text-success">${res.data.customer.id}</b></div>`,
                    });
                    this.CreateCustomer = {
                        first_name: "",
                        middle_name: "",
                        last_name: "",
                        add_street: "",
                        telephone: "",
                    };
                    this.bankStatementData.customer_id = res.data.customer.id;
                    this.customerCreated = true;
                } else {
                    this.$swal({
                        icon: "error",
                        title: "Unable to Complete",
                        message: res.data.message,
                    });
                }
                this.$LIPS(false);
            } catch (err) {
                this.$swal({
                    icon: "error",
                    title: "Unable to Complete",
                    text: err.response?.data?.data?.errors?.telephone,
                });
                this.$LIPS(false);
            }
        },
        prepareForm(data) {
            this.staff = data.user;
            this.states = data.states;
            this.branches = data.branches;
        },
        selectType(type) {
            selectType(type, this.formMode);
        },
        async resetFilter() {
            this.dateRange = [];
            this.pageParams = {
                page: 1,
                size: 15,
            };
            await this.fetchData(this.pageParams);
        },
        async Search() {
            this.pageParams.page = 1;
            await this.fetchData();
        },
        uploadPDF() {
            this.$refs.pdfInput.click();
        },
        handlePDFChange(event) {
            const selectedFile = event.target.files[0];
            if (selectedFile && selectedFile.type === "application/pdf") {
                // Handle the selected PDF file
                this.bankStatementData.bank_statement_pdf = selectedFile;
            } else {
                Flash.setError("Please select a valid PDF file.");
            }
        },
        async uploadBankStatement() {
            this.$scrollToTop();
            this.$LIPS(true);
            const form = toMulipartedForm(this.bankStatementData);
            await post(this.apiUrls.bank_statements, form)
                .then(() => {
                    this.customerCreated = false;
                    Flash.setSuccess("Document Updated Successfully!");
                    this.bankStatementData = {};
                    this.selectType("existingCustomer");

                    this.fetchData();
                })
                .catch(() => {
                    Flash.setError("Bank statement processing failed, unable to process the selected bank statement.");
                });
            this.$LIPS(false);
        },
        async processForm(id) {
            this.bankStatementData.customer_id = id;
            this.$LIPS(true);
            this.$LIPS(false);
        },
        async getStatementChoices() {
            try {
                const fetchStatementChoices = await get(this.apiUrls.statement_choices);
                this.statementChoices = fetchStatementChoices.data;
            } catch (err) {
                this.$displayErrorMessage(err);
            }
        },

        seeMore(bankStatement) {
            router.push({
                name: "BankStatementDetails",
                params: {
                    id: bankStatement.id,
                },
            });
        },
        async fetchData(params = {}) {
            this.$scrollToTop();
            this.$LIPS(true);
            await get(this.apiUrls.bank_statements, { ...params, ...this.pageParams, from_date: this.dateRange[0], to_date: this.dateRange[1] })
                .then((response) => {
                    this.bankStatements = response.data.items;
                    this.setPagination(response.data);
                })
                .catch(() => {
                    Flash.setError("Error occurred fetching Bank Statements");
                });
            this.$LIPS(false);
        },
        setPagination(response) {
            const { page, first_page_url, from, pages, last_page_url, size, next_page_url, to, total, prev_page_url } = response;

            this.pageParams = Object.assign({}, this.pageParams, {
                page,
                first_page_url,
                from,
                pages,
                last_page_url,
                size,
                next_page_url,
                to,
                total,
                prev_page_url,
            });
            this.OId = page == 1 ? page : (page - 1) * size + 1;
            if (response.queryParams !== undefined) {
                this.pageParams = response.queryParams;
            }
        },
    },
    computed: {
        isButtonDisabled() {
            return (
                !this.bankStatementData.customer_id ||
                this.bankStatementData.bank_statement_choice === "Select bank" ||
                !this.bankStatementData.bank_statement_pdf
            );
        },
    },
    created() {
        this.pageParams.size = this.$route?.query?.size;
        this.pageParams.page = this.$route?.query?.page;
        this.fetchData({ ...this.pageParams });
        get("/api/customer/create").then(({ data }) => {
            this.prepareForm(data);
        });
        /*on create of the component fetch the data required to prepare the form
         * states, branches and the currently logged in dsa details*/
    },
    mounted() {
        this.getStatementChoices();
    },
};
</script>
<style scoped>
.customSelect {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    background-color: white;
    border-radius: 2px;
    border-color: rgba(194, 194, 194, 0.282);
    color: black;
    padding: 8px 12px;
    font-size: 16px;
    width: 200px;
    outline: none;
    box-shadow: none;
}

.customSelect:focus {
    border: 0.1px solid #074a7464 !important;
    box-shadow: rgba(#074a74d6, 0.25) 0 0 10px 10px;
}

.details {
    background-color: #f7f7ff;
    position: absolute;
    top: -40px;
    overflow: auto;
    right: 0;
    z-index: 1000;
    overflow-x: hidden;
    height: 100vh;
    min-width: 100%;
}

.details::-webkit-scrollbar {
    width: 1px;
    /* Width of the hidden scrollbar */
}

.details::-webkit-scrollbar-thumb {
    /* Scrollbar thumb (the draggable part) */
    background-color: transparent;
    /* Hide the thumb */
}

.details::-webkit-scrollbar-track {
    /* Scrollbar track (the background) */
    background-color: transparent;
    /* Hide the track */
}
</style>
