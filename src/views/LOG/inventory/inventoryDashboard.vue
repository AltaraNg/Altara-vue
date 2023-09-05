<template>
  <transition name="fade">
    <div id="reminder" class="attendance">
      <custom-header :title="'Inventory Overview'" />
      <div class="row">
        <div class="col-md">
          <div class="hCard">
            <h3 class="mar_0">Total</h3>
            <h3 class="mar_0">{{ summary.total }}</h3>
          </div>
        </div>
        <div class="col-md">
          <div class="hCard">
            <h3 class="mar_0">Total Worth</h3>
            <h3 class="mar_0">{{ summary.total_worth | currency("₦") }}</h3>
          </div>
        </div>
        <div class="col-md">
          <div class="hCard">
            <h3 class="mar_0">Total Sold</h3>
            <h3 class="mar_0">{{ summary.total_sold }}</h3>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-md">
          <div class="hCard">
            <h3 class="mar_0">Total On DIsplay</h3>
            <h3 class="mar_0">0</h3>
          </div>
        </div>
        <div class="col-md">
          <div class="hCard">
            <h3 class="mar_0">Total Repossessed</h3>
            <h3 class="mar_0">{{ summary.total_repossessed }}</h3>
          </div>
        </div>
        <div class="col-md">
          <div class="hCard">
            <h3 class="mar_0">Transfers</h3>
            <h3 class="mar_0">{{ summary.total_transfer }}</h3>
          </div>
        </div>
      </div>
      <div class="mt-2 mt-lg-3 row attendance-head">
        <div class="col-md-10">
          <resueable-search
            @childToParent="prepareList"
            :url="urlToFetchOrders"
          >
            <template #default="{ searchQuery }">
              <div class="col-md">
                <div>
                  <label class="form-control-label">Product Name: </label>
                </div>
                <input
                  type="text"
                  v-model="searchQuery.productName"
                  class="form-control"
                />
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

      <div class="mt-2 mt-lg-3 row attendance-head attendance-view">
        <div
          class="col-4 col-lg"
          v-for="{ name: filter, model } in filters"
          :key="model"
        >
          <div>
            <div class="light-heading mb-1">
              <span class="d-none d-sm-inline">Select</span>
              {{ filter | capitalize }}
            </div>
          </div>
        </div>
      </div>

      <div class="mt-5 mb-3 attendance-head">
        <div class="w-100 my-5 mx-0 hr"></div>
        <div class="row px-4 pt-3 pb-4 text-center">
          <div class="col light-heading" style="max-width: 120px">S/N</div>
          <div
            class="col light-heading"
            v-for="header in headings"
            :key="header"
          >
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
            <span class="user mx-auto">{{ index + 1 }}</span>
          </div>
          <div
            class="col d-flex align-items-center justify-content-center"
            @click="viewInventory(inventory.inventories)"
          >
            {{ inventory.name }}
          </div>
          <div class="col d-flex align-items-center justify-content-center">
            {{ inventory.product_type }}
          </div>
          <div class="col d-flex align-items-center justify-content-center">
            {{ inventory.category }}
          </div>
          <div class="col d-flex align-items-center justify-content-center">
            {{ inventory.brand }}
          </div>
          <div class="col d-flex align-items-center justify-content-center">
            {{
              inventory.inventories
                .map((v) => v.price)
                .reduce((sum, val) => sum + val, 0) | currency("₦")
            }}
          </div>
          <div class="col d-flex align-items-center justify-content-center">
            {{
              inventory.inventories.filter((data) =>
                !data.inventory_status
                  ? null
                  : data.inventory_status.status === "Available"
              ).length
            }}
          </div>
        </div>
      </div>
      <div class="modal fade hide repayment" id="viewInventory">
        <div class="modal-dialog modal-xl" role="document">
          <div class="modal-content" v-if="showModalContent">
            <div class="modal-header1">
              <div class="row text-center">
                <div
                  class="col white-text light-heading"
                  style="max-width: 120px"
                >
                  S/N
                </div>
                <div
                  class="col light-heading"
                  v-for="header in headings0"
                  :key="header"
                >
                  <div class="white-text">{{ header }}</div>
                </div>
              </div>
            </div>
            <div class="modal-body">
              <div :key="index" v-for="(inventory, index) in inventoryItem">
                <editComponent
                  v-bind:inventory="inventory"
                  v-bind:index="index"
                  @childToParent="edit"
                ></editComponent>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- <div v-if="pageParams">
        <base-pagination
          :page-param="pageParams"
          :page="page"
          @fetchData="fetchData()"
          @next="next()"
          @prev="prev()"
        ></base-pagination>
      </div> -->
      <br />
    </div>
  </transition>
</template>
<script>
  import Vue from "vue";
  import { get, post, put } from "../../../utilities/api";
  import Flash from "../../../utilities/flash";
  import ResueableSearch from "../../../components/ReusableSearch";
  import { mapActions, mapGetters } from "vuex";
  import Vue2Filters from "vue2-filters";
  import CustomHeader from "../../../components/customHeader";
  import editComponent from "./editComponent";
  Vue.use(Vue2Filters);
  export default {
    props: {
      //TODO::verify if its necessary to make this a prop
      withBranchFilter: { default: true },
      urlToFetchOrders: { default: "/api/inventory-summary" },
    },

    components: {
      CustomHeader,
      ResueableSearch,
      editComponent,
    },

    computed: { ...mapGetters(["getAuthUserDetails", "getBranches"]) },

    data() {
      return {
        branch_id: "",
        OId: null,
        showModalContent: false,
        showProductTransfer: false,
        pageParams: null,
        page_size: 10,
        products: [],
        suppliers: [],
        date_from: null,
        date_to: null,
        page: 1,
        searchFilter: {},
        filters: [],
        transferList: [],
        inventories: [],
        inventoryItem: null,
        response: {},
        summary: {},
        transferItem: {},
        toId: 0,
        // searchQ:'',
        show: false,
        headings: [
          "Product Name",
          "Product Type",
          "Product Category",
          "Product Brand",
          "Total Worth",
          "Total Available",
        ],
        headings0: [
          "Product Name",
          "SKU",
          "Price",
          "Status",
          "Date Received",
          "Branch",
          "Transfer",
          "Edit",
        ],
        searchColumns: [
          { title: "Product Name", test: "", column: "productName" },
        ],
        transferHistory: [],
        branchId: "",
        editable: false,
        form: {},
      };
    },

    methods: {
      logTransfer(id, to) {
        this.$LIPS(true);

        post("/api/product_transfer", { to_id: to, inventory_id: id })
          .then(() => {
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
        this.$scrollToTop();
        this.$LIPS(true);
        get(this.urlToFetchOrders)
          .then(({ data }) => this.prepareList(data))
          .catch(() => Flash.setError("Error Preparing form"));
      },

      prepareList(response) {
        let {
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
        this.inventories = response.data.products
          ? response.data.products
          : response.data.data.products;
        this.summary = response.data.summary
          ? response.data.summary
          : response.data.data.summary;

        this.OId = from;
        this.$LIPS(false);
      },

      getParent(id, array) {
        return array.find((item) => {
          return item.id === id;
        });
      },

      next(firstPage = null) {
        if (this.pageParams.next_page_url) {
          this.page = firstPage ? firstPage : parseInt(this.page) + 1;
          this.fetchData();
        }
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
        if (this.$network()) {
          this.$LIPS(true);
          put(`/api/inventory/${item.id}`, { price: item.price })
            .then(() => {
              this.$LIPS(false);
              this.$swal({
                icon: "success",
                title: "Inventory Updated Successfully",
              });
            })
            .catch(() => {
              this.$LIPS(false);
              this.$swal({
                icon: "error",
                title: "Inventory Updated Failed",
              });
            });
        } else this.$networkErr();
      },

      searchEvent(data) {
        this.$LIPS(true);

        get(this.urlToFetchOrders + data)
          .then(({ data }) => {
            this.$LIPS(false);
            this.prepareList(data);
          })
          .catch(() => {
            this.$LIPS(false);
            Flash.setError("Error Preparing form");
          });
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
    width: 100%;
    padding-bottom: 0;
    padding: 24px;
    background: #2975a5;
    color: #fff;
  }
  .white-text {
    color: #fff;
  }
  .avatar-t {
    background-color: whitesmoke;
    color: darkgray;
    box-shadow:
      0 5px 9px rgba(0, 0, 0, 0.05),
      0 2px 2px rgba(0, 0, 0, 0.1);
    text-align: center;
  }
</style>
