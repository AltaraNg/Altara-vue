<template>
  <transition name="fade">
    <div id="reminder" class="attendance">
      <custom-header :title="'Inventory Overview'" />

      <div class="mt-5 mb-3 attendance-head row">
        <div class="col-md-8">
                     <resueable-search
                      @childToParent="prepareList"
                      :url="urlToFetchOrders"
                      
                      :showDate="false"
                      >
            <template #default= "{ searchQuery }">
                <div class="col-md">
                    <div>
                    <label class="form-control-label">Name:  </label>
                    </div>
                    <input type="text" v-model="searchQuery.productName" class="form-control">
                </div> 
                <div class="col-md">
                    <div>
                    <label class="form-control-label">SKU:  </label>
                    </div>
                    <input type="text" v-model="searchQuery.sku" class="form-control">
                </div> 

                <div class="col-md">
                    <div>
                    <label class="form-control-label">Status:  </label>
                    </div>
                    <select name="status" id="status" class="custom-select" v-model="searchQuery.status">
                        <option :value="item.id" v-for="item in status" :key="item.id">
                            {{item.status}}
                        </option>
                    </select>
                </div>              
            </template>
          </resueable-search>
                </div>

                 <div class="col-md">
          <router-link :to="{ name: 'inventoryCreate' }">
            <button class="btn btn-primary bg-default myBtn float-right my-2">
              + New Inventory
            </button>
          </router-link>
        </div>
                
      </div>
      <div v-if="inventories.length > 0">
      <div class="mt-5 mb-3 attendance-head" >
        <div class="w-100 my-5 mx-0 hr"></div>
        <div class="row px-4 pt-3 pb-4 text-center">
          <div class="col light-heading" style="max-width: 120px">S/N</div>
          <div class="col light-heading" v-for="header in headings">
            {{ header }}
          </div>
        </div>
      </div>
      <div class="tab-content mt-1 attendance-body">
        <div
          class="mb-3 row attendance-item"
          :key="index"
          v-for="(inventory, index) in inventories"
          
        >
          <div class="col d-flex align-items-center" style="max-width: 120px">
            <span class="user mx-auto">{{ index + OId }}</span>
          </div>
          <div
            class="col d-flex align-items-center justify-content-center"
            @click="viewInventory(inventory)"
          >
            {{ inventory.product_name }}
          </div>
          <div class="col d-flex align-items-center justify-content-center">
            {{ inventory.inventory_sku }}
          </div>
          <div class="col d-flex align-items-center justify-content-center">
            {{ inventory.price | currency("₦") }}
          </div>
          <div class="col d-flex align-items-center justify-content-center">
            {{ getParent(inventory.supplier_id, suppliers).name }}
          </div>
          <div class="col d-flex align-items-center justify-content-center">
            {{
              inventory.inventory_status === null
                ? "null"
                : inventory.inventory_status.status
            }}
          </div>
          <div class="col d-flex align-items-center justify-content-center">
            {{ convertDate(inventory.created_at) }}
          </div>
          <div class="col d-flex align-items-center justify-content-center">
            {{ getParent(inventory.branch_id, getBranches).name }}
          </div>
          <div
            class="col d-flex align-items-center justify-content-center"
            v-if="inventory.inventory_status !== null"
          >
            <div
              v-if="
                inventory.inventory_status.status === 'Available' ||
                inventory.inventory_status.status === 'Repossessed'
              "
              class="col d-flex align-items-center justify-content-center"
              @click="
                viewproductTransfer({
                  ...inventory,
                  branchName: getParent(inventory.branch_id, getBranches).name,
                })
              "
            >
              <i class="fas fa-exchange-alt"></i>
            </div>
            <div
              v-else
              class="col d-flex align-items-center justify-content-center"
            >
              <i class="fa fa-ban" aria-hidden="true"></i>
            </div>
          </div>
          <div
            class="col d-flex align-items-center justify-content-center"
            v-else
          >
            <i class="fa fa-ban" aria-hidden="true"></i>
          </div>
        </div>
      </div>
      </div>
      <div v-else class="mt-5 mb-3 attendance-head display-4">
        <display-empty :name="'inventory'" />
      </div>
      <div class="modal fade repayment" id="viewInventory">
        <div class="modal-dialog" role="document">
          <div class="modal-content" v-if="showModalContent">
            <div class="modal-header1">
              <h4 class="text-white">{{ inventoryItem.sku }} Summary</h4>
              <a aria-label="Close" class="close py-1" data-dismiss="modal">
                <span aria-hidden="true" class="modal-close text-white">
                  <i class="fas fa-times"></i>
                </span>
              </a>
            </div>
            <div class="modal-body px-5">
              <div class="table-responsive">
                <table class="table table-bordered table-striped">
                  <tbody>
                    <tr>
                      <th>Product Name</th>
                      <td>
                        {{ inventoryItem.product_name || "Not Available" }}
                      </td>
                    </tr>

                    <tr>
                      <th>SKU</th>
                      <td>
                        {{ inventoryItem.inventory_sku || "Not Available" }}
                      </td>
                    </tr>

                    <tr>
                      <th>Received By</th>
                      <td>
                        {{ inventoryItem.receiver_id || "Not Available" }}
                      </td>
                    </tr>

                    <tr>
                      <th>Received Date</th>
                      <td>
                        {{
                          inventoryItem.updated_at.split(" ")[0] ||
                          "Not Available"
                        }}
                      </td>
                    </tr>
                    <tr>
                      <th>Sold Date</th>
                      <td>
                        {{
                          inventoryItem.sold_date.split(" ")[0] ||
                          "Not Sold Yet"
                        }}
                      </td>
                    </tr>

                    <tr>
                      <th>Status</th>
                      <td>
                        {{
                          inventoryItem.inventory_status === null
                            ? "null"
                            : inventoryItem.inventory_status.status
                        }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div class="modal-footer justify-content-center">
              <button
                class="text-center btn bg-default"
                @click="edit(inventoryItem.id)"
              >
                Edit
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="modal fade repayment" id="viewProductTransfer">
        <div class="modal-dialog" role="document">
          <div class="modal-content" v-if="showProductTransfer">
            <div class="modal-header py-2">
              <h4>Product Transfer.</h4>
              <a aria-label="Close" class="close py-1" data-dismiss="modal">
                <span aria-hidden="true" class="modal-close text-danger">
                  <i class="fas fa-times"></i>
                </span>
              </a>
            </div>
            <div class="modal-body px-5">
              Transfer ({{ transferItem.product_name || "Not Available" }})
              <div class="mb-3 row attendance-item">
                <div
                  class="col d-flex align-items-center"
                  style="max-width: 120px"
                >
                  From: {{ transferItem.branchName || "Not Available" }}
                </div>
                <div
                  class="col d-flex align-items-center justify-content-center"
                >
                  <i class="fas fa-arrow-right"></i>
                </div>
                <div
                  class="col d-flex align-items-center justify-content-center"
                >
                  To:
                  <select v-model="toId" class="form-control option2">
                    <option disabled value>Please select a branch</option>
                    <option
                      :key="option.id"
                      v-for="option in transferList"
                      v-bind:value="option.id"
                    >
                      {{ option.name }}
                    </option>
                  </select>
                </div>
              </div>
              <h4>Transfer History.</h4>
              <div class="table-responsive">
                <table class="table table-bordered table-striped">
                  <tbody>
                    <tr>
                      <th>From</th>
                      <th>To</th>
                      <th>Date Of Transfer</th>
                      <th>Transferor</th>
                    </tr>
                    <h4 v-if="transferHistory.length < 1" class="text-center">
                      No history available.
                    </h4>
                    <tr v-for="transfer in transferHistory">
                      <td>{{ transfer.from || "Not Available" }}</td>
                      <td>{{ transfer.to || "Not Available" }}</td>
                      <td>
                        {{
                          transfer.created_at.split(" ")[0] || "Not Available"
                        }}
                      </td>
                      <td>{{ transfer.user || "Not Available" }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div class="modal-footer justify-content-center">
              <button
                class="text-center btn bg-default"
                @click="logTransfer(transferItem.id, toId)"
              >
                Transfer
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-if="pageParams">
        <base-pagination
          :page-param="pageParams"          
          @fetchData="fetchData()"          
        ></base-pagination>
      </div>
    </div>
  </transition>
</template>
<script>
import Vue from "vue";
import { get, post } from "../../../utilities/api";
import Flash from "../../../utilities/flash";

import { mapActions, mapGetters } from "vuex";
import Vue2Filters from "vue2-filters";
import CustomHeader from "../../../components/customHeader";
import DisplayEmpty from "../../../components/DisplayEmpty";
import BasePagination from "../../../components/Pagination/BasePagination";
import InventorySearch from "../../../components/InventorySearch";
import ResueableSearch from '../../../components/ReusableSearch.vue';
Vue.use(Vue2Filters);
export default {
  props: {
    //TODO::verify if its necessary to make this a prop
    withBranchFilter: { default: true },
    urlToFetchOrders: { default: "/api/inventory" },
  },

  components: { CustomHeader, BasePagination, InventorySearch, ResueableSearch, DisplayEmpty },

  computed: { ...mapGetters(["getAuthUserDetails", "getBranches"]) },

  data() {
    return {
      branch_id: "",
      OId: null,
      showModalContent: false,
      showProductTransfer: false,
      pageParams: {},
      page_size: 10,
      products: [],
      suppliers: [],
      date_from: null,
      date_to: null,
      page: 1,
      searchFilter: {},
      filters: [],
      transferList: [],
      inventories: null,
      inventoryItem: null,
      response: {},
      transferItem: {},
      toId: 0,
      // searchQ:'',
      show: false,
      headings: [
        "Product Name",
        "SKU",
        "Price",
        "Supplier",
        "Status",
        "Date Received",
        "Branch",
        "Transfer",
      ], 
      status: [],     
      searchColumns: [{ title: "Product Name", column: "productName" }],
      transferHistory: [],
      branchId: "",
    };
  },

  methods: {
    logTransfer(id, to) {
      this.$LIPS(true);

      post("/api/product_transfer", { to_id: to, inventory_id: id })
        .then((res) => {
          this.$LIPS(false);
          this.$swal({
            icon: "success",
            title: "Transfer Successfully Logged",
          });
          $(`#viewProductTransfer`).modal("toggle");
          this.fetchData();
        })
        .catch(() => {
          this.$LIPS(false);
          Flash.setError("Error submitting form");
        });
    },
    viewproductTransfer(data) {
      this.$LIPS(true);

      this.transferItem = data;

      this.transferList = this.getBranches.filter((branch) => {
        return branch.name !== this.transferItem.branchName;
      });
      this.showProductTransfer = true;
      get(`/api/product_transfer?inventoryId=${data.id}`)
        .then((res) => {
          this.transferHistory = res.data.data.data;
          this.$LIPS(false);

          $(`#viewProductTransfer`).modal("toggle");
        })
        .catch(() => {
          Flash.setError("Error Occured");
        });
    },
    fetchData() {
      
      this.$LIPS(true);
      let { page, page_size } = this.$data;
      get(
        this.urlToFetchOrders +`${!!this.pageParams.page ? `?page=${this.pageParams.page}` : ""}` +
          `${!!this.pageParams.limit ? `&limit=${this.pageParams.limit}` : ""}`
      )
        .then(({ data }) => this.prepareList(data))
        .catch(() => Flash.setError("Error Preparing form"))
        .finally(() => {
          this.$LIPS(false);
        });
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
      this.inventories = data;
      this.OId = from;
      this.$LIPS(false);
    },

    getParent(id, array) {
      if(array === null){
        array = []
      }
      let res =  array.find((item) => {
        return item.id === id;
      });
      if(res === undefined){
        return {}
      }
      return res;
    },

    next(firstPage = null) {
      if (this.pageParams.next_page_url) {
        this.page = firstPage ? firstPage : parseInt(this.page) + 1;
        this.fetchData();
      }
    },

    convertDate(date){
                let utcDate = new Date(date).toUTCString();
                return utcDate;

            },

    prev(lastPage = null) {
      if (this.pageParams.prev_page_url) {
        this.page = lastPage ? lastPage : parseInt(this.page) - 1;
        this.fetchData();
      }
    },

    viewInventory(inventory) {
      this.showModalContent = true;
      this.inventoryItem = inventory;
      return $(`#viewInventory`).modal("toggle");
    },

    edit(item) {
      this.$LIPS(true);
      this.showModalContent = false;
      $(`#viewInventory`).modal("toggle");

      return this.$router.push({ name: "inventoryEdit", params: { id: item } });
    },

    searchEvent(data) {
      get(this.urlToFetchOrders + data)
        .then(({ data }) => this.prepareList(data))
        .catch(() => Flash.setError("Error Preparing form"));
    },

    ...mapActions("ModalAccess", [
      "addCustomerOptionsModalsToDom",
      "removeCustomerOptionsModalsFromDom",
    ]),
  },

  created() {
    get("/api/supplier").then((res) => {
      this.suppliers = res.data.data.data;
    });
    get("/api/product").then((res) => {
      this.products = res.data.data.data;
    });
    get("/api/inventory_status").then((res) => {
      this.status = res.data.data.data;
    });

    this.$prepareBranches();
    this.fetchData();
  },

  filters: {
    status: function (value) {
      if (value === 1) {
        return "Active";
      } else return "Inactive";
    },
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
.green {
  color: green;
}
.red {
  color: red;
}
.searchBar {
  background-color: #fff;
  border-radius: 7px;
  padding: 20px;
}
.margin_left {
  margin-left: 20px;
}
.margin_left1 {
  margin-left: 25px;
}
.hCard {
  background: #2975a5;
  mix-blend-mode: normal;
  border-radius: 5px;
  padding: 35px 20px;
  margin: 20px auto;
  color: #fff;
  height: 140px;
  width: 326px;
}
.wCard {
  background: red;
  height: 70px;
  width: 70px;
}
.pad_0 {
  padding: 0 !important;
}
.pad_0_right {
  padding-right: 0 !important;
}
.mar_0 {
  margin: 0 !important;
}
.modal-header1 {
  border-bottom: none;

  padding-bottom: 0;
  padding-left: 24px;
  padding-right: 24px;
  background: #2975a5;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
