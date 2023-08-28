<template>
  <transition name="fade">
    <div
      class="pt-md-3 pt-2 verification overflow-hidden"
      id="employeeRegister"
    >
      <AutocompleteSearch
        title="customer verification"
        @customer-selected="processForm"
        :url="'/api/customer/autocomplete'"
      />

      <transition name="fade">
        <div v-if="customer">
          <customer-profile :view-customer="customer" />
          <div style="display: flex; " v-if="action !== 'update'">
            <custom-header
              :title="'All Document(s)'"
              @click.native="selectType('order')"
              :style="
                !states.order
                  ? 'opacity: 0.2; cursor:pointer;'
                  : 'cursor:pointer;'
              "
            />

            <custom-header
              :title="'Verifications'"
              v-if="forDVA"
              @click.native="selectType('verification')"
              :style="
                !states.verification
                  ? 'opacity: 0.2; cursor:pointer;'
                  : 'cursor:pointer; '
              "
              style="margin-left:-10px"
            />

            <custom-header
              :title="'Credit Report'"
              v-if="forCreditChecker"
              @click.native="selectType('credit_report')"
              :style="
                !states.credit_report
                  ? 'opacity: 0.2; cursor:pointer;'
                  : 'cursor:pointer; '
              "
              style="margin-left:-10px"
            />

            <!-- <div
              class="mt-5 attendance-head ml-auto pointer"
              @click="addDocument"
              v-if="states.order"
            >
              <div class="title">
                <i class="fas fa-plus-circle" style="font-size: 16px;"></i>

                Add More
              </div>
            </div> -->
          </div>
          <div v-if="action !== 'update'" class="w-100">
            <div>
            <div v-if="states.order">
              <div
              class="float-left col-lg-3 col-sm-6 px-0 px-sm-3"
              v-for="(type, index) in veriView"
              :key="index"
            >
              <div :class="DivClass(type) " class="card card-stats" >
                <div class="card-body ">
                  <div class="statistics statistics-horizontal">
                    <div class="info info-horizontal">
                      <div class="row">
                        <div class="col-4">
                          <div
                            class="icon icon-warning icon-circle position-relative"
                          >
                            <i :class="IconClass(type)" class="fas"></i>
                          </div>
                        </div>
                        <div class="col-8 text-right">
                          <h4 class="info-title font-weight-bold mb-0">
                            {{ type | capitalize }}
                          </h4>
                          <h6 class="stats-title">
                            {{ key(type) ? "Verified" : "Not Verified" }}
                          </h6>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  @click="modal(type + '_modal')"
                  class="card-footer pointer"
                >
                  <i class="now-ui-icons ui-1_calendar-60 pr-1"></i>
                  {{ key(type) ? "Verified" : "Not Verified" }}
                  <small v-if="!key(type)" style="font-size: 9px"
                    >(Click here to update status!)</small
                  >
                  <span class="float-right" style="font-size: 10px" v-else>
                    by - {{ customer["document"].staff_name | capitalize }}
                  </span>
                </div>
              </div>
            </div>
            <div
              class="float-left col-lg-3 col-sm-6 px-0 px-sm-3"
              v-for="(type, index) in picsView"
              
              :key="index"
            >
              <div :class="DivClass(type) " class="card card-stats" >
                <div class="card-body ">
                  <div class="statistics statistics-horizontal">
                    <div class="info info-horizontal">
                      <div class="row">
                        <div class="col-4">
                          <div
                            class="icon icon-warning icon-circle position-relative" v-if="displayActiveDocument(type)"
                          >
                            <!-- <i :class="IconClass(type)" class="fas"></i> -->
                            <i :class="'fa-check'" class="fas"></i>
                          </div>
                          <div
                            class="icon icon-warning icon-circle position-relative" v-if="!displayActiveDocument(type)"
                          >
                            <!-- <i :class="IconClass(type)" class="fas"></i> -->
                            <i :class="'fa-times'" class="fas"></i>
                          </div>
                        </div>
                        <div class="col-8 text-right">
                          <h4 class="info-title font-weight-bold mb-0">
                            {{ type | capitalize }}
                          </h4>
                          <h6 class="stats-title">
                            {{ displayActiveDocument(type) ? "Verified" : "Not Verified" }}
                          </h6>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  @click="modal(type + '_modal')"
                  class="card-footer pointer d-flex flex-wrap justify-content-between"
                >
                <div>
                  <i class="now-ui-icons ui-1_calendar-60 pr-1"></i>
                  {{ displayActiveDocument(type) ? "Verified" : "Not Verified" }}
                  <small v-if="!displayActiveDocument(type)" style="font-size: 9px"
                    >(Click here to update status!)</small
                  >
                </div>
                  <div v-for="(item, index) in customer.new_documents" :key="index" class="">
                  <div v-if="item.name === type">
                  <span class="float-right" style="font-size: 10px" >
                    by - {{ item.user | capitalize }}
                  </span>
                  </div>
                  </div>
                </div>
              </div>
            </div>
            </div>
            </div>

            <div class="w-100 d-flex flex-wrap">
              <!-- <div
                class=" col-lg-3 col-sm-6 px-3"
                v-for="item in customer.new_documents"
                v-if="states.order && customer.new_documents.length > 0"
              >
                <div :class="'success'" class="card card-stats">
                  <div class="card-body ">
                    <div class="statistics statistics-horizontal">
                      <div class="info info-horizontal">
                        <div class="row">
                          <div class="col-4">
                            <div
                              class="icon icon-warning icon-circle position-relative"
                            >
                              <i :class="'fa-check'" class="fas"></i>
                            </div>
                          </div>
                          <div class="col-8 text-right">
                            <h4 class="info-title font-weight-bold mb-0">
                              {{ item.name | capitalize }}
                            </h4>
                            <h6 class="stats-title">
                              {{ "Verified" }}
                            </h6>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="card-footer pointer" @click="viewDocument(item)">
                    <span class="float-right" style="font-size: 10px">
                      by - {{ item.user | capitalize }}
                    </span>
                  </div>
                </div>
              </div> -->
            </div>

            <div v-if="states.verification" class="mb-5">
              <div class="mt-5 mb-3 attendance-head">
                <div class="row px-4 pt-3 pb-4 text-center">
                  <div class="col light-heading" style="max-width: 150px">
                    S/No.
                  </div>
                  <div
                    class="col light-heading"
                    v-for="(header, index) in verificationHeaders"
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
                  v-if="verificationList.length > 0"
                >
                  <div
                    class="mb-3 row attendance-item text-center"
                    v-for="(verification, index) in verificationList"
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
                      {{ formatDate(verification.created_at) }}
                    </div>

                    <div
                      class="
                    col-12 col-xs-3 col-md col-lg
                    d-flex
                    align-items-center

                  "
                    >
                      {{ JSON.parse(verification.input_data).verifiedBy }}
                    </div>

                    <div
                      class="
                    col-12 col-xs-2 col-md col-lg
                    d-flex
                    align-items-center

                  "
                    >
                      <button
                        @click="displayActiveVerification(verification)"
                        class="btn status approved"
                      >
                        View
                      </button>
                    </div>
                  </div>
                </div>

                <div
                  class="tab-pane active text-center"
                  v-if="verificationList.length == 0"
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

            <div v-if="states.credit_report" class="mb-5">
              <div class="mt-5 mb-3 attendance-head">
                <div class="row px-4 pt-3 pb-4 text-center">
                  <div class="col light-heading" style="max-width: 150px">
                    S/No.
                  </div>
                  <div
                    class="col light-heading"
                    v-for="(header, index) in creditReportHeaders"
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
                  v-if="creditReportList.length > 0"
                >
                  <div
                    class="mb-3 row attendance-item text-center"
                    v-for="(creditReport, index) in creditReportList"
                    :key="index"
                  >
                    <div
                      class="
                    col-12 col-xs-2 col-md col-lg
                    d-flex

                  "
                      style="max-width: 150px; margin-left: -15px;"
                    >
                      <span
                        class="user mx-auto text-white"
                        :class="[
                          JSON.parse(creditReport.input_data).status ===
                          'declined'
                            ? 'bg-danger'
                            : 'bg-success',
                        ]"
                        >{{ index + 1 }}</span
                      >
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
                      {{ formatDate(creditReport.created_at) }}
                    </div>

                    <div
                      class="
                    col-12 col-xs-3 col-md col-lg
                    d-flex
                    align-items-center

                  "
                    >
                      {{ JSON.parse(creditReport.input_data).verifiedBy }}
                    </div>

                    <div
                      class="
                    col-12 col-xs-3 col-md col-lg
                    d-flex
                    align-items-center

                  "
                    >
                      {{ JSON.parse(creditReport.input_data).customer_type }}
                    </div>

                    <div
                      class="
                    col-12 col-xs-3 col-md col-lg
                    d-flex
                    align-items-center

                  "
                    >
                      {{
                        JSON.parse(creditReport.input_data).status || "upper"
                      }}
                    </div>

                    <div
                      class="
                    col-12 col-xs-2 col-md col-lg
                    d-flex
                    align-items-center

                  "
                    >
                      <button
                        @click="displayActiveCreditReport(creditReport)"
                        class="btn status approved"
                      >
                        View
                      </button>
                    </div>
                  </div>
                </div>

                <div
                  class="tab-pane active text-center"
                  v-if="creditReportList.length == 0"
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
            <hr class="style-two" />
          </div>
        </div>
      </transition>

      <div v-if="action !== 'update'">
        <div v-if="states.order">
              <div :id="type + '_modal'" class="modal fade" v-for="(type, index) in picsView" :key="index">
                <div class="modal-dialog"  :style="{ pointerEvents:( type == 'passport' || type == 'id_card') ? 'none' : 'auto' }">
                  <div class="modal-content">
                    <div class="modal-header py-2">
                      <h6 class="modal-title py-1">
                        {{ type | capitalize }} Verification Status
                      </h6>
                      <a
                        aria-label="Close"
                        class="close py-1"
                        data-dismiss="modal"
                        href="javascript:"
                      >
                        <span aria-hidden="true" class="modal-close text-danger">
                          <i class="fas fa-times"></i>
                        </span>
                      </a>
                    </div>
                    <form
                      @submit.prevent="save(type, type + '_modal')"
                      enctype="multipart/form-data"
                      v-if="customer"
                    >
                      <div class="modal-body">
                        <div class="bg-default text-white">
                          max-size: 512kb max-dimension: 1200 x 1200
                        </div>
                        <div class="upload-image p-2">
                          <div class="upload-box" v-if="!displayActiveDocument(type)">
                            <image-upload v-model="$data['form'][type]" />
                          </div>
                          <div>
                          <div v-if="displayActiveDocument(type)">
                            <div v-for="(item, index) in customer.new_documents" :key="index">
                              <div v-if="item.name === type">
                                <image-upload :value="item.document_url" />
                              </div>

                            </div>
                        </div>
                          </div>
                        </div>
                        <small v-if="error[type]">{{ error[type][0] }}</small>
                      </div>
                      <div class="modal-footer">
                        <button
                          class="m-2 btn btn-secondary"
                          data-dismiss="modal"
                          type="button"
                        >
                          cancel
                        </button>
                        <button
                          :disabled="$isProcessing"
                          class="m-2 btn bg-default"
                          type="submit"
                        >
                          Save changes <i class="far fa-paper-plane ml-1"></i>
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
        </div>

        <div class="modal fade" id="address_modal">
          <div class="modal-dialog modal-lg">
            <div class="modal-content">
              <div class="modal-header py-2">
                <h6 class="modal-title py-1">Address Verification Status</h6>
                <a
                  @click="modal('address_modal')"
                  class=" py-1"
                  style="min-height: 30px; min-width: 30px;"
                >
                  <span class="text-danger"><i class="fas fa-times"></i></span>
                </a>
              </div>
              <form
                :data-vv-scope="'address'"
                @submit.prevent="validate('address')"
              >
                <div class="modal-body p-5">
                  <table class="mb-3 w-100 info-table">
                    <tbody class="px-3">
                      <tr>
                        <th><i class="fas fa-map-marker-alt mx-4"></i></th>
                        <td>{{ $getCustomerAddress(customer) }}</td>
                      </tr>
                    </tbody>
                  </table>
                  <div class="w-100 p-3">
                    <div class="clearfix">
                      <div
                        class="form-group float-left col-md-6 col-12 pr-md-3 pr-0 pl-0"
                      >
                        <label>Date of Visitation</label>
                        <input
                          class="form-control"
                          data-vv-as="date of visit"
                          name="date_of_visit"
                          type="date"
                          v-model="address.date_of_visit"
                          v-validate="'required'"
                        />

                        <small v-if="errors.first('address.date_of_visit')">
                          {{ errors.first("address.date_of_visit") }}
                        </small>
                      </div>
                      <div
                        class="form-group float-left  col-md-6 col-12  pl-md-3 pl-0 pr-0"
                      >
                        <label>Time of Visit</label>
                        <input
                          class="form-control"
                          data-vv-as="time of visit"
                          name="time_of_visit"
                          type="time"
                          v-model="address.time_of_visit"
                          v-validate="'required'"
                        />
                        <small v-if="errors.first('address.time_of_visit')">
                          {{ errors.first("address.time_of_visit") }}
                        </small>
                      </div>
                    </div>

                    <div class="form-group clearfix">
                      <label>1. Did you meet the customer?</label>
                      <span class="radio mx-5">
                        <input
                          data-vv-as="customer meetup"
                          id="yes"
                          name="customer_meetup"
                          type="radio"
                          v-model="address.customer_meetup"
                          v-validate="'required'"
                          value="yes"
                        />
                        <label for="yes">Yes</label>
                      </span>
                      <span class="radio ml-5">
                        <input
                          id="no"
                          name="customer_meetup"
                          type="radio"
                          v-model="address.customer_meetup"
                          value="no"
                        />
                        <label for="no">No</label>
                      </span>

                      <small v-if="errors.first('address.customer_meetup')">
                        {{ errors.first("address.customer_meetup") }}
                      </small>
                    </div>

                    <div class="form-group clearfix">
                      <label>
                        2. Is the address/location same with what you have in
                        the application form?
                      </label>
                      <span class="radio mx-5">
                        <input
                          data-vv-as="confirm address"
                          id="add_yes"
                          name="confirm_address"
                          type="radio"
                          v-model="address.confirm_address"
                          v-validate="'required'"
                          value="yes"
                        />
                        <label for="add_yes">Yes</label>
                      </span>
                      <span class="radio ml-5">
                        <input
                          id="add_no"
                          name="confirm_address"
                          type="radio"
                          v-model="address.confirm_address"
                          value="no"
                        />
                        <label for="add_no">No</label>
                      </span>
                      <small v-if="errors.first('address.confirm_address')">
                        {{ errors.first("address.confirm_address") }}
                      </small>
                    </div>

                    <div class="form-group clearfix">
                      <label>3. What does he/she do or sell?</label>
                      <input
                        class="form-control"
                        data-vv-as="what he sells"
                        name="what_he_sells"
                        placeholder="comment here..."
                        type="text"
                        v-model="address.what_he_sells"
                        v-validate="'required'"
                      />
                      <small v-if="errors.first('address.what_he_sells')">
                        {{ errors.first("address.what_he_sells") }}
                      </small>
                    </div>

                    <div class="form-group clearfix">
                      <label
                        >4. Look around the shop and check the nature and
                        condition of the business. Write down what you see in
                        terms of address, stock value, premise, type of shop or
                        business, sales etc.</label
                      >
                      <textarea
                        class="form-control"
                        data-vv-as="business info"
                        name="business_info"
                        placeholder="comment here..."
                        rows="1"
                        v-model="address.business_info"
                        v-validate="'required'"
                      ></textarea>
                      <small v-if="errors.first('address.business_info')">
                        {{ errors.first("address.business_info") }}
                      </small>
                    </div>

                    <div class="form-group clearfix">
                      <label
                        >5. Get exact information of choice of product and
                        specification by asking for Example; what exact phone do
                        you want? Let him/her specify e.g. INFINIX SMART or HOT
                        4 IPHONE
                      </label>
                      <textarea
                        class="form-control w-100"
                        data-vv-as="product info"
                        name="product_info"
                        placeholder="comment here..."
                        rows="1"
                        v-model="address.product_info"
                        v-validate="'required'"
                      ></textarea>
                      <small v-if="errors.first('address.product_info')">
                        {{ errors.first("address.product_info") }}
                      </small>
                    </div>

                    <div class="form-group clearfix">
                      <label>
                        6. Are you aware of the payment plan?
                      </label>
                      <span class="radio mx-5">
                        <input
                          data-vv-as="aware of plan"
                          id="pay_yes"
                          name="aware_of_plan"
                          type="radio"
                          v-model="address.aware_of_plan"
                          v-validate="'required'"
                          value="yes"
                        />
                        <label for="pay_yes">yes</label>
                      </span>
                      <span class="radio ml-5">
                        <input
                          id="pay_no"
                          name="aware_of_plan"
                          type="radio"
                          v-model="address.aware_of_plan"
                          value="no"
                        />
                        <label for="pay_no">no</label>
                      </span>
                      <small v-if="errors.first('address.aware_of_plan')">
                        {{ errors.first("address.aware_of_plan") }}
                      </small>
                    </div>

                    <div class="form-group clearfix">
                      <label>
                        7. Did you get information about the customer from
                        his/her neighbours?
                      </label>
                      <span class="radio mx-5">
                        <input
                          data-vv-as="info from neighbors"
                          id="neigh_yes"
                          name="info_from_neighbors"
                          type="radio"
                          v-model="info_from_neighbors"
                          v-validate="'required'"
                          value="yes"
                        />
                        <label for="neigh_yes">yes</label>
                      </span>
                      <span class="radio ml-5">
                        <input
                          id="neigh_no"
                          name="info_from_neighbors"
                          type="radio"
                          v-model="info_from_neighbors"
                          value="no"
                        />
                        <label for="neigh_no">no</label>
                      </span>
                      <small v-if="errors.first('address.info_from_neighbors')">
                        {{ errors.first("address.info_from_neighbors") }}
                      </small>

                      <div v-if="info_from_neighbors == 'yes'">
                        <textarea
                          class="form-control"
                          data-vv-as="info from neighbors desc"
                          name="info_from_neighbors_desc"
                          placeholder="comment here..."
                          rows="1"
                          v-model="address.info_from_neighbors_desc"
                          v-validate="'required'"
                        ></textarea>
                        <small
                          v-if="
                            errors.first('address.info_from_neighbors_desc')
                          "
                        >
                          {{ errors.first("address.info_from_neighbors_desc") }}
                        </small>
                      </div>
                    </div>

                    <div class="form-group clearfix">
                      <label
                        >8. And how long has he/she been working/trading in that
                        particular place?
                      </label>
                      <textarea
                        class="form-control"
                        data-vv-as="business or work duration"
                        name="business_or_work_duration"
                        placeholder="address"
                        rows="1"
                        v-model="address.business_or_work_duration"
                        v-validate="'required'"
                      ></textarea>
                      <small
                        v-if="errors.first('address.business_or_work_duration')"
                      >
                        {{ errors.first("address.business_or_work_duration") }}
                      </small>
                    </div>

                    <div v-if="addressBtns">
                      <div class="w-100 clearfix">
                        <button
                          :disabled="$isProcessing"
                          @click="address.approval_status = 1"
                          class="btn btn-success btn-lg btn-block"
                          type="submit"
                        >
                          Successful - Update Details
                          <i class="far fa-paper-plane ml-1"></i>
                        </button>
                      </div>

                      <div class="pt-2 w-100 clearfix">
                        <div
                          class="pr-2 pl-md-0 pl-2 col-md-6 col-12 m-0 float-left"
                        >
                          <button
                            @click="modal('address_modal')"
                            class="m-0 btn btn-lg btn-block btn-secondary"
                            type="button"
                          >
                            Cancel
                          </button>
                        </div>
                        <div
                          class="pl-2 pr-md-0 pr-2 col-md-6 col-12 float-left"
                        >
                          <button
                            :disabled="$isProcessing"
                            @click="address.approval_status = 0"
                            class="m-0 btn btn-lg btn-block btn-primary"
                            type="submit"
                          >
                            Not-Successful - Update Details
                            <i class="far fa-paper-plane ml-1"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                    <h5 v-else>
                      This customers details has already been updated once and
                      cannot be changed!
                    </h5>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div :id="type + '_modal'" class="modal fade" v-for="(type, index) in veriView" :key="index">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header py-2">
                <h6 class="modal-title py-1">
                  {{ type | capitalize }}
                  {{ type !== "processing_fee" ? "Verification" : "" }} Status
                </h6>
                <a
                  aria-label="Close"
                  class="close py-1"
                  data-dismiss="modal"
                  href="javascript:"
                >
                  <span class="modal-close text-danger"
                    ><i class="fas fa-times"></i
                  ></span>
                </a>
              </div>
              <form
                :data-vv-scope="type"
                @submit.prevent="validate(type)"
                v-if="customer"
              >
                <div class="modal-body">
                  <table
                    class="mb-3 info-table"
                    v-if="type !== 'processing_fee'"
                  >
                    <tbody>
                      <tr>
                        <th><i class="fas fa-map-marker-alt"></i></th>
                        <td v-if="customer[type + '_state']">
                          {{ $data[type + "_address"] }}
                        </td>
                        <td v-else>please update customer details!</td>
                      </tr>
                      <tr>
                        <th><i class="fas fa-mobile-alt"></i></th>
                        <td v-if="customer[type + '_telno']">
                          {{ customer[type + "_telno"] }}
                        </td>
                        <td v-else>please update customer details!</td>
                      </tr>
                      <tr>
                        <th><i class=" fas fa-user-circle"></i></th>
                        <td v-if="customer[type + '_first_name']">
                          {{
                            `${customer[type + "_first_name"]} ${
                              customer[type + "_last_name"]
                            }`
                          }}
                        </td>
                        <td v-else>please update customer details!</td>
                      </tr>
                      <tr>
                        <th><i class="fas fa-user-circle"></i></th>
                        <td v-if="customer[type + '_relationship']">
                          {{ customer[type + "_relationship"] | capitalize }}
                        </td>
                        <td v-else>please update customer details!</td>
                      </tr>
                    </tbody>
                  </table>

                  <div class="form-group col-12 px-2 clearfix my-0">
                    <div class="clearfix">
                      <div
                        class="form-group float-left col-md-6 col-12 pr-md-3 pr-0 pl-0"
                      >
                        <label>
                          Date
                          {{
                            type !== "processing_fee" ? "of Call" : "Collected"
                          }}
                        </label>
                        <input
                          class="form-control"
                          name="date_of_call"
                          type="date"
                          v-if="type !== 'processing_fee'"
                          v-model="$data[type].date_of_call"
                          v-validate="'required'"
                        />
                        <input
                          class="form-control"
                          name="date_of_call"
                          type="date"
                          v-else
                          v-model="$data[type].date_collected"
                          v-validate="'required'"
                        />

                        <small v-if="errors.first(type + '.date_of_call')">
                          {{ errors.first(type + ".date_of_call") }}
                        </small>

                        <small v-if="errors.first(type + '.date_collected')">
                          {{ errors.first(type + ".date_collected") }}
                        </small>
                      </div>
                      <div
                        class="form-group float-left col-md-6 col-12 pl-md-3 pl-0 pr-0"
                      >
                        <label>
                          Time
                          {{
                            type !== "processing_fee" ? "of Call" : "Collected"
                          }}
                        </label>
                        <input
                          class="form-control"
                          name="time_of_call"
                          type="time"
                          v-if="type !== 'processing_fee'"
                          v-model="$data[type].time_of_call"
                          v-validate="'required'"
                        />
                        <input
                          class="form-control"
                          name="time_collected"
                          type="time"
                          v-else
                          v-model="$data[type].time_collected"
                          v-validate="'required'"
                        />

                        <small v-if="errors.first(type + '.time_of_call')">
                          {{ errors.first(type + ".time_of_call") }}
                        </small>

                        <small v-if="errors.first(type + '.time_collected')">
                          {{ errors.first(type + ".time_collected") }}
                        </small>
                      </div>
                    </div>
                    <div class="clearfix">
                      <label class="w-100">
                        {{ type | capitalize }}
                        {{
                          type !== "processing_fee"
                            ? "Consent"
                            : "Amount(Naira)"
                        }}
                      </label>
                      <div v-if="type !== 'processing_fee'">
                        <div class="radio p-0 col-6 float-left">
                          <input
                            :id="type + '_yes'"
                            name="consent"
                            type="radio"
                            v-model="$data[type].consent"
                            v-validate="'required'"
                            value="1"
                          />
                          <label :for="type + '_yes'">Gave Consent</label>
                        </div>
                        <div class="radio p-0 col-6 float-left">
                          <input
                            :id="type + '_no'"
                            name="consent"
                            type="radio"
                            v-model="$data[type].consent"
                            value="0"
                          />
                          <label :for="type + '_no'"
                            >Did not Give Consent</label
                          >
                        </div>
                        <small v-if="errors.first(type + '.consent')">
                          {{ errors.first(type + ".consent") }}
                        </small>
                      </div>

                      <div v-else>
                        <div class="radio p-0 col-6 float-left">
                          <input
                            class="form-control"
                            disabled
                            name="amount"
                            type="number"
                            v-model="$data[type].amount"
                            v-validate="'required'"
                          />
                        </div>
                        <small v-if="errors.first(type + '.amount')">
                          {{ errors.first(type + ".amount") }}
                        </small>
                      </div>
                    </div>
                    <div class="clearfix">
                      <label>Report</label>
                      <textarea
                        class="form-control w-100"
                        name="report"
                        placeholder="comment here..."
                        rows="3"
                        v-model="$data[type].report"
                        v-validate="'required'"
                      ></textarea>
                      <small v-if="errors.first(type + '.report')">
                        {{ errors.first(type + ".report") }}
                      </small>
                    </div>
                  </div>
                </div>
                <div class="modal-footer" v-if="$data[type + 'Btns']">
                  <button
                    class="m-2 btn btn-secondary"
                    data-dismiss="modal"
                    type="button"
                  >
                    cancel
                  </button>
                  <button
                    :disabled="$isProcessing"
                    class="m-2 btn bg-default"
                    type="submit"
                  >
                    Save changes <i class="far fa-paper-plane ml-1"></i>
                  </button>
                </div>
                <div class="modal-footer" v-else>
                  <h5>
                    This customers details has already been updated once and
                    cannot be changed!
                  </h5>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
import Vue from "vue"
import { log } from "../../../utilities/log"
import Flash from "../../../utilities/flash"
import { get, post, put } from "../../../utilities/api"
import { EventBus } from "../../../utilities/event-bus"
import { toMulipartedForm } from "../../../utilities/form"
import ImageUpload from "../../../components/ImageUpload"
import CustomerProfile from "../../../components/CustomerProfile"
import AutocompleteSearch from "../../../components/AutocompleteSearch/AutocompleteSearch"
import { selectType } from "../../../utilities/log.js"
import CustomHeader from "../../../components/customHeader"
import ViewVerificationCheckList from "../../../components/modals/ViewVerificationCheckList.vue"
import ViewCreditReportModal from "../../../components/modals/ViewCreditReportModal.vue"
import AddDocumentModal from "../../../components/modals/AddDocumentModal.vue"
import ShowDocumentModal from "../../../components/modals/ShowDocumentModal.vue"
import { mapActions, mapGetters } from "vuex"

const init = ({ id }) => `/api/customer/${id}`

export default {
  props: {
    action: { default: "verify" },
    /*by default this component is used for dva verifications purposed but its customer search feature and
     * customer profile display feature is borrowed by other component to avoid duplication of
     * features hence the props: action is 'verify by default.'*/
  },

  components: {
    ImageUpload,
    /*the image upload is used for the customer id and passport upload.
     * its a separate component on its own and can be called
     * anywhere on the application*/
    CustomerProfile,
    AutocompleteSearch,
    CustomHeader,
  },

  data() {
    return {
      recommendationList: null,
      verificationList: null,
      creditReportList: null,
      customer: null,
      customer_id: "",
      addressBtns: true,
      work_guarantorBtns: true,
      personal_guarantorBtns: true,
      processing_feeBtns: true,
      info_from_neighbors: "",
      address: {},
      work_guarantor: {},
      personal_guarantor: {},
      processing_fee: {},
      states: {
        order: true,
        verification: false,
        credit_report: false,
      },
      verificationHeaders: ["Date", "Verified By", "More Information"],
      creditReportHeaders: [
        "Date",
        "Compiled By",
        "Report Type",
        "Status",
        "More Information",
      ],
      picsView: ["id_card", "passport", "proof_of_income", "guarantor_id", "utility_bill", "residence_proof"],
      veriView: ["work_guarantor", "personal_guarantor", "processing_fee", "address"],
      veriData: [
        "address",
        "work_guarantor",
        "personal_guarantor",
        "processing_fee",
      ],
      cardView: [
        "passport",
        "id_card",
        "address",
        "work_guarantor",
        "personal_guarantor",
        "processing_fee",
        "guarantor_id",
        "proof_of_income",
        "utility_bill",
        "residence_proof"
      ],
      verification: {},
      form: {
        id_card: "",
        passport: "",
        document: "",
        proof_of_income: "",
        guarantor_id: "",
        utility_bill: "",
        residence_proof: "",
      },
      error: {},
      storeURL: "",
      user: {},
      work_guarantor_address: "",
      personal_guarantor_address: "",
      fileName: null,
      verificationData: {},
      file: null,
      imgSrc: null,
      displayDocument: false,
    }
  },

  beforeRouteEnter({ query }, from, next) {
    if (query.id)
      get(init(query))
        .then(res => next(vm => vm.updateView(res.data)))
        .catch(e => next(vm => vm.updateView(e.response.data)))
    else next()
  },

  beforeRouteUpdate({ query }, from, next) {
    if (query.id)
      get(init(query))
        .then(res => this.updateView(res.data))
        .catch(e => this.updateView(e.response.data))
        .finally(() => next())
    else next()
  },

  methods: {
    selectType(type) {
      selectType(type, this.states)
    },
    modal(name) {
      $(`#${name}`).modal("toggle")
      /*this method is used to automatically
       * toggle the modal with the id of
       * "name passed to it"*/
      this.errors.clear(name)
    },

    key(key) {
      return this.customer.verification[key]
      /*the 'key' is a value that exists in the cardView array. anytime its called it checks the the customer
       * to know the status of that particular parameter eg. is the passport have not been uploaded
       * it will be 0 else 1 if uploaded with will return true */
    },

    IconClass(key) {
      return {
        "fa-check": this.key(key),
        "fa-times": !this.key(key),
      }
      /*return the 'fa-check' css class is that particular
       * card param is set to 1 else the 'fa-times'
       * css class ie false */
    },
  
    DivClass(key) {
      return {
        success: this.displayActiveDocument(key),
        "no-success": !this.displayActiveDocument(key),
      }
      /*this is similar to the DivClass method only
       * that it return a different class
       * success and no-success*/
    },

    updateView(data) {
      /*$emit update event is used to send data to the parent component where this serves as a child
       * component. eg. dsa utility form. NB: The customer registration component(form)
       * is used as the customer update form for both dsa and dva portal.*/
      this.user = data.hasOwnProperty("user") ? data.user : null
      Vue.set(this.$data, "customer", data.customer)
      this.$emit("update", data.customer)
      EventBus.$emit("customer", data.customer)
      if (data.customer) {
        this.verification = JSON.parse(
          JSON.stringify(data.customer.verification)
        )
        this.form.id_card = data.customer.new_documents.id_card_url
        this.form.passport = data.customer.new_documents.passport_url
        this.work_guarantor_address = `${this.customer.guaadd_houseno},
                        ${this.customer.guaadd_street},
                        ${this.customer.gua_area},
                        ${this.customer.work_guarantor_city},
                        ${this.customer.work_guarantor_state}`
        this.personal_guarantor_address = `${this.customer?.pguaadd_houseno},
                        ${this.customer?.pguaadd_street},
                        ${this.customer?.pgua_area},
                        ${this.customer?.personal_guarantor_city},
                        ${this.customer?.personal_guarantor_state}`
        this.form.guarantor_id = data?.customer?.new_documents?.guarantor_id_url
        this.form.proof_of_income =
          data?.customer?.new_documents?.proof_of_income_url
          this.form.utility_bill = data?.customer?.new_documents?.utility_bill_url
          this.form.residence_proof = data?.customer?.new_documents?.residence_url
        this.veriData.forEach(e => {
          //e is the current array element during the foreach call;
          this[`${e}Btns`] = !!!data.customer[e]
          //eg this.work_guarantorBtns = if (data.customer.work_guarantor) {return true} else {return false}
          //and anything the if return will be inverted.
          this[e] = !!data.customer[e] ? data.customer[e] : data[`empty_${e}`]
          //eg this.work_guarantor = if(data.customer.work_guarantor){ return data.customer.work_guarantor }
          // else {return data.empty_work_guarantor}
          //the empty_work_guarantor is returned from backend when no work guarantor has been added.

          this.getRecommendationList(this.customer.id)
        })
      } else Flash.setError(data.message, 5000)
    },

    done() {
      return null //TODO:I was asked to disable the sms sent when a customer is approved
      /*if (this.$getCustomerApprovalStatus(this.verification)){
                let body =
                    "Dear " + this.$getCustomerFullName(this.customer) + ", Congratulations, You have been approved. Come to the store to make a purchase. Altara Credit Limited.";
                (new Message(body, this.customer.telephone, true, this.user.id)).send();
            }*/
    },

    processForm(id) {
      if (this.$route.meta.mode === "verification") {
        this.getRecommendationList(id)
        this.$router.push(`verification?id=${id}`)
      }
      if (this.$route.name === "customerUpdate") {
        this.$router.push(`update?id=${id}`)
        get(init(this.$route.query))
          .then(res => this.updateView(res.data))
          .catch(e => this.updateView(e.response.data))
      }
    },
    formatDate(date) {
      if (date !== null) {
        let d = new Date(date)
        return d.toDateString()
      }
    },
    displayActiveVerification(verification) {
      this.$modal.show(
        ViewVerificationCheckList,
        { verification: JSON.parse(verification.input_data) },
        {
          name: "verificationView",
          classes: ["w-50", "overflow-auto"],
          adaptive: true,
          resizable: true,
          height: "auto",
          width: "50%",
          clickToClose: true,
        }
      )
    },

    displayActiveDocument(document) {
      return this.customer.new_documents.find((item)=> item.name === document)
    },

    imageUrl(url){
        return `${process.env.VUE_APP_S3_URL}/${url}`
    },

    displayActiveCreditReport(creditReport) {
      this.$modal.show(
        ViewCreditReportModal,
        { creditReport: JSON.parse(creditReport.input_data) },
        {
          name: "creditReportView",
          classes: ["w-50", "overflow-auto"],
          adaptive: true,
          resizable: true,
          height: "80%",
          width: "50%",
          clickToClose: true,
        }
      )
    },

    addDocument() {
      this.$modal.show(
        AddDocumentModal,
        { customer: this.customer },
        {
          name: "addDocumentModal",
          classes: ["w-50", "overflow-auto"],
          adaptive: true,
          resizable: true,
          height: "auto",
          width: "50%",
          clickToClose: true,
        },
        {
          closed: () => {
            this.$router.go()
          },
        }
      )
    },

    viewDocument(document) {
      this.$modal.show(
        ShowDocumentModal,
        { document },
        {
          name: "viewDocumentModal",
          classes: ["w-50", "overflow-auto"],
          adaptive: true,
          resizable: true,
          height: "auto",
          width: "50%",
          clickToClose: true,
        }
      )
    },

    validate(type) {
      if (this.$network()) {
        this.$LIPS(true)
        if (
          this.veriView.includes(type) &&
          !this.customer.work_guarantor_first_name
        ) {
          this.modal(`${type}_modal`)
          this.$LIPS(false)
          this.$scrollToTop()
          Flash.setError(
            "Can not process verification. Update the customer guarantors details and try again!",
            10000
          )
          return
        }
        this.info_from_neighbors === "no"
          ? (this.address.info_from_neighbors_desc = "")
          : ""
        this[type].customer_id = this.customer.id
        this[type].user_id = this.user.id
        this[type].staff_name = this.user.full_name
        this.$validator.validateAll(type).then(async result => {
          if (result) {
            await post(`/api/${type}`, this[type])
              .then(({ data }) => {
                this.updateView(data.response)
                let id = `Customer ID : ${this.customer.id}`,
                  typeCaps = this.$options.filters.capitalize(type),
                  action = `Customer${typeCaps}Verification`
                if (type === "address")
                  action += this.address.approval_status
                    ? "Passed"
                    : "NotPassed"
                log(action, id)
                Flash.setSuccess(`${typeCaps} status updated!`)
                this.modal(`${type}_modal`)
                this.done()
              })
              .catch(e => Flash.setError(e.response.data.message))
            this.$LIPS(false)
            this.$scrollToTop()
          } else this.$networkErr("form")
        })
      } else this.$networkErr()
    },

    async save(document, modal) {
      this.$validator.validateAll().then(async result => {
        if (result) {
          try {
            this.$LIPS(true)
            this.verificationData = {
                customer_id: this.customer.id,
                document: this.form[document],
                name: document
            }
            let form = toMulipartedForm(this.verificationData, "edit");

            let res = await post(`/api/new_document`, form)
            if (res.status === 200) {
              
              this.updateView(res.data)
              this.displayDocument = res.data.data.find((item)=> item.name === document)
              this.$swal({
                icon: "success",
                title: res.data.response,
              })
              this.verificationData = {}

              this.modal(modal)
              Flash.setSuccess("Document Updated Successfully!")
              this.done()
            }
          } catch (err) {
            this.$swal({
              icon: "error",
              title: `Unable to complete`,
            })
          } finally {
            this.$LIPS(false)
            this.$scrollToTop()
          }
        }
      })
    },

    getRecommendationList(id) {
      get(`/api/customer-recommendation/${id}`)
        .then(res => {
          this.recommendationList = res.data.data
          this.verificationList = this.recommendationList.filter(item => {
            return item.type === "verification"
          })
          this.verificationList.reverse()

          this.creditReportList = this.recommendationList.filter(item => {
            return item.type === "credit_report"
          })
          this.creditReportList.reverse()
          this.recommendationList = this.recommendationList.filter(item => {
            return item.type == "formal" || item.type == "informal"
          })
          this.recommendationList.reverse()
        })
        .catch(e => {
          this.$LIPS(false)
          Flash.setError("Error Fetching customer detail")
        })
    },
  },

  computed: {
    ...mapGetters(["auth"]),

    check() {
      return !(!this.$isProcessing && !!this.customer_id)
    },
    forDVA() {
      return this.auth("DVAAccess")
    },
    forCreditChecker() {
      return this.auth("CreditChecker")
    },
  },

  mounted() {
    $(document).on("hidden.bs.modal", ".modal", () => {
      this.verification = JSON.parse(JSON.stringify(this.customer.verification))
      
      /*this.verification holds a copy of the this.customer.verification. this.verification is what is used to style
       * the card. this.customer.verification on the other hand is used to calculate the approval status, when
       * changing the status on the front end the this.verification is what is changed but when it is
       * reflected in the backend then the changes will be reflected on this.customer.verification
       * after going to database and returning the data again. NB: the purpose of this method
       * is revert the values of the this.verification to this.customer.verification
       * values, when a user selects a different option but doesn't submit
       * it after opening and closing the modal responsible for that
       * particular action*/

       
    })
  },
  created() {
  }
}
</script>
