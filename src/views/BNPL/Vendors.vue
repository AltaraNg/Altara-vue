<template>
  <transition name="fade">
    <div id="reminder" class="attendance">
      <custom-header :title="'Vendors List'" />

      <div class="my-2 mt-lg-3 row attendance-head ">
        <div class="col row">
          <resueable-search
            @childToParent="prepareListFromSearch"
            :url="apiUrl"
            :showBranch="false"
            :showDate="false"
          >
            <template #default="{ searchQuery }">
              <div class="col w-100">
                <div>
                  <label class="form-control-label">Name: </label>
                </div>
                <input
                  size="100"
                  type="text"
                  v-model="searchQuery.full_name"
                  class="form-control"
                />
              </div>
              <div class="col">
                <div>
                  <label class="form-control-label">Phone: </label>
                </div>
                <input
                  type="text"
                  v-model="searchQuery.phone_number"
                  class="form-control"
                />
              </div>
            </template>
          </resueable-search>
        </div>

        <div class="col float-right mt-5">
          <button
            class="btn btn-primary bg-default mt-0 myBtn float-right my-2"
            @click="createVendor"
          >
            <i class="fa fa-plus" aria-hidden="true"></i>
          </button>
        </div>
      </div>

      <div class="mt-5 mb-3 attendance-head" v-if="vendors.length > 0">
        <div class="w-100 my-5 mx-0 hr"></div>
        <div class="row px-4 pt-3 pb-4 text-center">
          <div
            class="col dark-heading font-weight-bolder"
            style="max-width: 120px"
          >
            S/N
          </div>
          <div
            class="col dark-heading font-weight-bolder"
            v-for="header in headings"
          >
            {{ header }}
          </div>
        </div>
      </div>
      <div class="tab-content mt-1 attendance-body" v-if="vendors.length > 0">
        <div
          class="mb-3 row attendance-item"
          :key="index"
          v-for="(vendor, index) in vendors"
        >
          <div class="col d-flex align-items-center" style="max-width: 120px">
            <span
              class="user mx-auto text-white"
              :class="{
                'bg-success': vendor.portal_access,
                'bg-danger': !vendor.portal_access,
              }"
              >{{ index + OId }}</span
            >
          </div>
          <div
            class="col d-flex align-items-center justify-content-center hover"
            @click="viewVendor(vendor)"
          >
            {{ vendor.full_name }}
          </div>
          <div class="col d-flex align-items-center justify-content-center">
            {{ vendor.staff_id }}
          </div>
          <div class="col d-flex align-items-center justify-content-center">
            {{ vendor.email }}
          </div>
          <div class="col d-flex align-items-center justify-content-center">
            {{ $humanizeDate(vendor.created_at) }}
          </div>
          <div class="col d-flex align-items-center justify-content-center">
            <button class="bg-default py-2 px-3" @click="confirmModal(vendor)">
              {{ vendor.portal_access ? 'Deactivate' : 'Activate' }}
            </button>
          </div>
        </div>
      </div>
      <div v-else class="mx-2 px-4 ">
        <zero-state
          :title="'No vendors to view'"
          :message="'There are currrently no Vendors'"
        >
          <template v-slot:image>
            <img src="../../assets/thumb-up.png" />
          </template>
        </zero-state>
      </div>
      <div>
        <confirm-modal
          :show="showPrompt"
          @touched="
            selectedOrder.portal_access
              ? deactivateVendor($event)
              : reactivateVendor($event)
          "
        ></confirm-modal>
      </div>
      <div class="modal fade repayment" id="viewBrand">
        <div class="modal-dialog" role="document">
          <div class="modal-content" v-if="showModalContent">
            <div class="modal-header my-0 py-0">
              <h4>
                {{ vendorItem.full_name }}
              </h4>
              <a aria-label="Close" class="close py-1" data-dismiss="modal">
                <span aria-hidden="true" class="modal-close text-danger">
                  <i class="fas fa-times"></i>
                </span>
              </a>
            </div>
            <div class="modal-body px-5">
              <div class="table-responsive">
                <table class="table table-bordered table-striped">
                  <tbody>
                    <tr>
                      <th>Vendor ID</th>
                      <td>{{ vendorItem.staff_id || 'Not Available' }}</td>
                    </tr>
                    <tr>
                      <th>Address</th>
                      <td>{{ vendorItem.address || 'Not Available' }}</td>
                    </tr>
                    <tr>
                      <th>Email</th>
                      <td>{{ vendorItem.email || 'Not Available' }}</td>
                    </tr>
                    <tr>
                      <th>Gender</th>
                      <td>{{ vendorItem.gender || 'Not Available' }}</td>
                    </tr>
                    <tr>
                      <th>Phone Number</th>
                      <td>{{ vendorItem.phone_number || 'Not Available' }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div class="modal-footer justify-content-center">
              <button
                @click="edit(vendorItem)"
                class="text-center btn bg-default"
                v-if="!viewCategory"
              >
                Edit
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-if="pageParams.next_page_url || pageParams.prev_page_url">
        <base-pagination :page-param="pageParams" @fetchData="fetchData">
        </base-pagination>
      </div>
    </div>
  </transition>
</template>

<script>
import { get, patch } from '../../utilities/api'
import Vue from 'vue'

import Flash from '../../utilities/flash'

import { mapGetters, mapActions } from 'vuex'
import CustomHeader from '../../components/customHeader'
import ZeroState from '../../components/ZeroState.vue'

import BasePagination from '../../components/Pagination/BasePagination'
import ResueableSearch from '../../components/ReusableSearch.vue'
import AddVendorsModal from '../../components/modals/AddVendorsModal.vue'
import EditVendorsModal from '../../components/modals/EditVendorsModal.vue'
import ConfirmModal from '../../components/modals/ConfirmModal.vue'
import { EventBus } from '../../utilities/event-bus'

export default {
  props: {
    //TODO::verify if its necessary to make this a prop
    withBranchFilter: { default: true },
    urlToFetchOrders: { default: '/api/brand' },
  },

  components: {
    CustomHeader,
    BasePagination,
    ResueableSearch,
    ZeroState,
    ConfirmModal,
  },

  computed: { ...mapGetters(['getBranches']) },

  data() {
    return {
      apiUrlDeactivate: `${process.env.VUE_APP_BNPL_URL}/api/deactivate/vendor`,
      apiUrlReactivate: `${process.env.VUE_APP_BNPL_URL}/api/reactivate/vendor`,

      apiUrl: `${process.env.VUE_APP_BNPL_URL}/api/all/vendors`,
      branch_id: '',
      showCat: false,
      OId: null,
      viewCategory: false,
      showModalContent: false,
      pageParams: {},
      showPrompt: false,
      page_size: 10,
      date_from: null,
      date_to: null,
      selectedOrder: null,
      page: 1,
      filters: [
        { name: 'date from', model: 'date_from' },
        { name: 'date to', model: 'date_to' },
      ],
      vendors: [],

      vendorItem: null,
      response: {},
      show: false,
      headings: ['Name', 'Vendor ID', 'Email', 'Date Joined', 'Action'],
      searchColumns: [{ title: 'Name', column: 'name' }],
    }
  },

  methods: {
    fetchData() {
      this.$scrollToTop()
      this.$LIPS(true)
      let { page, page_size } = this.$data
      get(
        `${this.apiUrl}${
          !!this.pageParams.page ? `?page=${this.pageParams.page}` : ''
        }` +
          `${!!this.pageParams.limit ? `&limit=${this.pageParams.limit}` : ''}`
      )
        .then(({ data }) => this.prepareList(data))
        .catch(() => Flash.setError('Error Fetching Vendors'))
        .finally(() => {
          this.$LIPS(false)
        })
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
      } = response.result.vendors
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
      this.vendors = data
      this.OId = from
      this.$LIPS(false)
    },

    prepareListFromSearch(response) {
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
      } = response.data?.data?.result?.vendors
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
      this.vendors = data
      this.OId = from
      this.$LIPS(false)
    },

    next(firstPage = null) {
      if (this.pageParams.next_page_url) {
        this.page = firstPage ? firstPage : parseInt(this.page) + 1
        this.fetchData()
      }
    },

    prev(lastPage = null) {
      if (this.pageParams.prev_page_url) {
        this.page = lastPage ? lastPage : parseInt(this.page) - 1
        this.fetchData()
      }
    },

    toggleCat() {
      Vue.set(this.$data, 'showCat', !this.showCat)
    },

    createVendor() {
      this.$modal.show(
        AddVendorsModal,
        {},
        {
          draggable: false,
          height: 'auto',
          clickToClose: false,
        },
        {
          closed: this.fetchData,
        }
      )
    },
    confirmModal(order) {
      this.showPrompt = !this.showPrompt
      this.selectedOrder = order
    },

    viewVendor(vendor) {
      this.showModalContent = true
      this.vendorItem = vendor
      return $(`#viewBrand`).modal('toggle')
    },
    edit(item) {
      this.showModalContent = false
      $(`#viewBrand`).modal('toggle')
      this.$modal.show(
        EditVendorsModal,
        { vendor: this.vendorItem },
        {
          draggable: false,
          height: 'auto',
          clickToClose: false,
        },
        {
          closed: this.fetchData,
        }
      )
    },
    async deactivateVendor(item) {
      if (item) {
        try {
          this.$LIPS(true)

          get(this.apiUrlDeactivate + `/${this.selectedOrder.id}`).then(res => {
            this.fetchData()
          })

          this.$swal({
            icon: 'success',
            title: 'Vendor deactivated Successfully',
          })

          this.showPrompt = false
        } catch (e) {
        } finally {
          this.$LIPS(false)
        }
      }
      this.showPrompt = false
    },

    async reactivateVendor(item) {
      if (item) {
        try {
          this.$LIPS(true)

          get(this.apiUrlReactivate + `/${this.selectedOrder.id}`).then(res => {
            this.fetchData()
          })

          this.$swal({
            icon: 'success',
            title: 'Vendor Reactivated Successfully',
          })

          this.showPrompt = false
        } catch (e) {
        } finally {
          this.$LIPS(false)
        }
      }
      this.showPrompt = false
    },

    searchEvent(data) {
      get(this.apiUrl + data)
        .then(({ data }) => this.prepareList(data))
        .catch(() => Flash.setError('Error Preparing form'))
    },

    ...mapActions('ModalAccess', [
      'addCustomerOptionsModalsToDom',
      'removeCustomerOptionsModalsFromDom',
    ]),
  },

  created() {
    this.$props.withBranchFilter &&
      this.filters.unshift({ name: 'branch', model: 'branch_id' })
    this.addCustomerOptionsModalsToDom()
    this.$prepareBranches()
    this.fetchData()
    EventBus.$on('fetchVendors', this.fetchData())
  },

  destroyed() {
    this.removeCustomerOptionsModalsFromDom()
  },
  filters: {
    status: function(value) {
      return value === 1 ? 'Active' : 'Inactive'
    },
  },
}
</script>

<style lang="scss" scoped></style>
