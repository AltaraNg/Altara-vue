<template>
  <div>
    <div class="mb-3 row attendance-item">
      <div class="col d-flex align-items-center" style="max-width: 120px">
        <span class="avatar-t mx-auto" style="max-width: 10px">{{
          index + 1
        }}</span>
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
        <b v-show="inEditMode">
          <input
            id="price"
            type="number"
            v-model="inventory.price"
            name="price"
            class="custom-select w-100"
          />
        </b>
        <b v-show="!inEditMode">
          {{ inventory.price | currency("₦") }}
        </b>
      </div>
      
      <div class="col d-flex align-items-center justify-content-center">
        {{
          inventory.inventory_status === null
            ? "N/A"
            : inventory.inventory_status.status
        }}
      </div>
      <div class="col d-flex align-items-center justify-content-center">
        {{ inventory.created_at.split("T")[0] }}
      </div>
      <div class="col d-flex align-items-center justify-content-center">
        {{ getParent(inventory.branch_id, getBranches).name }}
      </div>
      <div
        class="col d-flex align-items-center justify-content-center"
        @click="
          inventory.sold_date != ''
            ? ''
            : viewproductTransfer({
                ...inventory,
                branchName: getParent(inventory.branch_id, getBranches).name,
              })
        "
      >
        <i v-if="inventory.sold_date != ''" class="fas fa-ban"></i>
        <i v-else class="fas fa-exchange-alt"></i>
      </div>
      <div class="col d-flex align-items-center justify-content-center">
        <button class="text-center btn bg-default" @click="edit(inventory.id)">
          {{ inEditMode ? "Save" : "Edit" }}
        </button>
      </div>
    </div>

    <div class="modal fade hide repayment" id="viewProductTransfer">
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
              <div class="col d-flex align-items-center justify-content-center">
                <i class="fas fa-arrow-right"></i>
              </div>
              <div class="col d-flex align-items-center justify-content-center">
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
                      {{ transfer.created_at.split(" ")[0] || "Not Available" }}
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
  </div>
</template>
<script>
import Vue from "vue";
import { get, post } from "../../../utilities/api";
import Flash from "../../../utilities/flash";
import ResueableSearch from "../../../components/ReusableSearch";
import { mapActions, mapGetters } from "vuex";
import Vue2Filters from "vue2-filters";
import CustomHeader from "../../../components/customHeader";
import BasePagination from "../../../components/Pagination/BasePagination";
import InventorySearch from "../../../components/InventorySearch";
import renewalVue from "../../FSL/renewal/renewal.vue";
Vue.use(Vue2Filters);
export default {
  props: ["inventory", "index"],

  components: {
    CustomHeader,
    BasePagination,
    InventorySearch,
    ResueableSearch,
  },

  computed: { ...mapGetters(["getAuthUserDetails", "getBranches"]) },

  data() {
    return {
      inEditMode: false,
      suppliers: [],
      products: [],
      form: {},
      showProductTransfer: false,
      transferHistory: [],
      toId: null,
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
    getParent(id, array) {
      if(array.length > 0){
      return array.find((item) => {
        return item.id === id;
      });}
    },
    edit(item) {
      this.inEditMode = !this.inEditMode;
      console.log("this.inEditMode ", this.inEditMode, this.inventory.price);
      if (!this.inEditMode) {
        this.$emit("childToParent", {
          price: this.inventory.price,
          id: this.inventory.id,
        });
      }
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
          console.log("hello world", res);

          $(`#viewProductTransfer`).modal("toggle");
        })
        .catch(() => {
          Flash.setError("Error Occured");
        });
    },
  },

  created() {
    get("/api/supplier").then((res) => {
      this.suppliers = res.data.data.data;
    });
    get("/api/product").then((res) => {
      this.products = res.data.data.data;
    });

    this.$prepareBranches();
    // this.fetchData();
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
  box-shadow: 0 5px 9px rgba(0, 0, 0, 0.05), 0 2px 2px rgba(0, 0, 0, 0.1);
  text-align: center;
}
</style>
