<template>
  <transition name="fade">
    <div id="reminder" class="attendance">
      <custom-header :title="'Website Product'" />

      <div class="mt-2 mt-lg-3 row attendance-head ">
        <div class="col-md-10">
          <resueable-search
            @childToParent="prepareSearch"
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

        <div class="col-md-2">
          <router-link :to="{ name: 'websiteProductCreate' }">
            <button
              class="btn btn-primary bg-default mt-0 myBtn float-right my-5"
            >
              <i class="fa fa-plus" aria-hidden="true"></i>
            </button>
          </router-link>
        </div>
      </div>

      <div v-if="products.length > 0 && !$isProcessing">
        <div class="mt-5 mb-3 attendance-head">
        <div class="w-100 my-5 mx-0 hr"></div>
        <div class="row px-4 pt-3 pb-4 text-center">
          <div class="col light-heading" style="max-width: 120px">S/N</div>
          <div class="col light-heading" v-for="header in headings" :key="header">
            {{ header }}
          </div>
        </div>
      </div>
      <div class="tab-content mt-1 attendance-body">
        <div
          class="mb-3 row attendance-item"
          :key="index"
          v-for="(product, index) in products"
          @click="viewProduct(product)"
        >
          <div class="col d-flex align-items-center" style="max-width: 120px">
            <span class="user mx-auto">{{ index + OId }}</span>
          </div>
          <div class="col d-flex align-items-center justify-content-center">
            {{ product.name }}
          </div>
          <div class="col d-flex align-items-center justify-content-center">
            {{ product.description | truncate(30) }}
          </div>

          <div class="col d-flex align-items-center justify-content-center">
            {{ product.price | currency('₦') }}
          </div>
          <div class="col d-flex align-items-center justify-content-center">
            {{ product.status }}
          </div>
        </div>
      </div>
      </div>
      <div v-else-if="!$isProcessing" class="mx-4">
					<zero-state
						:title="'No product uploaded'"
						:message="'No product to view'"
					>
						<template v-slot:image>
							<img src="../../../assets/thumb-up.png" />
						</template>
					</zero-state>
				</div>

      
      <div class="modal fade repayment" id="viewProduct">
        <div class="modal-dialog " role="document">
          <div class="modal-content" v-if="showModalContent">
            <div class="modal-header py-0">
              <h4 class="my-3">{{ productItem.name }}</h4>
              <a aria-label="Close" class="close py-1" data-dismiss="modal">
                <span aria-hidden="true" class="modal-close text-danger">
                  <i class="fas fa-times"></i>
                </span>
              </a>
            </div>
            <div class="modal-body px-5">
              <div class=" ">
                <div id="preview">
                  <img
                  :src="productImage"
                  alt="image"
                  width="250"
                  height="200"
                  onerror="this.onerror=null;this.src = '../../../assets/placeholder-image.png'"
                />
                </div>
                
                <div class="card-body ">
                  <p class="card-text">
                    Price:
                    <b >{{ productItem.price | currency('₦') }}</b>
                  </p>
                  <p class="card-text">
                    Description: <b >{{ productItem.description }}</b>
                  </p>
                  <p class="card-text">
                    Date Added: <b >{{ productItem.created_at }}</b>
                  </p>
                </div>
              </div>
            </div>
            <div class="modal-footer justify-content-end">
              <button
                @click="edit(productItem.id)"
                class="text-center btn bg-default mx-2"
              >
                Edit
              </button>
              <button
                class="text-center btn btn-default btn-danger"
                @click="confirmModal"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-if="pageParams">
        <base-pagination :page-param="pageParams" @fetchData="fetchData">
        </base-pagination>
      </div>

      <div>
        <confirm-modal
          :show="showPrompt"
          @touched="deleteProduct($event)"
        ></confirm-modal>
      </div>
    </div>
  </transition>
</template>
<script>
import { get, del } from '../../../utilities/api'
import Vue from 'vue'
import Flash from '../../../utilities/flash'
import Vue2Filters from 'vue2-filters'

import { mapActions } from 'vuex'
import CustomHeader from '../../../components/customHeader'
import BasePagination from '../../../components/Pagination/BasePagination'
import ResueableSearch from '../../../components/ReusableSearch.vue'
import ZeroState from '../../../components/ZeroState.vue';
import ConfirmModal from '../../../components/modals/ConfirmModal.vue'
Vue.use(Vue2Filters)
export default {
  props: {
    //TODO::verify if its necessary to make this a prop
    withBranchFilter: { default: true },
    urlToFetchOrders: { default: '/api/website-product' },
  },

  components: { CustomHeader, BasePagination, ResueableSearch, ConfirmModal, ZeroState },

  data() {
    return {
      imageLoading: false,
      branch_id: '',
      OId: null,
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
      products: {},
      productItem: null,
      response: {},
      show: false,
      headings: ['Name', 'Description', 'Price', 'Status'],
      searchColumns: [
        { title: 'Name', column: 'name' },
        { title: 'Brand', column: 'brand' },
        { title: 'Category', column: 'category' },
      ],
      brands: [],
      categories: [],
      showPrompt: false,
    }
  },

  methods: {
    async fetchData() {
      this.$LIPS(true)
      get(
        `${this.urlToFetchOrders}` +
          `${this.pageParams.page ? `?page=${this.pageParams.page}` : ''}` +
          `${this.pageParams.limit ? `&limit=${this.pageParams.limit}` : ''}`
      )
        .then(({ data }) => this.prepareList(data))
        .catch(() => Flash.setError('Error Preparing form'))
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
      this.products = data
      this.OId = from
      this.$LIPS(false)
    },

    viewProduct(product) {
      this.showModalContent = true
      this.productItem = product
      return $(`#viewProduct`).modal('toggle')
    },
    edit(item) {
      this.showModalContent = false
      $(`#viewProduct`).modal('toggle')

      return this.$router.push({
        name: 'websiteProductEdit',
        params: { id: item },
      })
    },

    deleteProduct($event) {
      if($event){
        this.$LIPS(true)
      del(`${this.urlToFetchOrders}/${this.productItem.id}`)
        .then(() => {
          this.$swal({
                    icon: 'success',
                    title: 'Product deleted successfully'              
                  })
          this.fetchData()
        })
        .catch(() => {})
        .finally(() => {
          this.$LIPS(false)
        });
        this.showPrompt = false;
        this.showModalContent = false;
      }
      else{
        this.showPrompt = false;

      }
     



    },

    confirmModal() {
     this.showPrompt = !this.showPrompt;
    },

    searchEvent(data) {
      get(this.urlToFetchOrders + data)
        .then(({ data }) => this.prepareList(data))
        .catch(() => Flash.setError('Error Preparing form'))
    },
    prepareSearch(item) {
      this.prepareList(item.data.data)
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

  unmounted() {
    this.removeCustomerOptionsModalsFromDom()
  },
  filters: {
    status: function(value) {
      if (value === 1) {
        return 'Active'
      } else return 'Inactive'
    },
  },

  computed: {
    productImage() {
      return `${process.env.VUE_APP_S3_URL}/${this.productItem.image_url}`
    },
  },
  watch: {
    'productItem.url': function() {
      this.imageLoading = true
    },
  },
}
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
.custom-select {
  width: 272px;
}
</style>
