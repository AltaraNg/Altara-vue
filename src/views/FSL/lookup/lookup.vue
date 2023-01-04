<template>
  <transition name="fade">
    <div id="reminder">
      <AutocompleteSearch
        title="customer lookup"
        @customer-selected="processForm"
        :url="'/api/customer/autocomplete'"
      />
      <transition name="fade">
        <div v-if="customer && show">
          <!--                    <div class="attendance-hea TODO:: cleanup d">-->
          <customer-profile :view-customer="customer" />
          <!--             // TODO:: cleanup       </div>-->

          <div style="display: flex; ">
            <custom-header
              :title="'All order(s)'"
              @click.native="selectType('order')"
              :style="
                !states.order
                  ? 'opacity: 0.2; cursor:pointer;'
                  : 'cursor:pointer;'
              "
            />
            <custom-header
              :title="'Recommendations'"
              @click.native="selectType('recommendation')"
              :style="
                !states.recommendation
                  ? 'opacity: 0.2; cursor:pointer;'
                  : 'cursor:pointer; '
              "
              style="margin-left:-10px"
            />
          </div>
          <hr />
          <div v-if="states.order">
            <div class="mt-5 mb-3 attendance-head">
              <div class="row px-4 pt-3 pb-4 text-center">
                <div class="col light-heading" style="max-width: 100px">
                  S/No.
                </div>
                <div
                  class="col light-heading"
                  v-for="(header, index) in headers"
                  :key="index"
                >
                  {{ header }}
                </div>
              </div>
            </div>
            <div class="tab-content mt-1 attendance-body">
              <div
                class="tab-pane active text-center"
                v-if="
                  (show && customer.orders.length > 0) ||
                    customer.new_orders.length > 0
                "
              >
                <div
                  class="mb-3 row attendance-item"
                  v-for="(order, index) in customer.orders"
                  :key="order.index"
                >
                  <div
                    class="
                    col-12 col-xs-2 col-md col-lg
                    d-flex
                    align-items-center
                  "
                  >
                    <span class="user mx-auto">{{ index + 1 }}</span>
                    <span v-if="$route.meta.customSMS">
                      <CustomSMSButton
                        :order="order"
                        :customer="customer"
                        :key="order.order.id"
                      />
                    </span>
                  </div>
                  <div
                    class="
                    col-12 col-xs-2 col-md col-lg
                    d-flex
                    user-name
                    align-items-center
                    justify-content-center
                  "
                  >
                    {{ formatDate(order.order.order_date) }}
                  </div>
                  <div
                    class="
                    col-12 col-xs-2 col-md col-lg
                    d-flex
                    user-name
                    align-items-center
                    justify-content-center
                  "
                  >
                    {{ order.order.id }}
                  </div>
                  <div
                    class="
                    col-12 col-xs-3 col-md col-lg
                    d-flex
                    align-items-center
                    justify-content-center
                  "
                  >
                    {{ order.order.store_product.product_name }}
                  </div>
                  <div
                    class="
                    col-12 col-xs-2 col-md col-lg
                    d-flex
                    align-items-center
                    justify-content-center
                  "
                  >
                    {{ $formatCurrency(order.order.product_price) }}
                  </div>
                  <div
                    class="
                    col-12 col-xs-2 col-md col-lg
                    d-flex
                    align-items-center
                    justify-content-center
                  "
                  >
                    {{ order.order.sales_category.name }}
                  </div>
                  <div
                    class="
                    col-12 col-xs-2 col-md col-lg
                    d-flex
                    align-items-center
                    justify-content-center
                  "
                  >
                    {{ customer.employment_status }}
                  </div>
                  <div
                    class="
                    col-12 col-xs-2 col-md col-lg
                    d-flex
                    align-items-center
                    justify-content-center
                  "
                  >
                    <button
                      :class="
                        order.count === order.repaymentLevel
                          ? 'approved'
                          : 'pending'
                      "
                      @click="displayAmortization(order)"
                      class="btn status my-sm-2"
                    >
                      View Plan
                      <i
                        :class="
                          order.count === order.repaymentLevel
                            ? 'fa-check-circle'
                            : 'fa-hourglass-half'
                        "
                        class="fas ml-3"
                        style="font-size: 1.4rem"
                      ></i>
                      <!--                                        // TODO:: cleanup-->
                    </button>
                  </div>
                </div>
                <div
                  class="mb-3 row attendance-item"
                  v-for="(order, index) in customer.new_orders"
                  :key="index"
                >
                  <div
                    class="
                    col-12 col-xs-2 col-md col-lg
                    d-flex
                    align-items-center
                  "
                    style="max-width: 100px"
                  >
                    <span
                      class="user mx-auto pointer"
                      @click="updateOrder(order)"
                      >{{ customer.orders.length + index + 1 }}</span
                    >
                    <span v-if="$route.meta.customSMS">
                      <CustomSMSButton
                        :order="order"
                        :customer="customer"
                        :key="
                          order.amortization[0]
                            ? order.amortization[0].new_order_id
                            : index
                        "
                      />
                    </span>
                    <span>
                      <!-- <img src="../../../../svg/download.svg" /> -->
                    </span>
                  </div>

                  <div
                    class="
                    col-12 col-xs-2 col-md col-lg
                    d-flex
                    align-items-center
                    justify-content-center
                  "
                  >
                    {{ formatDate(order.order_date) }}
                  </div>
                  <div
                    class="
                    col-12 col-xs-2 col-md col-lg
                    d-flex
                    user-name
                    align-items-center
                    justify-content-center
                  "
                  >
                    <span
                      v-if="
                        order.order_type === 'Altara Pay' &&
                          order.payment_gateway === 'Paystack'
                      "
                    >
                      <PaystackModal
                        :order="order"
                        :customer="customer"
                        :key="
                          order.amortization[0]
                            ? order.amortization[0].new_order_id
                            : index
                        "
                      ></PaystackModal>
                    </span>
                    <span
                      v-if="
                        order.payment_gateway === 'Paystack' &&
                          order.paystack_auth_code != null &&
                          order.status !== 'Completed'
                      "
                    >
                      <CustomDirectDebitModalButton
                        :order="order"
                        :key="order.id"
                        :customer="customer"
                      ></CustomDirectDebitModalButton>
                    </span>
                    {{ order.order_number }}
                  </div>
                  <div
                    class="
                    col-12 col-xs-3 col-md col-lg
                    d-flex
                    align-items-center
                    justify-content-center
                  "
                  >
                    {{ order.product.name | truncate(50) }}
                  </div>
                  <div
                    class="
                    col-12 col-xs-2 col-md col-lg
                    d-flex
                    align-items-center
                    justify-content-center
                  "
                  >
                    {{ $formatCurrency(order.product_price) }}
                  </div>
                  <div
                    class="
                    col-12 col-xs-2 col-md col-lg
                    d-flex
                    align-items-center
                    justify-content-center
                  "
                  >
                    {{ order.sales_type.name }}
                    <discount
                      v-if="showDiscount(order)"
                      class="discount_badge"
                      :percent="percentage(order)"
                    />
                  </div>
                  <div
                    class="
                    col-12 col-xs-2 col-md col-lg
                    d-flex
                    align-items-center
                    justify-content-center
                  "
                  >
                    {{ order.customer.employment_status }}
                  </div>

                  <div
                    class="
                    col-12 col-xs-2 col-md col-lg
                    d-flex
                    align-items-center
                    justify-content-center
                  "
                  >
                    <button
                      :class="
                        order.status === 'Completed' ? 'approved' : 'pending'
                      "
                      @click="displayAmortization(order)"
                      class="btn status my-sm-2"
                    >
                      View Plan
                      <i
                        :class="
                          order.status === 'Completed'
                            ? 'fa-check-circle'
                            : 'fa-hourglass-half'
                        "
                        class="fas ml-3"
                        style="font-size: 1.4rem"
                      ></i>
                      <!--                                        // TODO:: cleanup-->
                    </button>
                  </div>
                </div>
              </div>

              <div class="tab-pane active text-center" v-else>
                <div class="mb-3 row attendance-item">
                  <div
                    class="
                    col
                    d-flex
                    light-heading
                    align-items-center
                    justify-content-center
                  "
                  >
                    No records found!
                  </div>
                </div>
              </div>
            </div>
            <PaymentLog
              :customerId="customer.id"
              @done="this.done"
              v-if="logger === 'payment'"
              :customer="customer"
            />
            <div class="mt-5 mb-3 attendance-head">
              <div class="w-100 my-5 mx-0 hr"></div>
            </div>
          </div>
          <div v-if="states.recommendation" class="mb-5">
            <div class="mt-5 mb-3 attendance-head">
              <div class="row px-4 pt-3 pb-4 text-center">
                <div class="col light-heading" style="max-width: 150px">
                  S/No.
                </div>
                <div
                  class="col light-heading"
                  v-for="(header, index) in recommendationHeaders"
                  :key="index"
                  style="text-align: left; "
                >
                  {{ header }}
                </div>
              </div>
            </div>
            <div class="tab-content mt-1 attendance-body">
              <div
                class="tab-pane active "
                v-if="recommendationList.length > 0"
              >
                <div
                  class="mb-3 row attendance-item"
                  v-for="(recommendation, index) in recommendationList"
                  :key="index"
                >
                  <div
                    class="
                    col-12 col-xs-2 col-md col-lg
                    d-flex

                  "
                    style="max-width: 150px; margin-left: -15px;"
                  >
                    <span class="user mx-auto">{{ index + 1 }}</span>
                  </div>
                  <div
                    class="
                    col-12 col-xs-2 col-md col-lg
                    d-flex
                    user-name
                    align-items-center

                  "
                    style="padding-left:30px"
                  >
                    {{ formatDate(recommendation.created_at) }}
                  </div>
                  <div
                    class="
                    col-12 col-xs-2 col-md col-lg
                    d-flex
                    user-name
                    align-items-center

                  "
                  >
                    {{ recommendation.type }}
                  </div>
                  <div
                    class="
                    col-12 col-xs-3 col-md col-lg
                    d-flex
                    align-items-center

                  "
                  >
                    {{
                      $formatCurrency(
                        JSON.parse(recommendation.input_data).total_price
                      )
                    }}
                  </div>
                  <div
                    class="
                    col-12 col-xs-2 col-md col-lg
                    d-flex
                    align-items-center

                  "
                  >
                    {{ JSON.parse(recommendation.input_data).duration }}
                  </div>
                  <div
                    class="
                    col-12 col-xs-2 col-md col-lg
                    d-flex
                    align-items-center

                  "
                  >
                    {{ computeDownpayment(recommendation) }}
                  </div>

                  <div
                    class="
                    col-12 col-xs-2 col-md col-lg
                    d-flex
                    align-items-center

                  "
                  >
                    <button
                      @click="displayActiveRecommendation(recommendation)"
                      class="btn status"
                      :class="
                        computeDownpayment(recommendation) ==
                        'There is no suitable plan'
                          ? 'not-approved'
                          : 'approved'
                      "
                    >
                      View
                    </button>
                  </div>
                </div>
              </div>

              <div
                class="tab-pane active text-center"
                v-if="recommendationList.length == 0"
              >
                <div class="mb-3 row attendance-item">
                  <div
                    class="
                    col
                    d-flex
                    light-heading
                    align-items-center
                    justify-content-center
                  "
                  >
                    No records found!
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </transition>

      <div class="modal fade repayment" id="updateOrderModal">
        <div class="modal-dialog" role="document">
          <div class="modal-content" v-if="showOrdermodal">
            <div>
              <h5>Update Order</h5>

              <div class="card">
                <form class="card-body" @submit.prevent="submitForm">
                  <div class="row">
                    <div class="col form-group">
                      <label for="amount" class="form-control-label"
                        >Name</label
                      >
                      <AutoComplete
                        v-on:childToParent="selectedItem"
                        :apiUrl="apiURL.product"
                        :currentValue="currentOrder.product_name"
                      />
                    </div>
                    <div class="col form-group">
                      <label for="amount" class="form-control-label"
                        >Repayment</label
                      >
                      <input
                        class="w-100 custom-select"
                        name="amount"
                        v-model="currentOrder.repayment"
                        v-validate="'required'"
                        type="number"
                      />
                    </div>
                    <div class="col form-group">
                      <label for="amount" class="form-control-label"
                        >Down Payment</label
                      >
                      <input
                        class="w-100 custom-select"
                        name="amount"
                        v-model="currentOrder.down_payment"
                        v-validate="'required'"
                        type="number"
                      />
                    </div>
                  </div>
                  <div class="row">
                    <div class="col form-group">
                      <label for="amount" class="form-control-label"
                        >Product Price</label
                      >
                      <input
                        class="w-100 custom-select"
                        name="amount"
                        v-model="currentOrder.product_price"
                        v-validate="'required'"
                        type="number"
                      />
                    </div>
                    <div class="col form-group">
                      <label for="amount" class="form-control-label"
                        >Order Date</label
                      >
                      <date-picker
                        class="w-100"
                        v-model="currentOrder.order_date"
                        valueType="format"
                        placeholder="Date"
                      ></date-picker>
                      <!-- <input
                        class="w-100 custom-select"
                        name="amount"
                        v-model="currentOrder.order_date"
                        v-validate="'required'"
                      /> -->
                    </div>
                  </div>
                  <br />

                  <div class="text-center">
                    <button class="btn bg-default" type="submit">Submit</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="modal fade repayment" id="amortization">
        <div class="modal-dialog modal-xl" role="document">
          <div class="modal-content" v-if="showModalContent">
            <div v-if="!newOrder">
              <div class="modal-header py-2">
                <h6 class="modal-title py-1">
                  Repayment Plan/Summary -
                  {{ customer.employment_status | capitalize }}
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
                        <th>Branch</th>
                        <th>Status</th>
                      </tr>
                      <tr>
                        <td class="font-weight-bold">
                          {{ activeOrder.customerName }}
                        </td>
                        <th>{{ activeOrder.order.id }}</th>
                        <th>
                          {{ activeOrder.order.store_product.product_name }}
                        </th>
                        <td class="font-weight-bold">
                          {{ activeOrder.branch.name }}
                        </td>
                        <td
                          :class="
                            getOrderStatusClass(getOrderStatus(activeOrder))
                          "
                          class="font-weight-bold"
                        >
                          {{ getOrderStatus(activeOrder) }}
                        </td>
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
                            v-for="(caption,
                            index) in activeOrder.repaymentCaptions"
                            v-html="caption"
                            :key="index"
                          ></td>
                        </tr>
                        <tr class="table-separator">
                          <th>Due Date</th>
                          <td
                            v-for="(date, index) in activeOrder.dueDates"
                            :key="index"
                          >
                            {{ date }}
                          </td>
                        </tr>
                        <tr>
                          <th>Actual Pay Day</th>
                          <td
                            v-for="(date, index) in activeOrder.actualPayDates"
                            :key="index"
                          >
                            {{ date }}
                          </td>
                        </tr>
                        <tr class="table-separator">
                          <th>Status</th>
                          <td
                            :class="status.class"
                            v-for="(status,
                            index) in activeOrder.paymentStatusClasses"
                            :key="index"
                          >
                            <i :class="status.icon" class="fas"></i>
                          </td>
                        </tr>
                        <tr class="table-separator">
                          <th>Repayment Amount</th>
                          <td
                            v-for="(payment,
                            index) in activeOrder.amountsToBePaid"
                            :key="index"
                          >
                            {{ $formatCurrency(payment) }}
                          </td>
                        </tr>
                        <tr>
                          <th>Actual Amount Paid</th>
                          <td
                            v-for="(payment,
                            index) in activeOrder.actualAmountsPaid"
                            :key="index"
                            @click="updateAmmo(armo)"
                          >
                            {{ $formatCurrency(payment) }}
                          </td>
                        </tr>
                        <tr class="table-separator">
                          <th>Payment Method</th>
                          <td
                            class="text-capitalize"
                            v-for="(repaymentMethod,
                            index) in activeOrder.paymentMethods"
                            :key="index"
                          >
                            {{
                              Order.convertToName(
                                repaymentMethod,
                                'paymentMethods'
                              )
                            }}
                          </td>
                        </tr>
                        <tr>
                          <th>Bank</th>
                          <td
                            class="text-capitalize"
                            v-for="(repaymentBank,
                            key) in activeOrder.paymentBanks"
                            :key="key"
                          >
                            {{ Order.convertToName(repaymentBank, 'banks') }}
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
                        <th>{{ activeOrder.discount | capitalize }}</th>
                        <td>Total Before Discount</td>
                        <th>
                          {{
                            $formatCurrency(
                              $roundDownAmt(activeOrder.order['product_price'])
                            )
                          }}
                        </th>
                        <td>Total Paid (+discount)</td>
                        <th>{{ activeOrder.amountPaid }}</th>
                      </tr>
                      <tr>
                        <td class="text-left">Discount Amount</td>
                        <th>{{ activeOrder.discountAmount }}</th>
                        <td>Total After Discount</td>
                        <th>{{ activeOrder.discountedTotal }}</th>
                        <td>Total Debt</td>
                        <th>{{ activeOrder.outstandingDebt }}</th>
                      </tr>
                      <tr>
                        <td class="text-left">Down Payment</td>
                        <th>
                          {{
                            $formatCurrency(
                              $roundDownAmt(activeOrder.order['down_payment'])
                            )
                          }}
                        </th>
                        <td>Total Plus Default Fee</td>
                        <th>{{ activeOrder.totalPlusDefault }}</th>
                        <td>Default Fee</td>
                        <th>{{ activeOrder.defaultFee }}</th>
                      </tr>
                    </tbody>
                  </table>

                  <div>
                    <h5 class="mt-5 mb-0">
                      {{ paymentFormType | capitalize }} a payment
                    </h5>
                    <table class="table table-bordered">
                      <tbody class="text-center">
                        <tr class="table-separator">
                          <td class="text-left">S/No.</td>
                          <th>Repayment</th>
                          <th>Amount</th>
                          <th>Payment Method</th>
                          <th>Bank</th>
                          <th>Date</th>
                          <th>Collected By</th>
                          <th>Action</th>
                        </tr>
                        <tr
                          v-for="(payment, index) in paymentForm.payments"
                          :key="index"
                        >
                          <th>{{ index + 1 }}</th>
                          <th>
                            <div
                              class="form-group mb-0"
                              v-if="paymentFormType === 'add'"
                            >
                              <input
                                class="form-control"
                                disabled
                                name="date"
                                type="text"
                                v-model="paymentForm.payments[index].column"
                              />
                            </div>
                            <select
                              class="custom-select w-100"
                              v-else
                              v-model="paymentForm.payments[index]._col"
                            >
                              <option
                                :value="i"
                                v-for="(i, index) in activeOrder.repaymentLevel"
                                :key="index"
                              >
                                {{ $getColumn(i) }} Repayment
                              </option>
                            </select>
                          </th>
                          <th>
                            <div class="form-group mb-0">
                              <input
                                class="form-control"
                                name="date"
                                type="text"
                                v-model="paymentForm.payments[index]._pay"
                              />
                            </div>
                          </th>
                          <th>
                            <select
                              :disabled="paymentFormType === 'edit'"
                              class="custom-select w-100"
                              v-model="
                                paymentForm.payments[index]._payment_method
                              "
                            >
                              <option
                                :value="id"
                                v-for="{ name, id } in paymentMeths"
                                :key="name.id"
                              >
                                {{ name | capitalize }}
                              </option>
                            </select>
                          </th>
                          <th>
                            <select
                              :disabled="paymentFormType === 'edit'"
                              class="custom-select w-100"
                              v-model="
                                paymentForm.payments[index]._payment_bank
                              "
                            >
                              <option
                                :value="id"
                                v-for="(name, id) in getBanks"
                                :key="id"
                              >
                                {{ name }}
                              </option>
                            </select>
                          </th>
                          <th>
                            <div class="form-group mb-0">
                              <input
                                :disabled="paymentFormType === 'edit'"
                                class="form-control"
                                name="date"
                                type="date"
                                v-model="paymentForm.payments[index]._date"
                              />
                            </div>
                          </th>
                          <th>
                            <div class="form-group mb-0">
                              <input
                                :value="user.name"
                                class="form-control"
                                data-vv-as="date"
                                disabled
                                name="date"
                                type="text"
                              />
                            </div>
                          </th>
                          <th>
                            <button
                              @click="deletePayment(index)"
                              class="
                                ml-2
                                btn
                                status status-sm
                                my-sm-2
                                not-approved
                              "
                            >
                              <i class="fas fa-times"></i>
                            </button>
                          </th>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <div class="d-flex modal-footer">
                <button
                  @click="addPaymentForm('add')"
                  class="btn status my-sm-2"
                >
                  Add Payment
                </button>
                <button
                  @click="addPaymentForm('edit')"
                  class="btn status my-sm-2"
                >
                  Edit Payment
                </button>
                <button
                  @click="preparePayments(index)"
                  class="btn status my-sm-2 approved ml-4"
                >
                  Click here to Submit Payment(s)!
                </button>
                <a
                  class="text-link mt-3"
                  data-dismiss="modal"
                  href="javascript:"
                  style="text-align: right"
                  >close dialogue</a
                >
              </div>
            </div>
            <div v-else>
              <new-order-amortization
                :lateFEES="lateFEES"
                :order="order"
                :customer="customer"
                :paymentForm="paymentForm"
                :paymentFormType="paymentFormType"
                @addPayment="addPaymentForm"
                @deletePayment="deletePayment"
                @preparePayments="preparePayments"
                v-on:childToParent="newOrderItem"
              ></new-order-amortization>
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
      </div>

      <div class="modal fade repayment" id="recommendation">
        <div
          class="modal-dialog modal-md"
          role="document"
          style="margin-top: 10%;"
        >
          <div class="modal-content" v-if="displayMore">
            <div class="modal-header py-2">
              <h6 class="modal-title py-1">
                Input Details
              </h6>
              <a aria-label="Close" class="close py-1" data-dismiss="modal">
                <span aria-hidden="true" class="modal-close text-danger">
                  <i class="fas fa-times"></i>
                </span>
              </a>
            </div>

            <div class="modal-body">
              <div v-if="activeRecommendation.type !== 'formal'">
                <h6 class="modal-title py-1">
                  Account Balance
                </h6>
                <table
                  class="styled-table"
                  style="margin-bottom: 25px; width:100%"
                >
                  <thead>
                    <tr style="width:100%">
                      <th
                        style="width:20%; border: 1px lightgray solid; text-align: center;"
                      >
                        Month
                      </th>
                      <th
                        style="width:20%; border: 1px lightgray solid; text-align: center;"
                      >
                        First Week
                      </th>
                      <th
                        style="width:20%; border: 1px lightgray solid; text-align: center;"
                      >
                        Second Week
                      </th>
                      <th
                        style="width:20%; border: 1px lightgray solid; text-align: center;"
                      >
                        Third Week
                      </th>
                      <th
                        style="width:20%; border: 1px lightgray solid; text-align: center;"
                      >
                        Fourth Week
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td
                        style=" border:1px lightgray solid; text-align: center;"
                      >
                        Month 1
                      </td>
                      <td
                        style=" border:1px lightgray solid; text-align: center;"
                      >
                        {{
                          $formatCurrency(
                            JSON.parse(activeRecommendation.input_data)
                              .month1[0]
                          )
                        }}
                      </td>
                      <td
                        style=" border:1px lightgray solid; text-align: center;"
                      >
                        {{
                          $formatCurrency(
                            JSON.parse(activeRecommendation.input_data)
                              .month1[1]
                          )
                        }}
                      </td>
                      <td
                        style=" border:1px lightgray solid; text-align: center;"
                      >
                        {{
                          $formatCurrency(
                            JSON.parse(activeRecommendation.input_data)
                              .month1[2]
                          )
                        }}
                      </td>
                      <td
                        style=" border:1px lightgray solid; text-align: center;"
                      >
                        {{
                          $formatCurrency(
                            JSON.parse(activeRecommendation.input_data)
                              .month1[3]
                          )
                        }}
                      </td>
                    </tr>
                    <tr>
                      <td
                        style=" border:1px lightgray solid; text-align: center;"
                      >
                        Month 2
                      </td>
                      <td
                        style=" border:1px lightgray solid; text-align: center;"
                      >
                        {{
                          $formatCurrency(
                            JSON.parse(activeRecommendation.input_data)
                              .month2[0]
                          )
                        }}
                      </td>
                      <td
                        style=" border:1px lightgray solid; text-align: center;"
                      >
                        {{
                          $formatCurrency(
                            JSON.parse(activeRecommendation.input_data)
                              .month2[1]
                          )
                        }}
                      </td>
                      <td
                        style=" border:1px lightgray solid; text-align: center;"
                      >
                        {{
                          $formatCurrency(
                            JSON.parse(activeRecommendation.input_data)
                              .month2[2]
                          )
                        }}
                      </td>
                      <td
                        style=" border:1px lightgray solid; text-align: center;"
                      >
                        {{
                          $formatCurrency(
                            JSON.parse(activeRecommendation.input_data)
                              .month2[3]
                          )
                        }}
                      </td>
                    </tr>
                    <tr>
                      <td
                        style=" border:1px lightgray solid; text-align: center;"
                      >
                        Month 3
                      </td>
                      <td
                        style=" border:1px lightgray solid; text-align: center;"
                      >
                        {{
                          $formatCurrency(
                            JSON.parse(activeRecommendation.input_data)
                              .month3[0]
                          )
                        }}
                      </td>
                      <td
                        style=" border:1px lightgray solid; text-align: center;"
                      >
                        {{
                          $formatCurrency(
                            JSON.parse(activeRecommendation.input_data)
                              .month3[1]
                          )
                        }}
                      </td>
                      <td
                        style=" border:1px lightgray solid; text-align: center;"
                      >
                        {{
                          $formatCurrency(
                            JSON.parse(activeRecommendation.input_data)
                              .month3[2]
                          )
                        }}
                      </td>
                      <td
                        style=" border:1px lightgray solid; text-align: center;"
                      >
                        {{
                          $formatCurrency(
                            JSON.parse(activeRecommendation.input_data)
                              .month3[3]
                          )
                        }}
                      </td>
                    </tr>

                    <!-- and so on... -->
                  </tbody>
                </table>
              </div>
              <div v-else style="display:flex; align-items: center;">
                <h6 class="modal-title py-1 pr-4">Salary:</h6>
                <div style="font-size: 16px;">
                  {{
                    $formatCurrency(
                      JSON.parse(activeRecommendation.input_data).salary
                    )
                  }}
                </div>
              </div>
              <div
                :style="
                  activeRecommendation.type == 'formal'
                    ? 'margin-top:5px'
                    : 'margin-top:25px'
                "
              >
                <h6 class="modal-title py-1">
                  Preferred Plan
                </h6>
                <table
                  class="styled-table"
                  style="margin-bottom: 15px; width:100%"
                >
                  <thead>
                    <tr style="width:100%">
                      <th
                        style="width:20%; border: 1px lightgray solid; text-align: center;"
                      >
                        Total Price
                      </th>
                      <th
                        style="width:20%; border: 1px lightgray solid; text-align: center;"
                      >
                        Plan
                      </th>
                      <th
                        style="width:20%; border: 1px lightgray solid; text-align: center;"
                      >
                        Duration
                      </th>
                      <th
                        style="width:20%; border: 1px lightgray solid; text-align: center;"
                      >
                        Cycle
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td
                        style=" border:1px lightgray solid; text-align: center;"
                      >
                        {{
                          $formatCurrency(
                            JSON.parse(activeRecommendation.input_data)
                              .total_price
                          )
                        }}
                      </td>
                      <td
                        style=" border:1px lightgray solid; text-align: center;"
                      >
                        {{ JSON.parse(activeRecommendation.input_data).plan }}
                      </td>
                      <td
                        style=" border:1px lightgray solid; text-align: center;"
                      >
                        {{
                          JSON.parse(activeRecommendation.input_data).duration
                        }}
                      </td>
                      <td
                        style=" border:1px lightgray solid; text-align: center;"
                      >
                        {{ JSON.parse(activeRecommendation.input_data).cycle }}
                      </td>
                    </tr>

                    <!-- and so on... -->
                  </tbody>
                </table>
              </div>
              <div style="display:flex; align-items: center;  ">
                <h6 class="modal-title  pr-4">Recommended Plan:</h6>
                <div
                  :style="
                    computeDownpayment(activeRecommendation) ==
                    'There is no suitable plan'
                      ? 'color:red'
                      : 'color:green'
                  "
                  style="font-size: 16px;"
                >
                  {{ computeDownpayment(activeRecommendation) }}
                </div>
              </div>
            </div>
            <div class="px-5 pb-4" style="display:flex; justify-content:end">
              <button
                class=" mt-3 px-5 py-3"
                data-dismiss="modal"
                href="javascript:"
                style="text-align: right; border:none; border-radius: 3px; background-color: #074A74; color: white; font-weight: 700;"
              >
                Cancel
              </button>
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
  </transition>
</template>
<script>
import { mapGetters } from 'vuex'
import Vue from 'vue'
import { log } from '../../../utilities/log'
import Auth from '../../../utilities/auth'
import Flash from '../../../utilities/flash'
import { get, post, put } from '../../../utilities/api'
import CustomHeader from '../../../components/customHeader'
import AutoComplete from '../../../components/AutoComplete'
import NewOrderAmortization from '../../../components/NewOrderAmortization'
import CustomerProfile from '../../../components/CustomerProfile'
import { Order, OrderWithPromiseCall } from '../../../utilities/Amortization'
import CustomSMSButton from '../../../components/CustomSMSButton/CustomSMSButton'
import AutocompleteSearch from '../../../components/AutocompleteSearch/AutocompleteSearch'
import {
  getOrderStatus,
  getOrderStatusClass,
} from '../../../components/order/orderStatusCssClass'
import LogForm from '../../../components/LogForm'
import PaymentLog from '../../../components/PaymentLog'
import DatePicker from 'vue2-datepicker'
import 'vue2-datepicker/index.css'
import Discount from '../../../components/discount.vue'
import paystack from 'vue-paystack'
import PaystackModal from '../../../components/Paystack/PaystackModal'
import CustomDirectDebitModalButton from '../../../components/Paystack/CustomDirectDebitModalButton.vue'
import { EventBus } from '../../../utilities/event-bus'
import Roles from '../../../utilities/roles'
import { selectType } from '../../../utilities/log.js'
export default {
  components: {
    CustomHeader,
    CustomerProfile,
    CustomSMSButton,
    AutoComplete,
    AutocompleteSearch,
    LogForm,
    PaymentLog,
    NewOrderAmortization,
    DatePicker,
    Discount,
    paystack,
    PaystackModal,
    CustomDirectDebitModalButton,
  },
  props: { logger: null },

  data() {
    return {
      displayMore: false,
      activeRecommendation: null,
      recommendationList: null,
      states: {
        order: true,
        recommendation: false,
      },
      editOrder: {},
      Order: Order,
      newOrder: false,
      customer: null,
      order: {},
      customer_id: '',
      user: {
        name: Auth.state.user_name,
        id: Auth.state.user_id,
      },
      show: false,
      selectedProduct: {},
      showModal: false,
      showModalContent: false,
      ammo_item: {},
      actual_amount: null,
      activeOrder: null,
      authorization_code: null,
      headers: [
        'Date',
        'Order No.',
        'Product Name',
        'Total Product Price',
        'Type',
        'Customer Type',
        'Repayment Plans',
      ],
      recommendationHeaders: [
        'Date',
        'Type',
        'Product Price',
        'Duration',
        'Recommended Plans',
        'Input Data',
      ],
      products: [],
      paymentForm: { payments: [] },
      paymentFormType: 'add',
      showOrdermodal: false,
      currentOrder: {},
      apiURL: {
        product: `/api/product`,
      },
      roles: Roles,
      clickedOrder: null,
      paymentMeths: [],
      lateFEES: null,
      showPaystack: false,
      ShowCustomDirectDebitModal: false,
      verifyPaymentUrl: `https://api.paystack.co/transaction/verify/`,
      paystack_auth_code_url: '/api/pay_stack_auth_code',
      paystackkey: process.env.VUE_APP_PAYSTACK_KEY || '',
      paystack_secret_key: process.env.VUE_APP_PAYSTACK_SECRET_KEY || '',
      role: '',

      paystackReference: null,
    }
  },

  methods: {
    selectType(type) {
      selectType(type, this.states)
    },
    getClickedOrder(order) {
      this.clickedOrder = order
    },

    async submitForm() {
      const updateData = {
        product_id: this.selectedProduct.id,
        repayment: this.currentOrder.repayment,
        down_payment: this.currentOrder.down_payment,
        product_price: this.currentOrder.product_price,
        order_date: this.currentOrder.order_date,
      }
      this.$LIPS(true)
      put(`/api/new_order/${this.currentOrder.id}`, updateData)
        .then(res => {
          this.$LIPS(false)

          this.$swal({
            icon: 'success',
            title: 'Order Successfully Updated',
          })

          let x = this.customer.new_orders.findIndex(elem => {
            return elem.id === this.currentOrder.id
          })
          Vue.set(this.customer.new_orders, x, res.data.data)
          this.currentOrder = {}
          return $(`#updateOrderModal`).modal('toggle')
        })
        .catch(() => {
          this.$LIPS(false)
          Flash.setError('Error submitting form')
        })
    },
    updateOrder(order) {
      if (this.canEditPayment) {
        this.showOrdermodal = true
        this.currentOrder = order
        return $(`#updateOrderModal`).modal('toggle')
      }
    },
    async updateView(data) {
      let { customer, user } = data
      if (!!customer.length) {
        customer = customer[0]
        !customer.document &&
          (customer.document = { id_card_url: '', passport_url: '' })
        this.user.branch = user.branch_id
        this.customer = customer
        this.customer.orders = customer.orders
          ? customer.orders.map(order => {
              let orderWithCustomer = order
              orderWithCustomer.customer = this.customer
              return new OrderWithPromiseCall(
                orderWithCustomer,
                this.getAuthUserDetails.userId
              )
            })
          : []
        this.show = true
      } else Flash.setError('Customer not found.', 5000)
      this.$LIPS(false)
    },
    async getLateFee(order) {
      try {
        const fetchLateFee = await get(`api/late_fee?order=${order?.id}`)
        this.lateFEES = fetchLateFee.data.data.data
      } catch (err) {
        this.$displayErrorMessage(err)
      }
    },
    done() {
      this.show = false
    },
    getRecommendationList(id) {
      get(`/api/customer-recommendation/${id}`)
        .then(res => {
          this.recommendationList = res.data.data
          this.recommendationList.reverse()
        })
        .catch(e => {
          this.$LIPS(false)
          Flash.setError('Error Fetching customer detail')
        })
    },
    processForm(id) {
      this.show = false
      this.$LIPS(true)

      get(`/api/customer/lookup/${id}`)
        .then(res => {
          this.updateView(res.data)
          this.getRecommendationList(id)
          this.show = true
        })
        .catch(e => {
          this.$LIPS(false)
          Flash.setError('Error Fetching customer detail')
        })
    },

    calcDebt(amortization) {
      // * Assumed equal distribution of amortization
      if (amortization[0] !== undefined) {
        let res = amortization.filter(amor => {
          return amor.actual_amount === 0
        })
        return res.length * amortization[0].expected_amount
      }
    },
    displayActiveRecommendation(recommendation) {
      this.activeRecommendation = recommendation
      this.displayMore = true
      return $(`#recommendation`).modal('toggle')
    },

    async displayAmortization(order) {
      //   await this.chargeCustomerWithCustomDirectDebit(order);
      await this.getLateFee(order)
      if (order.status) {
        this.newOrder = true
        this.order = order
        if (order.amortization.length === 0) {
          alert('No amortization to view')
          return
        }
      } else {
        this.newOrder = false
        this.activeOrder = order
        this.paymentForm = { payments: [] }
      }

      this.showModalContent = true
      return $(`#amortization`).modal('toggle')
    },

    addPaymentForm(type) {
      if (this.newOrder) {
        let initLevel = 0

        this.order.amortization.every((item, index) => {
          if (item.actual_payment_date === null) {
            initLevel = index
            return false
          }
          return true
        })

        let nextRepayment = parseInt(
          initLevel + this.paymentForm.payments.length + 1
        )

        if (type !== this.paymentFormType) this.paymentForm.payments = []

        if (
          type === 'edit' &&
          (initLevel < 1 || this.paymentForm.payments.length >= initLevel)
        )
          return
        if (initLevel === this.order.amortization.length) return
        if (nextRepayment > this.order.amortization.length) return

        this.paymentFormType = type
        let newPaymentData = {
          _pay: this.order.amortization[initLevel].expected_amount,
          _date: this.$getDate(),
          _col: '',
          column: '',
        }

        if (type === 'add') {
          newPaymentData._payment_bank = ''
          newPaymentData._payment_method = ''
        }

        this.paymentForm.payments.push(newPaymentData)
      } else {
        this.paymentMeths = this.getPaymentMethods.filter(item => {
          return item.name !== 'direct-debit'
        })

        const level = this.activeOrder.repaymentLevel
        const nextRepayment = parseInt(
          level + this.paymentForm.payments.length + 1
        )

        if (type !== this.paymentFormType) this.paymentForm.payments = []
        if (
          type === 'edit' &&
          (level < 1 || this.paymentForm.payments.length >= level)
        )
          return
        if (level === this.activeOrder._count) return
        if (nextRepayment > this.activeOrder._count) return

        this.paymentFormType = type

        let newPaymentData = {
          _pay: this.activeOrder.amountsToBePaid[0],
          _date: this.$getDate(),
          _col: '',
          column: '',
        }

        if (type === 'add') {
          newPaymentData._payment_bank = ''
          newPaymentData._payment_method = ''
        }

        this.paymentForm.payments.push(newPaymentData)

        this.reNumber()
      }
    },

    deletePayment(index) {
      this.paymentForm.payments.splice(index, 1)
      this.reNumber()
    },

    selectedItem(value) {
      this.selectedProduct = value
    },
    formatDate(date) {
      if (date !== null) {
        let d = new Date(date)
        return d.toDateString()
      }
    },

    reNumber() {
      this.paymentForm.payments.forEach((payment, index) => {
        /*this line below mean if the repayment level is 3 i.e the customer has made 3 repayment
         * u want to display on the ui "4th repayment"
         * so repaymentLevel(3) + index(0 - length of the added payments) + 1*/
        let next = this.activeOrder.repaymentLevel + index + 1
        this.paymentForm.payments[index]._col = next
        this.paymentForm.payments[index].column =
          this.$getColumn(next) + ' Repayment'
      })
    },

    preparePayments(index = 0) {
      if (!this.canAddPayment) return
      let payments = {}
      this.paymentForm.payments.forEach(payment => {
        let obj = {},
          col = this.$getColumn(payment._col)
        obj[`${col}_pay`] = payment._pay
        obj[`${col}_date`] = payment._date
        if (this.paymentFormType === 'add') {
          obj[`${col}_payment_bank`] = payment._payment_bank
          obj[`${col}_payment_method`] = payment._payment_method
        }
        payments = { ...payments, ...obj }
      })
      this.activeOrder.payments = payments
      !$.isEmptyObject(payments)
        ? this.savePayments(index)
        : Flash.setError('You have not added any payment.')
    },
    updateAmmo(armo) {
      this.showModal = true
      this.ammo_item = armo
      return $(`#viewEdit`).modal('toggle')
    },
    save() {
      this.$LIPS(true)
      let data = {
        actual_amount: this.actual_amount,
      }

      put(`/api/amortization/${this.ammo_item.id}`, data)
        .then(res => {
          this.$swal({
            icon: 'success',
            title: 'Payment Updated Successfully',
          })

          this.$LIPS(false)
        })
        .catch(err => {
          Flash.setError('Unable to update payment')
        })
        .finally(() => {
          return $(`#viewEdit`).modal('toggle')
        })
    },

    savePayments(index) {
      if (!this.canAddPayment) return
      this.$LIPS(true)
      let type, data, order, orderIndex
      if (this.activeOrder.count === 6) type = 'formal'
      if (this.activeOrder.count === 12) type = 'informal'
      data = {
        payments: this.activeOrder.payments,
        type,
        repayment_id: this.activeOrder.order.id,
        order_id: this.activeOrder.order.id,
        amount: this.paymentForm.payments[0]._pay,
        payment_method_id: this.paymentForm.payments[index]._payment_method,
      }
      post(`/api/repayment`, data)
        .then(async res => {
          if (res.data.saved) {
            order = this.customer.orders.find((order, index) => {
              let found = order.order.id === data.repayment_id
              if (found) orderIndex = index
              return found
            }).order

            order[`repayment_${type}`] = res.data.amortization
            this.activeOrder = await new Order(order, this.customer)
            this.customer.orders[orderIndex] = this.activeOrder
            await this.logAddedPayment(data)
            if (this.activeOrder.repaymentLevel === this.activeOrder.count)
              this.sendPaymentCompleteSMS()
            this.paymentForm = { payments: [] }
            this.$scrollToTop()
            this.$LIPS(false)
          }
        })
        .catch(() =>
          Flash.setError('Error adding payment! Please try again later.')
        )
    },

    sendPaymentCompleteSMS() {
      return null //TODO: i was asked to disable the sms sent when a customer has completed payments.
      /*let messageBody = `Dear ${this.activeOrder.customerName}, you have successfully completed ` +
                    `your payment for ${this.activeOrder.order.store_product.product_name}. ` +
                    `Thanks for patronizing us.`,
                    message = new Message(messageBody, this.activeOrder.customer.telephone);
                message.send(r => r.status === 200 && Flash.setSuccess('Repayments Completed. SMS sent.'));*/
    },

    logAddedPayment(data) {
      let paymentsMade = this.paymentForm.payments
          .map(pmt => pmt.column.replace(/ /g, '_'))
          .join(' '),
        desc = `${paymentsMade}. Order: ID: ${data.repayment_id}. Customer ID: ${this.customer_id}`
      return log(`Payment(s) added`, desc)
    },

    getOrderStatus: activeOrder => getOrderStatus(activeOrder),

    getOrderStatusClass: orderStatus => getOrderStatusClass(orderStatus),
    newOrderItem(value) {
      this.updateView(value)
    },
    showDiscount(order) {
      if (
        order.order_discount &&
        order?.order_discount?.slug !== '0_discount'
      ) {
        return true
      } else {
        return false
      }
    },
    percentage(order) {
      return order?.order_discount?.percentage_discount
    },
    updateCustomerData(data) {
      let element = this.customer.new_orders.find(item => {
        return item.id === data.order
      })
      element.paystack_auth_code = data.auth_code
      let index = this.customer.new_orders.indexOf(element)
      Vue.set(this.$data.customer.new_orders, index, element)
    },
    computeDownpayment(result) {
      return typeof JSON.parse(result.result).ans == 'object' &&
        JSON.parse(result.result).ans[1] == 0
        ? `${JSON.parse(result.result).ans[0]}% downpayment`
        : typeof JSON.parse(result.result).ans == 'string'
        ? JSON.parse(result.result).ans
        : `${JSON.parse(result.result).ans[0]}% downpayment and ${
            JSON.parse(result.result).ans[1]
          } repayment`
    },
  },

  computed: {
    ...mapGetters([
      'getBanks',
      'getPaymentMethods',
      'auth',
      'getAuthUserDetails',
    ]),

    check() {
      return !(!this.$isProcessing && !!this.customer_id)
    },

    isReadOnly() {
      return this.$route.meta.readOnly
    },

    canAddPayment() {
      if (this.auth('FSLLead')) return true
      return (
        this.auth('supervisor') &&
        this.user.branch === this.activeOrder.branch.id
      )
    },

    canEditPayment() {
      if (this.auth('EditPayment')) return true
    },
  },

  created() {
    EventBus.$on('reloadUser', this.updateCustomerData)
    EventBus.$on('updateUser', this.processForm)
  },

  async mounted() {
    this.$prepareBanks()
    this.$prepareBranches()
    this.$preparePaymentMethods()
    this.role = parseInt(localStorage.getItem('role'))
  },
}
</script>

<style scoped>
.attendance-item {
  cursor: auto;
}
.amor-table {
  width: 1092px;
  overflow: scroll;
}
.pointer {
  cursor: pointer;
}
.discount_badge {
  margin-left: 10px;
}
.col2 {
  -ms-flex-preferred-size: 0;
  flex-basis: 0;
  -ms-flex-positive: 1;
  flex-grow: 1;
  max-width: 100%;
}
</style>
