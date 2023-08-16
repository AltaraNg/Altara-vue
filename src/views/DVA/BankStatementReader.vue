<template>
  <div style="position:relative">
    <div class="details" v-if="seeDetails">
           <BankStatementDetails @close="seeDetails = false" :BankStatement="BankStatement"/>
          </div>
      <div v-else>
         <div style="display: flex; align-items: end; " class="w-100 ">
        <div style="width: 85%;">
          <AutocompleteSearch title="customer lookup" @customer-selected="processForm"
            :url="'/api/customer/autocomplete'" />
        </div>
        <div style="padding-bottom: 14px; margin-left: -25px;">
          <button class="btn bg-default" style="padding: 23px 30px; display: flex; align-items: center;" type="submit">
            <upload class="pr-2" />Upload Document
          </button>
        </div>

      </div>
      <div class="space-between mb-5 pl-5 mt-5 ml-5 px-4">
        <h3 class="text-capitalize mb-0">Filters</h3>
      </div>
      <div class="center my-2  ml-5 pl-5 " style=" display: flex; align-items: center;">
        <div style="width:60%; display: flex;">
          <div style="width:30%; margin-right: 2%;">
            <label style="color: #074A74; font-weight: 800;">DATE</label>
            <input type="date" name="repayment_duration" class="custom-select flex-1 w-100" v-model="repaymentPlan" />


          </div>
          <div style="width:30%; margin-right: 2%;">
            <label style="color: #074A74; font-weight: 800;">STATUS</label>
            <select name="repayment_duration" class="custom-select flex-1 w-100" v-model="repaymentPlan">
              <option v-for="option in availableRepaymentPlan" :value="option.id" :key="option.id">{{ option.name }}
              </option>
            </select>
          </div>
          <div style="width:30%; margin-right: 2%;">
            <label style="color: #074A74; font-weight: 800;">CUSTOMER ID</label>
            <input type="number" name="repayment_duration" class="custom-select flex-1 w-100" v-model="repaymentPlan"/>
          </div>



        </div>
        <div style="width:40%; display: flex; justify-content: end; padding-right: 43px;">
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
      <div >
         <div class="mt-5 pt-5 attendance-head">
              <div class="row mt-5 px-4 pt-3 pb-4 text-left">
            
                <div
                  class="col light-heading"
                  v-for="(header, index) in headings"
                  :key="index"
                >
                  {{ header }}
                </div>
              </div>
            </div>
            <div
            class="mt-1 attendance-body text-left"
            key="table"
            v-if="creditChecks.length > 0 && creditChecks"
          >
            <div
              class="mb-3 row d-flex bg-white table-hover"
              :key="index"
              v-for="(creditCheck, index) in creditChecks"
            >
              <!-- {{ creditCheck }} -->
              <div class="col-12 col-xs-3 col-md col-lg  align-items-start  ">
                <span
                  class="user mx-auto text-white bg-default"
                  >{{ index + OId }}</span
                >
              </div>
         
              <div
                class="col-12 col-xs-3 col-md col-lg d-flex align-items-center justify-content-left"
              >
                {{ creditCheck.customer_id }}
              </div>
             <div
                  class="col-12 col-xs-3 col-md col-lg d-flex align-items-center justify-content-left"
                >
                  {{ creditCheck.customer.first_name }}
                  {{ creditCheck.customer.last_name }}
              

              
              </div>
              <div
                  class="col-12 col-xs-3 col-md col-lg d-flex align-items-center justify-content-left"
                >
                  21/12/2002

             
              </div>
            
              <div class="col-12 col-xs-3 col-md col-lg d-flex align-items-center">
                <span
                  class="badge badge-success bg-success text-white font-weight-bold"
                  v-if="creditCheck.status === 'passed'"
                  >Passed</span
                >
                <span
                  class="badge badge-warning bg-warning text-black font-weight-bold"
                  v-if="creditCheck.status === 'pending'"
                  >Pending</span
                >
                <span
                  class="badge badge-danger bg-danger text-white font-weight-bold"
                  v-if="creditCheck.status === 'failed'"
                  >Failed</span
                >
              </div>
              <div
                class="col-12 col-xs-3 col-md col-lg d-flex align-items-center justify-content-left"
              >
                <div class="dropdown">
                  <button
                    type="button"
                    class="btn btn-info bg-default dropdown-toggle"
                 
                    :id="'dropdownMenuButton' + creditCheck.id"
                    @click="seeMore(creditCheck)"
                  
                  >
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
import BasePagination from "../../components/Pagination/BasePagination.vue"
import BankStatementDetails from "../../components/BankStatementDetails.vue"
import upload from "../../assets/upload.vue"
export default {
  components: {
    AutocompleteSearch,
    BankStatementDetails,
    upload,
    BasePagination

  },
  data() {
    return {
      repaymentPlan:'',
      BankStatement:{},
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
      repaymentPlan: '',
      apiUrls: {
        getReports: '/api/repayment-schedule/report',
        repaymentDurations: '/api/repayment_duration',
        branches: '/api/branches',
        renewalList: '/api/renewal/prompters',
      },
      pageParams: {},
      MonthlyStat: [],
      orders: [],
      order2: [],
      isProcessing: true,
      barData: {},
      searchQuery: { status: "pending", searchTerm: "" },
      OId:null           
    }
  },
  methods: {
    async processForm(id) {
      this.show = false
      this.$LIPS(true)

      await get(`/api/customer/lookup/${id}`)
        .then(res => {
          console.log(res)
        })
        .catch(e => {
          this.$LIPS(false)
          Flash.setError("Error Fetching customer detail")
        })
      this.$LIPS(false)
    },
    seeMore(creditCheck){
      this.BankStatement = creditCheck
      console.log(this.BankStatement, 'BankStatement')
      this.seeDetails = true
    },
    async fetchData(params = {}) {
      this.$scrollToTop()
      this.$LIPS(true)
      const url = "api/all/credit/checker"
      params.page = this.pageParams.page ?? 1
      params.per_page = this.pageParams.limit ?? 15
      await get(url, params)
        .then((response) => {
          this.creditChecks =
            response.data?.data?.creditCheckerVerifications?.data
          this.setPagination(response)
        })
        .catch((err) => {
          flash.setError("Error occurred fetching credit checks")
        })
      this.$LIPS(false)
    },
    setPagination(response) {
      const {
        current_page,
        first_page_url,
        from,
        last_page,
        last_page_url,
        data,
        per_page,
        next_page_url,
        to,
        total,
        prev_page_url,
      } = response?.data?.data?.creditCheckerVerifications
      
      this.pageParams = Object.assign({}, this.pageParams, {
        current_page,
        first_page_url,
        from,
        last_page,
        last_page_url,
        per_page,
        next_page_url,
        to,
        total,
        prev_page_url,
      })
      this.OId = from;
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
}
</script>
<style scoped>
.details{
 background-color: #F7F7FF;
 position: absolute;
 top: -40px;
 right: 0;
 z-index: 1000;
 min-height: 80vh;
 min-width: 100%; 
}
</style>

