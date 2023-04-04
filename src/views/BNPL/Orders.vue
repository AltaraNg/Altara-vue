<template>
  <transition name="fade">
    <div id="reminder" class="attendance">
      <custom-header :title="'Orders List'" />

      <div class="mt-2 mt-lg-3 row attendance-head ">
        <div class="col row" v-if="vendors.length > 0">
          <resueable-search
            @childToParent="prepareList"
            :url="urlToFetchOrders"
            :showBranch="false"
            :showDate="false"
          >
            <template #default="{ searchQuery }">
              <div class="col-md">
                <div>
                  <label class="form-control-label">Name: </label>
                </div>
                <input
                  type="text"
                  v-model="searchQuery.name"
                  class="form-control"
                />
              </div>
            </template>
          </resueable-search>
        </div>

        <div class="col float-right mt-5">
          <button
            class="btn btn-primary bg-default mt-0 myBtn float-right my-2"
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
            <span class="user mx-auto">{{ index + OId }}</span>
          </div>
          <div
            class="col d-flex align-items-center justify-content-center hover"
            @click="viewVendor(vendor)"
          >
            {{ vendor.order_number }}
          </div>
          <div class="col d-flex align-items-center justify-content-center">
            {{ vendor.bnpl_vendor_product.vendor.full_name }}
          </div>
          <div class="col d-flex align-items-center justify-content-center">
            {{ vendor.bnpl_vendor_product.name }}
          </div>
          <div class="col d-flex align-items-center justify-content-center">
            {{ vendor.status }}
          </div>
          <div class="col d-flex align-items-center justify-content-center">
            {{ $humanizeDate(vendor.order_date) }}
          </div>
        </div>
      </div>
      <div v-else>
        <zero-state
          :title="'No Orders to view'"
          :message="'There are currently no Orders'"
        >
          <template v-slot:image>
            <img src="../../assets/thumb-up.png" />
          </template>
        </zero-state>
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

export default {
  props: {
    //TODO::verify if its necessary to make this a prop
    withBranchFilter: { default: true },
    urlToFetchOrders: { default: '/api/new_order?bnplOrders=true' },
  },

  components: { CustomHeader, BasePagination, ResueableSearch, ZeroState },

  computed: { ...mapGetters(['getBranches']) },

  data() {
    return {
      apiUrl: '/api/new_order?bnplOrders=true',
      branch_id: '',
      showCat: false,
      OId: null,
      viewCategory: false,
      showModalContent: false,
      pageParams: {},
      page_size: 10,
      date_from: null,
      date_to: null,
      page: 1,
      filters: [
        { name: 'date from', model: 'date_from' },
        { name: 'date to', model: 'date_to' },
      ],
      vendors: [],

      vendorItem: null,
      response: {},
      show: false,
      headings: ['Order ID', 'Vendor Name', 'Product', 'Order Status', 'Date Created'],
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
          !!this.pageParams.page ? `&page=${this.pageParams.page}` : ''
        }` +
          `${!!this.pageParams.limit ? `&limit=${this.pageParams.limit}` : ''}`
      )
        .then(({ data }) => this.prepareList(data))
        .catch(() => Flash.setError('Error Preparing form'))
    },

    prepareList(response) {
      console.log(response)
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
      } = response.data
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

    showCategory(item) {
      this.showModalContent = true
      this.brandItem = item
      this.viewCategory = true
      return $(`#viewBrand`).modal('toggle')
    },
    addCat(brand, category) {
      if (brand.categories.some(cat => cat.id === category.id)) {
        alert(`${category.name} category already exists`)
      } else {
        brand.categories.push(category)
        this.categories = this.categories.filter(function(item, index, arr) {
          return category.id !== item.id
        })
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
        }
      )
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
        }
      )
    },

    searchEvent(data) {
      get(this.urlToFetchOrders + data)
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
