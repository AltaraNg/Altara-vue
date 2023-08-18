<template>
  <div style="position:relative">
    <transition name="slide" mode="out-in">
       <div class="details" v-if="seeDetails">
        <BankStatementDetails @close="seeDetails = false" :BankStatement="BankStatement" />
      </div>
    </transition>
   
    <div v-if="!seeDetails" >
      <form enctype="multipart/form-data" @submit.prevent="uploadBankStatement" class="pb-5"
        style="background-color: #d7e2d8;">
        <div style="width: 100%;">
          <AutocompleteSearch title="customer lookup" @customer-selected="processForm"
            :url="'/api/customer/autocomplete'" />
        </div>
        <div style="padding-bottom: 14px; display: flex; " class="pl-5 ml-5 mt-5 ">
          <div style="width:23%; margin-right: 2%;">
            <label style="color: #074A74; font-weight: 800;">Minimum Salary (Optional)</label>
            <input type="number" name="repayment_duration" class="custom-select flex-1 w-100"
              v-model="bankStatementData.min_salary" />


          </div>
          <div style="width:23%; margin-right: 2%;">
            <label style="color: #074A74; font-weight: 800;">Maximum Salary (Optional)</label>
            <input type="number" name="repayment_duration" class="custom-select flex-1 w-100"
              v-model="bankStatementData.max_salary" />


          </div>
          <div style="width:23%; margin-right: 2%; ">
            <div style="position: relative;">
              <label style="color: #074A74; font-weight: 800;">BANK NAME</label>
              <select name="bank_statement_choice" class="customSelect   flex-1 w-100"
                v-model="bankStatementData.bank_statement_choice">
                <option v-for="option in statementChoices" :value="option.key" :key="option.key">{{ option.name }}
                </option>
              </select>
              <input type="file" ref="pdfInput" accept="application/pdf" style="display: none"
                @change="handlePDFChange" />
              <pdf style="position:absolute; right: 10px; bottom:5px; cursor:pointer" @click.native="uploadPDF()" />

            </div>
            <div v-if="bankStatementData.bank_statement_pdf">
              Selected PDF: {{ bankStatementData.bank_statement_pdf.name }}
            </div>
          </div>

          <button class="btn bg-default" style=" display: flex; align-items: center; justify-content: center; width:21%;"
            type="submit">
            <upload class="pr-2" />Upload Document
          </button>

        </div>


      </form>
      <div class="space-between mb-5 pl-5 mt-5 ml-5 px-4">
        <h3 class="text-capitalize mb-0">Filters</h3>
      </div>
      <div class="center my-2  ml-5 pl-5 " style=" display: flex; align-items: center;">
        <div style="width:70%; display: flex;">
          <div style="width:20%; margin-right: 2%;">
            <label style="color: #074A74; font-weight: 800;">DATE</label>
            <input type="date" name="repayment_duration" class="custom-select flex-1 w-100" v-model="repaymentPlan" />


          </div>
          <div style="width:20%; margin-right: 2%;">
            <label style="color: #074A74; font-weight: 800;">STATUS</label>
            <select name="repayment_duration" class="custom-select flex-1 w-100" v-model="repaymentPlan">
              <option v-for="option in availableRepaymentPlan" :value="option.id" :key="option.id">{{ option.name }}
              </option>
            </select>
          </div>
          <div style="width:20%; margin-right: 2%;">
            <label style="color: #074A74; font-weight: 800;">BANK NAME</label>
            <select name="repayment_duration" class="custom-select flex-1 w-100" v-model="searchQuery.statement_choice">
              <option v-for="option in statementChoices" :value="option.key" :key="option.key">{{ option.name }}
              </option>
            </select>
          </div>
          <div style="width:20%; margin-right: 2%;">
            <label style="color: #074A74; font-weight: 800;">CUSTOMER ID</label>
            <input type="number" name="repayment_duration" class="custom-select flex-1 w-100" v-model="repaymentPlan" />
          </div>



        </div>
        <div style="width:30%; display: flex; justify-content: end; padding-right: 43px;">
          <button style="width:30%; margin-right: 2%;" class="bg-default rounded  py-2 px-4" @click="getReport()">
            <span class="h5" style="width: 5rem">
              Search
            </span>
          </button>
          <button style="width:30%; margin-right: 2%;" class="bg-default rounded  py-2 px-4" @click="resetReport()">
            <span class="h5" style="width: 5rem">
              Reset
            </span>
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
            <div class="col-12 col-xs-3 col-md col-lg  align-items-start  ">
              <span class="user mx-auto text-white bg-default">{{ index + OId }}</span>
            </div>

            <div class="col-12 col-xs-3 col-md col-lg d-flex align-items-center justify-content-left">
              {{ bankStatement.customer_id }}
            </div>
            <div class="col-12 col-xs-3 col-md col-lg d-flex align-items-center justify-content-left">
              {{ bankStatement.account_name }}



            </div>
            <div class="col-12 col-xs-3 col-md col-lg d-flex align-items-center justify-content-left">
              {{ new Date(bankStatement.created_at).toISOString().split('T')[0] }}


            </div>

            <div class="col-12 col-xs-3 col-md col-lg d-flex align-items-center">
              {{ bankStatement.account_number }}
            </div>
            <div class="col-12 col-xs-3 col-md col-lg d-flex align-items-center justify-content-left">
              <div class="dropdown">
                <button type="button" class="btn btn-info bg-default "
                  :id="'dropdownMenuButton' + bankStatement.id" @click="seeMore(bankStatement)">
                  View
                </button>

              </div>
            </div>
          </div>
        </div>
        <div v-else class="h4 text-center">No Data</div>
        <div v-if="pageParams">
          <base-pagination :page-param="pageParams" @fetchData="fetchData">
          </base-pagination>
        </div>


      </div>
    </div>

  </div>
</template>
<script>
import AutocompleteSearch from "../../components/AutocompleteSearch/AutocompleteSearch.vue"
import { get, post, put } from "../../utilities/api"
import pdf from '../../assets/pdf.vue'
import BasePagination from "../../components/Pagination/BankStatementPagination.vue"
import BankStatementDetails from "../../components/BankStatementDetails.vue"
import upload from "../../assets/upload.vue"
import { toMulipartedForm } from '../../utilities/form'
import Flash from "../../utilities/flash";
export default {
  components: {
    AutocompleteSearch,
    BankStatementDetails,
    upload,
    BasePagination,
    pdf

  },
  data() {
    return {
      selectedPDF: null,
      bankStatementData: {
        customer_id :'',
        min_salary: '',
        max_salary: '',
        bank_statement_choice: 0,
        bank_statement_pdf: null
      },
      repaymentPlan: '',
      BankStatement: {},
      seeDetails: false,
      pageParams: {
        page: 1,
        limit: 15,
      },
      locale: "en-US",
      dateFormat: "YYYY-MM-DD",
      Branches: [],
      creditChecks: [],
      headings: [
        "S/N",
        "Customer ID",
        "Full Name",
        "Date",
        "Status",
        "Action",
      ],
      branch: '0',
      query: {},
      reports: null,
      availableRepaymentPlan: [],
      statementChoices: [],
      bankStatements: [],
      repaymentPlan: '',
      apiUrls: {
        getReports: '/api/repayment-schedule/report',
        repaymentDurations: '/api/repayment_duration',
        branches: '/api/branches',
        bank_statements: 'https://fast-alt-7790f3f68854.herokuapp.com/bank-statements',
        statement_choices: 'https://fast-alt-7790f3f68854.herokuapp.com/bank-statement-choices'
      },
      pageParams: {},
      MonthlyStat: [],
      orders: [],
      order2: [],
      isProcessing: true,
      barData: {},
      searchQuery: { },
      OId: null
    }
  },
  methods: {
    uploadPDF() {
      this.$refs.pdfInput.click();
    },
    handlePDFChange(event) {
      const selectedFile = event.target.files[0];
      if (selectedFile && selectedFile.type === 'application/pdf') {
        // Handle the selected PDF file
        this.bankStatementData.bank_statement_pdf = selectedFile;
      } else {
        alert('Please select a valid PDF file.');
      }
    },
   async uploadBankStatement() {
      this.$scrollToTop()
      this.$LIPS(true)
      const form = toMulipartedForm(this.bankStatementData);
      await post(this.apiUrls.bank_statements, form)
        .then(({ data }) => {
          console.log(data)
          Flash.setSuccess("Document Updated Successfully!")
          this.bankStatementData= {};
          this.fetchData()
        })
        .catch(e => {
          Flash.setError("Bank statement processing failed, unable to process the selected bank statement.")

        })
      this.$LIPS(false)

    },
    async processForm(id) {
      this.bankStatementData.customer_id  = id
      this.$LIPS(true)
      this.$LIPS(false)
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
      this.BankStatement = bankStatement
      this.seeDetails = true
    },
    async fetchData(params = {}) {
      this.$scrollToTop()
      this.$LIPS(true)
      params.page = this.pageParams.page ?? 1
      params.per_page = this.pageParams.limit ?? 15
      await get(this.apiUrls.bank_statements, params)
        .then((response) => {
          this.bankStatements = response.data.items;
          this.setPagination(response.data)
        })
        .catch((err) => {
          console.log(err)
          Flash.setError("Error occurred fetching Bank Statements")
        })
      this.$LIPS(false)
    },
    setPagination(response) {
      console.log(response, 'inpagination')
      const {
        page,
        first_page_url,
        from,
        pages,
        last_page_url,
        data,
        size,
        next_page_url,
        to,
        total,
        prev_page_url,
      } = response

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
      })
      this.OId = page==1 ? page : page*size;
      if (response.queryParams !== undefined) {
        this.searchQuery = response.queryParams
      }
    },
  },
  created() {
    this.searchQuery.status = this.$route?.query?.status
    this.searchQuery.searchTerm = this.$route?.query?.searchTerm
    this.fetchData({ ...this.searchQuery })
  },
  mounted() {
    this.getStatementChoices()
  },
}
</script>
<style scoped>
.customSelect {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background-color: white;
  border: none;

  color: black;
  padding: 8px 12px;
  font-size: 16px;
  width: 200px;
  outline: none;
  box-shadow: none;
}

.customSelect:focus {
  border: 0.1px solid #074a74ce !important;
  box-shadow: rgba(#074a74, 0.25) 0 0 0 1.596px;
}

.details {
  background-color: #F7F7FF;
  position: absolute;
  top: -40px;
  right: 0;
  z-index: 1000;
  min-height: 80vh;
  min-width: 100%
}
.slide-enter-active, .slide-leave-active {
  transition: all 0.6s;
}

.slide-enter, .slide-leave-to {
  transform: translateX(100%);
}
</style>

