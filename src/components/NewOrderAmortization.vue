<template>
  <div>
    <div class="modal-header py-2">
      <h6 class="modal-title py-1">
        Repayment Plan/Summary - {{ customer.employment_status | capitalize }}
      </h6>
      <a aria-label="Close" class="close py-1" data-dismiss="modal" @click="$emit('close')">
        <span aria-hidden="true" class="modal-close text-danger">
          <i class="fas fa-times"></i>
        </span>
      </a>
    </div>
    <div class="modal-body">
      <div v-if="order.missMatchedPayments.length > 0 && standAlone" class="text-danger">
        <i class="fa fa-exclamation-circle text-danger" aria-hidden="true"></i>
        The debit account does not correspond to the account recorded on the bank statement.
      </div>
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
              <th>Business Type</th>
              <th>Downpayment</th>
              <th>Collection Channel</th>
              <th>Collection Client</th>
              <th>Branch</th>
              <th>Financed By</th>
              <th>Status</th>
            </tr>
            <tr>
              <td class="font-weight-bold">
                {{ `${customer.first_name} ${customer.last_name}` }}
              </td>
              <th>{{ order.order_number }}</th>
              <th>{{ isBNPL ? order.bnpl_vendor_product.name : order.product.name }}</th>
              <th>{{ order.owner }}</th>
              <th>{{ order.serial_number }}</th>
              <th>{{ isBNPL ? "BNPL" : order.business_type }}</th>
              <th class="text-capitalize">
                {{ order.financed_by === 'altara-bnpl' ? ((order.down_payment / order.product_price) * 100).toFixed(0) :
                  order.down_payment_rate }} percent
              </th>
              <th>{{ order.payment_gateway }}</th>
              <th>{{ order.bnpl_vendor_product ? order.bnpl_vendor_product.vendor.full_name : '' }}</th>
              <td class="font-weight-bold">{{ order.branch }}</td>
              <td class="font-weight-bold">{{ order.financed_by }}</td>
              <td class="font-weight-bold td-back">ok</td>
              <!-- <td
                        :class="getOrderStatusClass(getOrderStatus(order))"
                        class="font-weight-bold"
                      >{{getOrderStatus(order)}}</td> -->
            </tr>
          </tbody>
        </table>
        <h5 class="mt-5 mb-0" v-if="order.business_type !== 'Cash n Carry'">
          <div class="d-flex justify-content-between">
            <div>Amortization Schedule</div>
          </div>
        </h5>
        <div class="amor-table row px-4" v-if="order.business_type !== 'Cash n Carry'">
          <table class="table table-bordered">
            <tbody class="text-center">
              <tr>
                <th>Repayment</th>
                <td v-for="(armor, index) in amortizationData" v-html="index + 1" :key="index"></td>
              </tr>
              <tr class="table-separator">
                <th>Due Date</th>
                <td v-for="armo in amortizationData" :key="armo.id">
                  {{ armo.expected_payment_date }}
                </td>
              </tr>
              <tr>
                <th>Actual Pay Day</th>
                <td v-for="armo in amortizationData" :key="armo.id">
                  {{ armo.actual_payment_date }}
                </td>
              </tr>
              <tr class="table-separator status-row">
                <th>Status</th>
                <td v-for="armo in amortizationData" :key="armo.id">
                  <div v-if="armo.actual_payment_date &&
                    armo.actual_amount >= armo.expected_amount &&
                    Date.parse(armo.actual_payment_date) <=
                    Date.parse(armo.expected_payment_date)
                  " class="green status-sign">
                    <i class="fa fa-check"></i>
                  </div>
                  <div v-else-if="armo.actual_payment_date &&
                    armo.actual_amount >= armo.expected_amount &&
                    Date.parse(armo.actual_payment_date) >
                    Date.parse(armo.expected_payment_date)
                  " class="magenta status-sign">
                    <i class="fa fa-check"></i>
                  </div>
                  <div v-else-if="armo.actual_payment_date &&
                    armo.actual_amount < armo.expected_amount
                  " class="pending status-sign">
                    <i class="fa fa-hourglass-start"></i>
                  </div>
                  <div v-else-if="Date.parse(armo.expected_payment_date) < Date.now()
                  " class="red status-sign">
                    <i class="fa fa-times"></i>
                  </div>
                </td>
              </tr>
              <tr class="table-separator">
                <th>Repayment Amount</th>
                <td v-for="armo in amortizationData" :key="armo.id">
                  {{ $formatCurrency(armo.expected_amount) }}
                </td>
              </tr>
              <tr>
                <th>Actual Amount Paid</th>
                <td v-for="(armo, index) in amortizationData" @click="updateAmmo(armo, index)" class="pointer"
                  :key="armo.id">
                  {{ $formatCurrency(armo.actual_amount) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-if="lateFEES && lateFEES.length > 0">
          <h5 class="mt-5 mb-0 d-flex justify-content-between" style="color: red;">
            Late Fees
          </h5>
          <div class="another">
            <table class="table table-bordered">
              <tbody class="text-center">
                <tr class="table-separator">
                  <th>Penalty Date</th>
                  <td style="font-weight: 800;" v-for="latefee in lateFEES" :key="latefee.id">
                    {{ new Date(latefee.date_created).toLocaleDateString() }}
                  </td>
                </tr>
                <tr class="table-separator">
                  <th>Late Fee Amount Due</th>
                  <td style="font-weight: 800;" v-for="latefee in lateFEES" :key="latefee.id">
                    {{ $formatCurrency(latefee.amount_due) }}
                  </td>
                </tr>

                <tr>
                  <th>Late Fee Amount Paid</th>
                  <td style="font-weight: 800;" v-for="(latefee, index) in lateFEES"
                    @click="updateLateFee(latefee, index)" class="pointer" :key="latefee.id">
                    {{ $formatCurrency(latefee.amount_paid) }}
                  </td>
                </tr>
                <tr class="table-separator status-row">
                  <th>Status</th>
                  <td v-for="latefee in lateFEES" :key="latefee.id">
                    <div v-if="latefee.amount_due === latefee.amount_paid" class="green">
                      <i class="fa fa-check"></i>
                    </div>
                    <div v-else class="red">
                      <i class="fa fa-times"></i>
                    </div>
                  </td>
                </tr>

                <tr>
                  <th>Date Paid</th>
                  <td style="font-weight: 800;" v-for="(latefee) in lateFEES" :key="latefee.id">
                    {{
                      latefee.date_paid !== null
                        ? new Date(latefee.date_paid).toLocaleDateString()
                        : 'N/A'
                    }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
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
                    : 'Null' | capitalize
                }}
              </th>
              <td>Total Before Discount</td>
              <th>{{ $formatCurrency($roundDownAmt(order.product_price)) }}</th>
              <td>Total Paid (+discount)</td>
              <th>{{ order.amountPaid }}</th>
            </tr>
            <tr>
              <td class="text-left">Discount Amount</td>
              <th>{{ order.discountAmount || 'null' }}</th>
              <td>Total After Discount</td>
              <th>{{ order.discountedTotal || 'null' }}</th>
              <td>Total Debt</td>
              <th>
                {{ $formatCurrency(calcDebt(order.amortization)) || 'null' }}
              </th>
            </tr>
            <tr>
              <td class="text-left">Down Payment</td>
              <th>{{ $formatCurrency($roundDownAmt(order.down_payment)) }}</th>
              <td>Total Plus Default Fee</td>
              <th>{{ $formatCurrency($roundDownAmt(order.product_price)) }}</th>
              <td>Default Fee</td>
              <th>{{ order.defaultFee || 'null' }}</th>

            </tr>
            <tr>
              <td class="text-left">Commitment Amount</td>
              <th>{{ $formatCurrency(order.commitment_amount) }}</th>
              <td>Commitment Percentage</td>
              <th>{{ order.commitment_percentage }}%</th>
              <td>Raffle Draw Code</td>
              <th>{{ order.raffle_draw_code || 'N/A' }}</th>
            </tr>
          </tbody>
        </table>
        <div v-if="standAlone === false">
          <div v-if="completed === false">
            <LogForm :amortizationData="amortizationData" :customerId="customer.id" :orderId="order.id"
              @done="this.done" :order="order" />
          </div>
        </div>
      </div>
    </div>
    <div :class="{ 'd-flex justify-content-end': !canEditPayment || isReadOnly }" class="modal-footer">
      <a @click="$emit('close')" class="text-link mt-3" data-dismiss="modal" href="javascript:"
        style="text-align: right">close dialogue</a>
      <div class="
        col-2 col-xs-2 col-md col-lg-2
        d-flex
        " v-if="canSelectStatus()">
        <label class="text-danger">Change Order Status</label>
        <select class="custom-select w-50 " data-vv-as="order_status" data-vv-validate-on="blur" :name="'order_status_'"
          v-model="selectedStatus" @change="updateOrderStatus(selectedStatus)">
          <option selected disabled value="Select Status">Select Status</option>
          <option :value="status" :key="status.id" v-for="status in orderStatusData">{{ status.name }} </option>

        </select>
      </div>
    </div>
    <div class="modal fade repayment" id="viewEdit">
      <div class="modal-dialog" role="document">
        <div class="modal-content" v-if="showAmmoModal">
          <div>
            <h5>
              <div class="d-flex justify-content-between">
                <div>Update Amortization</div>
                <div @click="closeAmmoModal()"><i class="fa fa-times"></i></div>
              </div>
            </h5>
            <div class="card">
              <form class="card-body" @submit.prevent="save">
                <div class="row">
                  <div class="col form-group">
                    <label for="amount" class="form-control-label">Actual Amount</label>
                    <br />
                    <input name="ammo" class="custom-select" v-model="ammo_item.actual_amount" />
                  </div>
                  <div class="col form-group">
                    <label for="amount" class="form-control-label">Actual Payment Date</label>
                    <date-picker class="w-100" v-model="ammo_item.actual_payment_date" valueType="format"
                      placeholder="Date"></date-picker>
                  </div>
                </div>
                <div class="row">
                  <div class="col form-group">
                    <label for="amount" class="form-control-label">Expected Amount</label>
                    <input class="w-100 custom-select" name="amount" v-model="ammo_item.expected_amount"
                      v-validate="'required'" type="number" />
                  </div>
                  <div class="col form-group">
                    <label for="amount" class="form-control-label">Expected Payment Date</label>
                    <date-picker class="w-100" v-model="ammo_item.expected_payment_date" valueType="format"
                      placeholder="Date"></date-picker>
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

    <div class="modal fade repayment" id="viewEditLateFee">
      <div class="modal-dialog" role="document">
        <div class="modal-content" v-if="showLateFeeModal">
          <div>
            <h5>
              <div class="d-flex justify-content-between">
                <div>Update LateFee</div>
                <div @click="closeModal()"><i class="fa fa-times"></i></div>
              </div>
            </h5>
            <div class="card">
              <form class="card-body" @submit.prevent="saveLateFee">
                <div class="row">
                  <div class="col form-group">
                    <label for="amount" class="form-control-label">Actual Amount</label>
                    <br />
                    <input name="ammo" class="custom-select" v-model="lateFeeItem.amount_paid"
                      v-validate="'required'" />
                  </div>
                  <div class="col form-group">
                    <label for="amount" class="form-control-label">Date Paid</label>
                    <date-picker class="w-100" v-model="lateFeeItem.date_paid" valueType="format"
                      placeholder="Date"></date-picker>
                  </div>
                </div>
                <div class="row">
                  <div class="col form-group">
                    <label for="amount" class="form-control-label">Expected Amount</label>
                    <br />

                    <input class="custom-select" disabled name="amount" v-model="lateFeeItem.amount_due" />
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
  </div>
</template>
<script>
import Flash from '../utilities/flash'
import { mapGetters } from 'vuex'
import Auth from '../utilities/auth'
import { log } from '../utilities/log'
import LogForm from './LogForm'
import { get, patch, put, post } from '../utilities/api'
import DatePicker from 'vue2-datepicker'
import 'vue2-datepicker/index.css'

export default {
  name: 'NewOrderAmortization',
  components: { LogForm, DatePicker },
  props: {
    order: {
      type: Object,
    },
    customer: {
      type: Object,
    },
    lateFEES: {
      type: Array,
    },
    paymentForm: {
      type: Object,
    },
    paymentFormType: {
      type: String,
      default: 'add',
    },
    standAlone: {
      type: Boolean,
      default: false,
    },
    isBNPL: {
      type: Boolean,
      default: false
    }
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
      orderStatusData: [],
      selectedStatus: {},
      columnsData: [],
      showAmmoModal: false,
      showLateFeeModal: false,
      lateFeeItem: null,
      lateFeeIndex: null,

      canAddPayment: true,
      user: {
        name: Auth.state.user_name,
        id: Auth.state.user_id,
      },
      amortizationData: this.order.amortization,
      apiUrls: {
        orderStatus: `/api/order_status`,
        changeOrderStatus: `/api/change-order-status`
      }
    }
  },
  async beforeMount() {
    await this.getOrderStatus()
  },
  methods: {
    done() {
      this.show = false

      this.$LIPS(true)
      get(`/api/customer/lookup/${this.customer.id}`)
        .then(res => {
          this.$LIPS(false)
          this.amortizationData = res.data.customer[0].new_orders.find(
            x => x.order_number === this.order.order_number
          ).amortization
          this.$emit('childToParent', res.data)
        })
        .catch(() => {
          this.$LIPS(false)
          Flash.setError('Error Fetching customer detail')
        })
    },
    addPaymentForm(data) {
      this.$emit('addPayment', data)
    },

    deletePayment(index) {
      this.$emit('deletePayment', index)
    },
    preparePayments() {
      this.$emit('preparePayments')
    },
    canSelectStatus() {
      return this.auth('AuditorAccess')
    },

    updateAmmo(armo, index) {
      if (this.canEditAmmoPayment && this.standAlone === false) {
        this.showAmmoModal = true
        this.ammo_item = armo
        this.ammoIndex = index

        return $(`#viewEdit`).modal('toggle')
      }
    },
    updateLateFee(lateFee, index) {
      if (this.standAlone === false) {
        this.showLateFeeModal = true
        this.lateFeeItem = lateFee
        this.lateFeeIndex = index

        return $(`#viewEditLateFee`).modal('toggle')
      }
    },
    closeModal() {
      this.showModal = false

      // $(`#viewEdit`).modal("toggle");
    },

    closeAmmoModal() {
      this.showAmmoModal = false
    },
    async getOrderStatus() {
      try {
        const fetchOrderStatus = await get(this.apiUrls.orderStatus)
        this.orderStatusData = fetchOrderStatus?.data?.data?.data
        this.orderStatus = new Array(this.orderStatusData.length).fill('Select Status');
      } catch (err) {
        this.$displayErrorMessage(err)
      }
    },
    async updateOrderStatus(index) {
      this.$LIPS(true);
      await post(this.apiUrls.changeOrderStatus, {
        "status_id": index.id,
        "order_id": this.order.id
      })
        .then(res => {
          log('changeOrderStatus', `Change order ${this.order.order_number} status from ${this.order.status} to ${index.name}`);

          this.$emit('updateOrderStatus', res.data);

          this.done();
          return res;
        })
        .catch(err => {
          this.$LIPS(false)
          Flash.setError("Error: " + err.message)
        })
      this.$LIPS(false);
    },
    save() {
      this.$LIPS(true)
      const updateData = {
        user_id: localStorage.getItem('user_id'),
        actual_amount: this.ammo_item.actual_amount,
        actual_payment_date: this.ammo_item.actual_payment_date,
        expected_payment_date: this.ammo_item.expected_payment_date,
        expected_amount: this.ammo_item.expected_amount,
      }

      put(`/api/amortization/${this.ammo_item.id}`, updateData)
        .then(res => {
          this.$swal({
            icon: 'success',
            title: 'Amortization Updated Successfully',
          })
          this.amortizationData[this.ammoIndex] = res.data.data
          this.$LIPS(false)
          return $(`#viewEdit`).modal('toggle')
        })
        .catch(() => {
          this.$LIPS(false)

          Flash.setError('Unable to update payment')
          return $(`#viewEdit`).modal('toggle')
        })
        .finally(() => {
          $(`#viewEdit`).modal('toggle')
          this.showModal = false
        })
    },

    saveLateFee() {
      this.$LIPS(true)
      this.lateFeeItem.amount_paid = parseFloat(
        this.lateFeeItem.amount_paid
      ).toFixed(2)
      patch(`/api/late_fee/${this.lateFeeItem.id}`, this.lateFeeItem)
        .then(res => {
          this.$swal({
            icon: 'success',
            title: 'LateFee Updated Successfully',
          })
          this.lateFEES[this.lateFeeIndex] = res.data.data
          this.$LIPS(false)
          return $(`#viewEdit`).modal('toggle')
        })
        .catch(err => {
          this.$LIPS(false)

          Flash.setError('Unable to update late fee')
          return $(`#viewLateFeeEdit`).modal('toggle')
        })
        .finally(() => {
          $(`#viewLateFeeEdit`).modal('toggle')
          this.showLateFeeModal = false
        })
    },
    calcDebt(amortization) {
      // * Assumed equal distribution of amortization
      const totalRepayment = amortization?.reduce((total, item) => {
        return total + Number(item.expected_amount)
      }, 0)
      const totalPaid = amortization?.reduce((total, item) => {
        return total + Number(item.actual_amount)
      }, 0)
      return totalRepayment - totalPaid
    },
  },
  async created() {
    this.calcDebt(this.order.amortization) === 0
      ? (this.completed = true)
      : (this.completed = false)

    await this.getOrderStatus();
    // Retrieve the selected status from localStorage for each instance
    let status = this.orderStatusData.find((status) => status.name === this.order.status)
    this.selectedStatus = status

  },
  updated() {
    this.calcDebt(this.order.amortization) === 0
      ? (this.completed = true)
      : (this.completed = false)
  },
  watch: {
    order: function () {
      this.amortizationData = this.order.amortization
    },
  },
  computed: {
    ...mapGetters(['auth', 'getAuthUserDetails']),

    canEditAmmoPayment() {
      // return this.auth('FSLLead') || this.auth('DVALead')
      return this.auth('AdminAccess')
    },

  },
}
</script>
<style scoped>
.amor-table {
  overflow-x: auto;
}

.another {
  width: 1092px;
  overflow: scroll;
}

.status-sign {
  width: 100%;
  font-size: 1.3em;
}

.green {
  color: #0cd68c;
  background: rgba(10, 232, 150, 0.274);
}

.magenta {
  color: #ff00ff;
  background: rgba(200, 0, 140, 0.09);
}

.pending {
  color: #ffa500;
  background: rgba(253, 253, 150, 0.5);
}

.red {
  color: red;
  background: rgba(236, 0, 0, 0.09);
}

.td-back {
  color: #00a368;
  background: rgba(0, 163, 104, 0.09);
}

.status-row td {
  padding: 0;
  margin: 0;
}

.pointer {
  cursor: pointer;
}
</style>
