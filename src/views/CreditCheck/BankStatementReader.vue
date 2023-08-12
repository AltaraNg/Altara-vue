<template>
  <div >
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
      <div style="width:60%">
          <select style="width:30%; margin-right: 2%;" name="repayment_duration" class="custom-select flex-1" v-model="repaymentPlan">
            <option :value="''" selected>Date</option>
            <option v-for="option in availableRepaymentPlan" :value="option.id" :key="option.id">{{ option.name }}
            </option>
          </select>
 
        <select name="repayment_duration" style="width:30%; margin-right: 2%;" class="custom-select flex-1" v-model="repaymentPlan">
          <option :value="''" selected>Status</option>
          <option v-for="option in availableRepaymentPlan" :value="option.id" :key="option.id">{{ option.name }}
          </option>
        </select>

        <select style="width:30%; margin-right: 2%;" class="custom-select flex-1" v-validate="'required'" v-model="branch">
          <option value="0" selected>Customer ID</option>
          <option v-for="option in Branches" :value="option.id">{{ option.name }}</option>
        </select>
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
  </div>
</template>
<script>
import AutocompleteSearch from "../../components/AutocompleteSearch/AutocompleteSearch.vue"
import { get, post, put } from "../../utilities/api"
import upload from "../../assets/upload.vue"
export default {
  components: {
    AutocompleteSearch,
    upload
  },
  data() {
    return {
      locale: "en-US",
      dateFormat: "YYYY-MM-DD",
      Branches: [],
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
      barOption: {
        responsive: true,
        maintainAspectRatio: false
      }
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
  }
}
</script>

