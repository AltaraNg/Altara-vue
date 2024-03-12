<template>
  <div>
    <div v-if="tab === 'Log Payment'">
      <Lookup :logger="'cash'" />
    </div>
    <div class="mb-3 attendance-head">
      <resueable-search :url="url" @childToParent="prepareList" :showBranch="false" :showDate="true"
        :defaultBranch="branchId" v-if="tab === 'View Payments' || tab === 'Reconcile'">
        <template #default="{ searchQuery }">
          <div class="col-md">
            <div>
              <label class="form-control-label">Payment Method: </label>
            </div>
            <select name="category" id="category" class="custom-select" v-model="searchQuery.method">
              <option :value="type.id" :key="type.id" v-for="type in getPaymentMethods">
                {{ type.name }}
              </option>
            </select>
          </div>
          <div class="col-md">
            <div>
              <label class="form-control-label">Bank: </label>
            </div>
            <select name="bank" id="bank" class="custom-select" v-model="searchQuery.bank">
              <option :value="type.id" :key="type.id" v-for="type in getBanks">
                {{ type.name }}
              </option>
            </select>
          </div>

          <div class="col-md">
            <div>
              <label class="form-control-label">Customer: </label>
            </div>
            <input v-model="searchQuery.customer" class="custom-select">
          </div>
        </template>
      </resueable-search>
    </div>
    <div class="mt-5 mb-3 attendance-head" v-if="tab === 'View Payments' || tab === 'Reconcile'">
      <div class="row px-4 pt-3 pb-4 text-center">
        <div class="col light-heading" :key="index" v-for="(header, index) in details.headings">
          {{ header }}
        </div>
      </div>
    </div>
    <div class="tab-content mt-1 attendance-body">
      <div v-if="tab === 'View Payments'">
        <div class="mb-3 row attendance-item" :key="index" v-for="(payment, index) in renderedList" v-if="renderedList.length > 0">
          <div class="col d-flex align-items-center" style="max-width: 120px">
            <span class="user mx-auto" :class="tab">{{ index + OId }}</span>
          </div>
          <div class="col d-flex align-items-center justify-content-center">
            {{ payment.staff_id ? payment.staff_id : "Not Available" }}
          </div>
          <div class="col d-flex align-items-center justify-content-center" v-if="payment.customer">
            {{ payment.customer ? payment.customer.id : "Not Available" }}
          </div>

          <div class="col d-flex align-items-center justify-content-center">
            {{ payment.date.split(" ")[0] }}
          </div>
          <div class="col d-flex align-items-center justify-content-center">
            {{ payment.date.split(" ")[1] }}
          </div>
          <div class="col d-flex align-items-center justify-content-center">
            {{ payment.type }}
          </div>
          <div class="col d-flex align-items-center justify-content-center">
            {{ payment.method }}
          </div>
          <div class="col d-flex align-items-center justify-content-center">
            ₦{{ payment.amount }}
          </div>
          <div class="col d-flex align-items-center justify-content-center">
            {{ payment.bank !== null ? payment.bank : "Not Available" }}
          </div>

          <div class="col d-flex align-items-center justify-content-center" @click="updateModal(payment)"
            data-hoverable="true">
            <p :class="payment.comment ? 'green' : 'red'" class="overflow">
              <i class="fas fa-info-circle"></i>
            </p>
          </div>
        </div>
      </div>
      <div v-if="tab === 'Reconcile'">
        <div class="mb-3 row attendance-item" v-for="(item, index) in renderedList" :key="item.index">
          <div class="col d-flex align-items-center" style="max-width: 120px">
            <span class="user mx-auto" :class="tab" @click="updateReconciledPayment(item)">{{ index + OId }}</span>
          </div>

          <div class="col d-flex align-items-center justify-content-center">
            {{ item.payment_method }}
          </div>
          <div class="col d-flex align-items-center justify-content-center">
            {{ item.date.split(" ")[0] }}
          </div>
          <div class="col d-flex align-items-center justify-content-center">
            <span v-if="item.user">{{
      item.cash_at_hand | currency("₦")
    }}</span>
            <input @keyup="onUpKey" v-model="item.cash_at_hand" type="number" class="form-control" rows="1" v-else />
          </div>
          <div class="col d-flex align-items-center justify-content-center">
            {{ item.total | currency("₦") }}
          </div>
          <div class="col d-flex align-items-center justify-content-center">
            <span v-if="item.user">{{ item.deposited | currency("₦") }}</span>
            <input @keyup="onUpKey" v-model="item.deposited" type="number" class="form-control" rows="1" v-else />
            <!-- </input> -->
          </div>
          <div class="col d-flex align-items-center justify-content-center"
            :class="[item.total - item.deposited === 0 ? 'green' : 'red']">
            {{ (item.total - item.deposited) | currency("₦") }}
          </div>
          <div class="col d-flex align-items-center justify-content-center">
            <span class="overflow green text-center" v-if="item.user"><i class="fas fa-info-circle"></i></span>

            <textarea v-model="item.comment" v-else class="form-control" rows="1">
        </textarea>
          </div>
          <div class="
              col
              d-flex
              align-items-center
              justify-content-center
              text-center
            " @click="updateModal(item)" data-hoverable="true">
            <span :class="item.user ? 'green' : 'red'" class="overflow"><i class="fas fa-info-circle"></i></span>
          </div>
        </div>
      </div>
      <div class="modal fade repayment" id="updatePayment">
        <div class="modal-dialog" role="document">
          <div class="modal-content" v-if="showModalContent">
            <div class="modal-header py-2">
              <h6 class="modal-title py-1">Comment</h6>
              <a aria-label="Close" class="close py-1" data-dismiss="modal">
                <span aria-hidden="true" class="modal-close text-danger">
                  <i class="fas fa-times"></i>
                </span>
              </a>
            </div>
            <div class="modal-body">
              <div v-if="tab === 'Reconcile'">
                <div class="table-responsive">
                  <table class="table table-bordered table-striped">
                    <tbody>
                      <tr>
                        <th>Branch Name</th>
                        <td>{{ paymentItem.branch || "Not Available" }}</td>
                      </tr>

                      <tr>
                        <th>Comment</th>
                        <td>
                          {{
      !paymentItem.comment
        ? "Not Available"
        : paymentItem.comment.comment
    }}
                        </td>
                      </tr>
                      <tr>
                        <th>Reconciler</th>
                        <td>
                          {{
        !paymentItem.user
          ? "Not Available"
          : paymentItem.user
      }}
                        </td>
                      </tr>
                      <tr>
                        <th>Date</th>
                        <td>
                          {{
        paymentItem.date
          ? paymentItem.date.split(" ")[0]
          : "Not Available"
      }}
                        </td>
                      </tr>
                      <tr>
                        <th>Time</th>
                        <td>
                          {{
        paymentItem.date
          ? paymentItem.date.split(" ")[1]
          : "Not Available"
      }}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div v-else>
                <div class="table-responsive">
                  <table class="table table-bordered table-striped">
                    <tbody>
                      <tr>
                        <th>Branch Name</th>
                        <td>{{ paymentItem.branch || "Not Available" }}</td>
                      </tr>

                      <tr v-if="paymentItem.customer">
                        <th>Customer ID</th>
                        <td>
                          {{ paymentItem.customer.id || "Not Available" }}
                        </td>
                      </tr>

                      <tr>
                        <th>Payment Number</th>
                        <td>
                          {{ paymentItem.payment_number || "Not Available" }}
                        </td>
                      </tr>

                      <tr>
                        <th>Comment</th>
                        <td>
                          {{
      !paymentItem.comment
        ? "Not Available"
        : paymentItem.comment.comment
                          }}
                        </td>
                      </tr>

                      <tr>
                        <th>Date</th>
                        <td>
                          {{
                          paymentItem.date
                          ? paymentItem.date.split(" ")[0]
                          : "Not Available"
                          }}
                        </td>
                      </tr>
                      <tr>
                        <th>Time</th>
                        <td>
                          {{
                          paymentItem.date
                          ? paymentItem.date.split(" ")[1]
                          : "Not Available"
                          }}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <a class="text-link mt-3 w-100" data-dismiss="modal" href="javascript:" style="text-align: right">close
                dialogue</a>
            </div>
          </div>
        </div>
      </div>
    </div>
    <nav v-if="tab !== 'Log Payment'">
      <div v-if="pageParams">
        <base-pagination :page-param="pageParams" @fetchData="fetchList(list)">
        </base-pagination>
      </div>
    </nav>
  </div>
</template>

<script>
import Vue from "vue";
import { mapGetters } from "vuex";
import { get, put } from "../utilities/api";
import Lookup from "../views/FSL/lookup/lookup";
import Flash from "../utilities/flash";
import Vue2Filters from "vue2-filters";
import ResueableSearch from "../components/ReusableSearch.vue";

import BasePagination from "../components/Pagination/BasePagination";
import queryParam from "../utilities/queryParam";

Vue.use(Vue2Filters);

export default {
  components: { Lookup, BasePagination, ResueableSearch },
  props: {
    list: { default: null },
    tab: { default: null },
    filterBy: { default: null },
  },

  watch: {
    tab: function (tab) {
      if (tab === "View Payments") {
        this.url = "/api/payment";
      } else {
        this.url = "/api/payment-reconcile";
      }
      this.fetchList(tab);
    },
    filterBy: function (filterBy) {
      this.defaultList =
        this.tab === "View Payments"
          ? this.paymentList
          : this.paymentReconciliationList;
      let newList = [];
      let n = Object.keys(filterBy)[0];
      if (n === "branch") {
        if (filterBy.branch === "all") {
          newList = this.defaultList;
        } else {
          newList = this.defaultList.filter(function (item) {
            return item.branch === filterBy.branch;
          });
        }
      } else if (n === "type") {
        if (filterBy.type === "all") {
          newList = this.defaultList;
        } else {
          let cond = this.tab === "View Payments";
          newList = this.defaultList.filter(function (item) {
            if (cond) {
              return item.method === filterBy.type;
            } else {
              return item.payment_method === filterBy.type;
            }
          });
        }
      } else {
        newList = this.defaultList.filter(function (item) {
          return item.date.split(" ")[0] === filterBy.date;
        });
      }

      Vue.set(this.$data, "renderedList", newList);
    },
  },

  data() {
    return {
      OId: 0,
      page: 1,
      responseData: {},
      paymentItem: {},
      url: null,
      showModalContent: false,
      paymentList: [],
      pageParams: {},
      paymentReconciliationList: [],
      totalCashAtHand: 0,
      variance: "",
      amountInBank: "",
      branchId: localStorage.getItem("branch_id"),
      comment: {
        comment: "",
      },
      searchQuery: {},
      renderedList: [],
      defaultList: [],
      reconcileForm: {},
    };
  },

  computed: {

    details() {
      let list = 1;
      const tabs = ["Log Payment", "View Payments", "Reconcile"];
      const headings2 = [
        "index",
        "Type",
        "Date",
        "Cash In Hand",
        "Total",
        "Amount Bank",
        "Variance",
        "Comment",
        "Status",
      ];
      const headings1 = [
        "index",
        'Staff ID',
        "Customer ID",
        "Date of Payment",
        "Time of Payment",
        "Payment Purpose",
        "Payment Method",
        "Amount Paid",
        "Bank",
        "Comment",
      ];
      const headings =
        this.tab === "View Payments"
          ? headings1
          : this.tab === "Reconcile"
            ? headings2
            : "";
      return { tabs, headings, list };
    },
    ...mapGetters([
      "auth",
      "getAuthUserDetails",
      "getPaymentMethods",
      "getBanks",
    ]),
  },

  methods: {
    onUpKey() {
      this.variance = this.amountInBank - this.totalCashAtHand;
      this.amountInBank.length === 0 ? (this.variance = 0) : this.variance;
    },

    fetchList(list) {
      this.$LIPS(true);
      list === "View Payments"
        ? this.getPaymentList()
        : list === "Reconcile"
          ? this.getPaymentReconciliationList()
          : this.$LIPS(false);
    },
    prepareList(response) {
      let {
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
      } = response.data;
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
      });
      this.renderedList = data;
      this.OId = from;
      this.$LIPS(false);
      this.searchQuery = response.queryParams;

    },

    async getPaymentList() {
      this.$LIPS(true);
      try {

        let param = {
          page: this.pageParams.page ? this.pageParams.page : "",
          limit: this.pageParams.limit ? this.pageParams.limit : "",
          branch: localStorage.getItem("branch_id"),
          ...this.searchQuery,
        };
        if (this.$route.query) {
          param = { ...param, ...this.$route.query };
        }
        const fetchPaymentList = await get(this.url + queryParam(param));
        this.prepareList(fetchPaymentList.data);



      } catch (err) {
        this.$displayErrorMessage(err);
      }
      finally {
        this.$LIPS(false);
      }
    },

    async getPaymentReconciliationList() {
      this.branchId = localStorage.getItem("branch_id");
      let yesterday = new Date(Date.now() - 864e5).toISOString();
      let previous = new Date("feb 1, 2019").toISOString(); // ** used an arbitrary date needed by the api
      let from = previous.slice(0, 10);
      let to = yesterday.slice(0, 10);

      try {
        let param = {
          page: this.pageParams.page ? this.pageParams.page : "",
          limit: this.pageParams.limit ? this.pageParams.limit : "",
          branch: localStorage.getItem("branch_id"),
          to: to,
          from: from,
          ...this.searchQuery,
        };
        if (this.$route.query) {
          param = { ...param, ...this.$route.query };
        }
        const fetchPaymentReconciliation = await get(
          this.url + queryParam(param)
        );
        this.prepareList(fetchPaymentReconciliation.data);
        this.totalCashAtHand = this.renderedList
          .map((item) => item.total)
          .reduce((a, b) => a + b);
        this.$LIPS(false);
      } catch (err) {
        this.$displayErrorMessage(err);
      }
    },

    async updateReconciledPayment(item) {
      if (!item.deposited) {
        return this.errHandler("Please enter all required values.");
      }
      const data = {
        cash_at_hand: item.cash_at_hand,
        deposited: item.deposited,
        comment: item.comment,
      };
      this.$LIPS(true);
      try {
        const reconcilePayment = await put(
          `/api/payment-reconcile/${item.id}`,
          data
        );
        if (reconcilePayment) {
          this.$swal({
            icon: "success",
            title: "Reconciliation done successfully",
          });
          this.getPaymentReconciliationList();
        }

        this.$LIPS(false);
      } catch (err) {
        this.$LIPS(false);
        this.$displayErrorMessage(err);
      }
    },

    errHandler(param) {
      return Flash.setError(param);
    },

    updateModal(data) {
      this.showModalContent = true;
      this.paymentItem = data;
      return $(`#updatePayment`).modal("toggle");
    },

    next(firstPage = null) {
      if (this.responseData.next_page_url) {
        this.page = firstPage ? firstPage : parseInt(this.page) + 1;
        this.fetchList(this.list);
      }
    },

    prev(lastPage = null) {
      if (this.responseData.prev_page_url) {
        this.page = lastPage ? lastPage : parseInt(this.page) - 1;
        this.fetchList(this.list);
      }
    },
  },

  mounted() {
    this.fetchList(this.list);
  },

  created() {
    this.$prepareBanks();
    this.$prepareBranches();
    this.$preparePaymentMethods();
  },
};
</script>

<style scoped type="scss">
.table-separator {
  border-top: 2px solid #dee1e4;
}

.overflow {
  width: 80px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.green {
  color: #00a368;
}

.red {
  color: #e30000;
}

.blue {
  background-color: #2975a5;
}

.Current {
  background: #edeef2;
}

.Successful {
  background-color: rgba(0, 163, 104, 0.09);
  color: #00a368;
}
</style>
