<template>
  <div>
    <div class="modal-header py-2">
      <h6 class="modal-title py-1">
        Repayment Plan/Summary - {{ customer.employment_status | capitalize }}
      </h6>
      <a aria-label="Close" class="close py-1" data-dismiss="modal">
        <span aria-hidden="true" class="modal-close text-danger">
          <i class="fas fa-times"></i>
        </span>
      </a>
    </div>
    <div class="modal-body">
      <div class="table-responsive">
        <h5 class="mt-3 mb-0">Order Information</h5>
        <table class="table table-bordered">
          <tbody>
            <tr class="table-separator">
              <td>Name</td>
              <td>Order Id</td>
              <td>Product</td>
              <td>Owner</td>
              <td>Serial No</td>
              <th>Branch</th>
              <th>Status</th>
            </tr>
            <tr>
              <td class="font-weight-bold">
                {{ `${customer.first_name} ${customer.last_name}` }}
              </td>
              <th>{{ order.order_number }}</th>
              <th>{{ order.product.name }}</th>
              <th>{{ order.owner }}</th>
              <th>{{ order.serial_number }}</th>
              <td class="font-weight-bold">{{ order.branch }}</td>
              <td class="font-wight-bold td-back">ok</td>
              <!-- <td
                        :class="getOrderStatusClass(getOrderStatus(order))"
                        class="font-weight-bold"
                      >{{getOrderStatus(order)}}</td> -->
            </tr>
          </tbody>
        </table>
        <h5 class="mt-5 mb-0">Amortization Schedule</h5>
        <div class="amor-table">
          <table class="table table-bordered">
            <tbody class="text-center">
              <tr>
                <th>Repayment</th>
                <td
                  v-for="(armor, index) in amortizationData"
                  v-html="index + 1"
                ></td>
              </tr>
              <tr class="table-separator">
                <th>Due Date</th>
                <td v-for="armo in amortizationData">
                  {{ armo.expected_payment_date }}
                </td>
              </tr>
              <tr>
                <th>Actual Pay Day</th>
                <td v-for="armo in amortizationData">
                  {{ armo.actual_payment_date }}
                </td>
              </tr>
              <tr class="table-separator status-row">
                <th>Status</th>
                <td v-for="armo in amortizationData">
                  <div v-if="armo.actual_payment_date" class="green">
                    <i class="fa fa-check"></i>
                  </div>
                  <div
                    v-else-if="
                      Date.parse(armo.expected_payment_date) < Date.now()
                    "
                    class="red"
                  >
                    <i class="fa fa-times"></i>
                  </div>
                </td>
              </tr>
              <tr class="table-separator">
                <th>Repayment Amount</th>
                <td v-for="armo in amortizationData">
                  {{ $formatCurrency(armo.expected_amount) }}
                </td>
              </tr>
              <tr>
                <th>Actual Amount Paid</th>
                <td
                  v-for="(armo, index) in amortizationData"
                  @click="updateAmmo(armo, index)"
                >
                  {{ $formatCurrency(armo.actual_amount) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <h5 class="mt-5 mb-0">Payment Summary</h5>
        <table class="table table-bordered">
          <tbody class="text-center">
            <tr class="table-separator">
              <td class="text-left">Discount Detail (%)</td>
              <th>
                {{
                  order.discount[0]
                    ? order.discount[0].name
                    : "Null" | capitalize
                }}
              </th>
              <td>Total Before Discount</td>
              <th>{{ $formatCurrency($roundDownAmt(order.product_price)) }}</th>
              <td>Total Paid (+discount)</td>
              <th>{{ order.amountPaid }}</th>
            </tr>
            <tr>
              <td class="text-left">Discount Amount</td>
              <th>{{ order.discountAmount || "null" }}</th>
              <td>Total After Discount</td>
              <th>{{ order.discountedTotal || "null" }}</th>
              <td>Total Debt</td>
              <th>
                {{ $formatCurrency(calcDebt(order.amortization)) || "null" }}
              </th>
            </tr>
            <tr>
              <td class="text-left">Down Payment</td>
              <th>{{ $formatCurrency($roundDownAmt(order.down_payment)) }}</th>
              <td>Total Plus Default Fee</td>
              <th>{{ $formatCurrency($roundDownAmt(order.product_price)) }}</th>
              <td>Default Fee</td>
              <th>{{ order.defaultFee || "null" }}</th>
            </tr>
          </tbody>
        </table>
        <div v-if="standAlone === false">
          <div v-if="completed === false">
            <LogForm
              :amortizationData="amortizationData"
              :customerId="customer.id"
              :orderId="order.id"
              @done="this.done"
            />
          </div>
        </div>
      </div>
    </div>
    <div
      :class="{ 'd-flex justify-content-end': !canEditPayment || isReadOnly }"
      class="modal-footer"
    >
      <a
        class="text-link mt-3"
        data-dismiss="modal"
        href="javascript:"
        style="text-align: right"
        >close dialogue</a
      >
    </div>
    <div class="modal fade repayment" id="viewEdit">
      <div class="modal-dialog" role="document">
        <div class="modal-content" v-if="showModal">
          <div>
            <h5>Update Amortization</h5>

            <div class="card">
              <form class="card-body" @submit.prevent="save">
                <div class="row">
                  <div class="col form-group">
                    <label for="amount" class="form-control-label"
                      >Actual Amount</label
                    >
                    <br />
                    <input
                      name="ammo"
                      class="custom-select"
                      v-model="ammo_item.actual_amount"
                    />
                  </div>
                  <div class="col form-group">
                    <label for="amount" class="form-control-label"
                      >Actual Payment Date</label
                    >
                    <date-picker
                      class="w-100"
                      v-model="ammo_item.actual_payment_date"
                      valueType="format"
                      placeholder="Date"
                    ></date-picker>
                  </div>
                </div>
                <div class="row">
                  <div class="col form-group">
                    <label for="amount" class="form-control-label"
                      >Expected Amount</label
                    >
                    <input
                      class="w-100 custom-select"
                      name="amount"
                      v-model="ammo_item.expected_amount"
                      v-validate="'required'"
                      type="number"
                    />
                  </div>
                  <div class="col form-group">
                    <label for="amount" class="form-control-label"
                      >Expected Payment Date</label
                    >
                    <date-picker
                      class="w-100"
                      v-model="ammo_item.expected_payment_date"
                      valueType="format"
                      placeholder="Date"
                    ></date-picker>
                  </div>
                </div>
                <br />

                <div class="text-center">
                  <button class="text-center btn bg-default">Save</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="modal fade repayment" id="viewEdit">
      <div class="modal-dialog" role="document">
        <div class="modal-content" v-if="showModal">
          <div class="modal-header py-2">
            <h4>edit payment</h4>
            <a aria-label="Close" class="close py-1" data-dismiss="modal">
              <span aria-hidden="true" class="modal-close text-danger">
                <i class="fas fa-times"></i>
              </span>
            </a>
          </div>
          <div class="modal-body px-5">
            <input
              name="ammo"
              class="custom-select"
              v-model="actual_amount"
              :placeholder="ammo_item.actual_amount"
            />
          </div>
          <div class="modal-footer justify-content-center">
            <button class="text-center btn bg-default" @click="save">
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Flash from "../utilities/flash";
import { mapGetters } from "vuex";
import Auth from "../utilities/auth";
import LogForm from "./LogForm";
import { get, patch, put } from "../utilities/api";
import DatePicker from "vue2-datepicker";

export default {
  name: "NewOrderAmortization",
  components: { LogForm, DatePicker },
  props: {
    order: {
      type: Object,
    },
    customer: {
      type: Object,
    },
    paymentForm: {
      type: Object,
    },
    paymentFormType: {
      type: String,
      default: "add",
    },
    standAlone: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      actual_amount: null,
      ammoIndex: null,
      completed: null,
      ammo_item: null,
      newOrderItem: {},
      showModal: false,
      canEditPayment: true,
      isReadOnly: false,

      canAddPayment: true,
      user: {
        name: Auth.state.user_name,
        id: Auth.state.user_id,
      },
      amortizationData: this.order.amortization,
    };
  },
  methods: {
    done() {
      this.show = false;

      this.$LIPS(true);
      get(`/api/customer/lookup/${this.customer.id}`)
        .then((res) => {
          this.$LIPS(false);
          this.amortizationData = res.data.customer[0].new_orders.find(
            (x) => x.order_number === this.order.order_number
          ).amortization;
          this.$emit("childToParent", res.data);
        })
        .catch((e) => {
          this.$LIPS(false);
          Flash.setError("Error Fetching customer detail");
        });
    },
    addPaymentForm(data) {
      this.$emit("addPayment", data);
    },
    deletePayment(index) {
      this.$emit("deletePayment", index);
    },
    preparePayments() {
      this.$emit("preparePayments");
    },

    updateAmmo(armo, index) {
      console.log("popopop12345", armo);
      this.showModal = true;
      this.ammo_item = armo;
      this.ammoIndex = index;

      return $(`#viewEdit`).modal("toggle");
    },
    save() {
      this.$LIPS(true);
      const updateData = {
        actual_amount: this.ammo_item.actual_amount,
        actual_payment_date: this.ammo_item.actual_payment_date,
        expected_payment_date: this.ammo_item.expected_payment_date,
        expected_amount: this.ammo_item.expected_amount,
      };

      put(`/api/amortization/${this.ammo_item.id}`, updateData)
        .then((res) => {
          this.$swal({
            icon: "success",
            title: "Armotization Updated Successfully",
          });
          this.amortizationData[this.ammoIndex] = res.data.data;
          this.$LIPS(false);
          return $(`#viewEdit`).modal("toggle");
        })
        .catch((err) => {
          this.$LIPS(false);

          Flash.setError("Unable to update payment");
        })
        .finally(() => {
          $(`#viewEdit`).modal("toggle");
          this.showModal = false;
        });
    },
    calcDebt(amortization) {
      // * Assumed equal distribution of amortization
      if (amortization[0] !== undefined) {
        let res = amortization.filter((amor) => {
          return amor.actual_amount === 0;
        });
        return res.length * amortization[0].expected_amount;
      }
    },
  },
  created() {
    this.calcDebt(this.order.amortization) === 0
      ? (this.completed = true)
      : (this.completed = false);
  },
  updated() {
    this.calcDebt(this.order.amortization) === 0
      ? (this.completed = true)
      : (this.completed = false);
  },
  watch: {
    order: function () {
      this.amortizationData = this.order.amortization;
    },
  },
};
</script>
<style scoped>
.amor-table {
  width: 1092px;
  overflow: scroll;
}
.green {
  color: #00a368;
  width: 100%;
  font-size: 1.3em;
  background: rgba(0, 163, 104, 0.09);
}
.red {
  color: red;
  font-size: 1.3em;
  width: 100%;
  background: rgba(163, 0, 104, 0.09);
}
.td-back {
  color: #00a368;
  background: rgba(0, 163, 104, 0.09);
}
.status-row td {
  padding: 0;
  margin: 0;
}
</style>

