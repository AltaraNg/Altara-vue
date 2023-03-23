<template>
  <transition name="fade" key="index">
    <div>
      <div id="reminder" class="attendance" key="header">
        <custom-header :title="'Credit Check List'" />
        <div class="mb-2 attendance-head">
          <div class="w-100">
            <div class="row w-100">
              <h4 class="col">Filters</h4>
            </div>
            <div class="d-flex">
              <div class="col-md-2">
                <select
                  v-model="searchQuery.status"
                  class="custom-select form-control"
                  name="status"
                  id="status"
                  style="height: 4.5rem"
                >
                  <option selected value="" disabled>--Select Status--</option>
                  <option
                    :value="status"
                    v-for="(status, index) in statuses"
                    :key="index"
                  >
                    {{ status }}
                  </option>
                </select>
              </div>

              <div class="col-md-2">
                <div class="form-group">
                  <input
                    v-model="searchQuery.searchTerm"
                    type="text"
                    class="form-control"
                    id="search"
                    placeholder="Search"
                    name="searchTerm"
                  />
                </div>
              </div>

              <div class="d-flex">
                <div class="mx-2">
                  <button
                    class="my-auto p-3 btn rounded mx-2 bg-default w-100"
                    @click="resetFilter"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="mt-2 attendance-head">
          <div class="row px-4 pt-3 pb-4 text-left">
            
            <div
              class="col light-heading"
              v-for="(header, index) in headings"
              :key="index"
            >
              {{ header }}
            </div>
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
         
          <div
            class="col-12 col-xs-3 col-md col-lg d-flex align-items-center justify-content-left"
          >
            {{ creditCheck.customer_id }}
          </div>
          <div
            class="col-12 col-xs-3 col-md col-lg d-flex flex-column align-items-start"
          >
            <p class="mr-2">
              {{ creditCheck.customer.first_name }}
              {{ creditCheck.customer.last_name }}
            </p>

            <p class="h6">{{ creditCheck.customer.telephone }}</p>
          </div>
          <div
            class="col-12 col-xs-3 col-md col-lg d-flex flex-column align-items-start justify-content-left"
          >
            <p class="mr-2">
              {{ creditCheck.vendor.full_name }}
            </p>
            <p class="h6">{{ creditCheck.vendor.phone_number }}</p>
          </div>
          <div
            class="col-12 col-xs-3 col-md col-lg d-flex flex-column align-items-start"
          >
            <p class="mr-2">
              {{ creditCheck.bnpl_product.name }}
            </p>
            <p class="h6">
              {{
                Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "NGR",
                }).format(creditCheck.bnpl_product.price)
              }}
            </p>
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
                class="btn btn-info dropdown-toggle"
                data-toggle="dropdown"
                :id="'dropdownMenuButton' + creditCheck.id"
                @click="setSelectedCreditCheck(creditCheck)"
              >
                Action
              </button>
              <div
                class="dropdown-menu"
                :aria-labelledby="'dropdownMenuButton' + creditCheck.id"
              >
                <button
                  class="dropdown-item"
                  type="button"
                  data-toggle="modal"
                  data-target="#creditCheckModal"
                >
                  Change Status
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="h4 text-center">No Data</div>
      <div v-if="pageParams">
        <base-pagination :page-param="pageParams" @fetchData="fetchData">
        </base-pagination>
      </div>
      <div class="modal" tabindex="-1" role="dialog" id="creditCheckModal">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="d-flex justify-items-between">
                Update Credit Check Verification Status
              </h5>
              <button
                type="button"
                class="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true" class="modal-close text-danger">
                  <i class="fas fa-times"></i>
                </span>
              </button>
            </div>
            <form action="">
              <div class="modal-body">
                <div class="form-group">
                  <label for="inputState">State</label>
                  <select
                    id="inputState"
                    class="form-control"
                    style="height: 4rem"
                    v-model="selectedStatus"
                  >
                    <option selected disabled>Choose...</option>
                    <option
                      v-for="(item, index) in statuses"
                      :key="index"
                      :selected="item === selectedStatus"
                    >
                      {{ item }}
                    </option>
                  </select>
                </div>
              </div>
              <div class="d-flex justify-content-end align-items-center p-4">
                <button
                  type="button"
                  class="btn btn-secondary mr-3"
                  data-dismiss="modal"
                >
                  Close
                </button>
                <button
                  type="button"
                  class="btn btn-primary bg-info"
                  @click="changeVerificationStatus"
                >
                  Save changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
import { get, patch } from "../../utilities/api"
import { debounce } from "../../utilities/globalFunctions"
import flash from "../../utilities/flash"
import DatePicker from "vue2-datepicker"
import CustomHeader from "../../components/customHeader"
import BasePagination from "../../components/Pagination/BasePagination.vue"
import "vue2-datepicker/index.css"
export default {
  props: {},

  components: { CustomHeader, DatePicker, BasePagination },

  data() {
    return {
      branch_id: "",
      creditChecks: [],
      selectedCreditCheck: {},
      selectedStatus: "",
      searchQuery: { status: "pending", searchTerm: "" },
      show: false,
      headings: [
        "Customer ID",
        "Customer Info Summary",
        "Vendor Info Summary",
        "Product Info Summary",
        "status",
        "Action",
      ],
      statuses: ["pending", "passed", "failed"],
      pageParams: {
        page: 1,
        limit: 15,
      },
    }
  },

  computed: {},
  watch: {
    "searchQuery.status": function (newVal, oldVal) {
      this.$router.push({
        query: Object.assign({}, this.$route.query, {
          ...this.searchQuery,
        }),
      })
      this.fetchData({ ...this.searchQuery })
    },
    "searchQuery.searchTerm": function (newVal) {
      this.$router.push({
        query: Object.assign({}, this.$route.query, {
          ...this.searchQuery,
        }),
      })
      this.pageParams.page = 1
      this.$router.push({
        query: { page: 1 },
      })
      debounce(this.fetchData({ ...this.searchQuery }), 500)
    },
  },
  methods: {
    fetchData(params = {}) {
      this.$scrollToTop()
      this.$LIPS(true)
      const url = "api/all/credit/checker"
      params.page = this.pageParams.page ?? 1
      params.per_page = this.pageParams.limit ?? 15
      get(url, params)
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
      if (response.queryParams !== undefined) {
        this.searchQuery = response.queryParams
      }
    },
    setSelectedCreditCheck(item) {
      this.selectedStatus = item.status
      this.selectedCreditCheck = item
    },
    async resetFilter() {
      this.searchQuery.status = ""
      this.searchQuery.searchTerm = ""

      Object.assign({}, this.$route.query)

      this.fetchData()
    },

    changeVerificationStatus() {
      this.$LIPS(true)
      patch(`api/update/credit/checker/status/${this.selectedCreditCheck.id}`, {
        status: this.selectedStatus,
      })
        .then(({ data }) => {
          flash.setSuccess(data?.message)
          this.selectedCreditCheck.status = this.selectedStatus
          this.creditChecks = this.creditChecks.filter((item) => {
            return item.status == this.selectedStatus
          })
        })
        .catch((err) => {
          flash.setError(
            "An error ocurred while updating the credit check status"
          )
        })
      this.$LIPS(false)
      $("#creditCheckModal").modal("toggle")
    },
  },

  created() {
    this.searchQuery.status = this.$route?.query?.status
    this.searchQuery.searchTerm = this.$route?.query?.searchTerm
    this.fetchData({ ...this.searchQuery })
  },
  mounted() {},

  destroyed() {
    // this.removeCustomerOptionsModalsFromDom();
  },
}
</script>

<style scoped>
.flex-row-bottom {
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  justify-content: flex-end;
}
</style>
