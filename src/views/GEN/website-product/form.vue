<template>
  <transition name="fade">
    <div class="pt-md-3 pt-2 attendance-view" id="index">
      <custom-header
        :to="'/gen-utils/website-product'"
        :title="mode + ' product'"
        :button-title="'view Products!'"
      />

      <div class="attendance-body">
        <form @submit.prevent="onSave" enctype="multipart/form-data">
          <div class="my-4 clearfix p-5 row bg-white shadow-sm card-radius">
            <div class="form-group col-md-6 col-12 float-left px-0 px-md-3">
              <label>Product name</label>
              <input
                name="name"
                :class="{'form-control': true, 'border-danger': errors.has('name')}"
                placeholder="product name"
                type="text"
                v-model="form.name"
                v-validate="'required|max:50'"
              />
              <i v-show="errors.has('name')" class="fa fa-warning"></i>
              <small v-if="errors.has('name')">{{
                errors.first('name')
              }}</small>
            </div>
            <div class="form-group col-md-6 col-12 float-left px-0 px-md-3">
              <label>Description</label>
              <input
                class="form-control"
                name="description"
                placeholder="Description"
                type="text"
                v-model="form.description"
                v-validate="'required|max:50'"
              />
              <small v-if="errors.first('description')">{{
                errors.first('description')
              }}</small>
            </div>
            <div class="spaceBetween mb-md-2 mb-0"></div>

            <div class="spaceBetween mb-md-2 mb-0"></div>
            <div class="form-group col-md-6 col-12 float-left px-0 px-md-3">
              <label>Price</label>

              <currency-input
                :name="'price'"
                class="form-control"
                :options="{
                  currency: 'NGN',
                  hideGroupingSeparatorOnFocus: false,
                }"
                :placeholder="showPrice"
                v-model="form.price"
                v-validate="'required|numeric'"
                :value="price"
              ></currency-input>
              <small v-if="errors.first('price')">{{
                errors.first('price')
              }}</small>
            </div>
            <div class="form-group col-md-6 col-12 float-left px-0 px-md-3">
              <label>Upload Image</label>
              <image-upload
                name="image"
                :usage="`cv`"
                class="form-control w-75"
                v-model="form.image"
                @getChange="onFileChange"
              />
              <small v-if="errors.first('image')">{{
                errors.first('image')
              }}</small>

              <div id="preview">
                <img
                  v-if="form.image"
                  :src="imageUrl"
                  width="150"
                  height="100"
                />
                <img
                  v-if="mode === 'edit' && preloaded_image && !form.image"
                  :src="preloaded_image"
                  width="150"
                  height="100"
                />
              </div>
            </div>
          </div>

          <div class="mb-5 px-0 row align-items-center">
            <div class="clearfix d-flex justify-content-end w-100">
              <router-link
                to="/log/products"
                class="mx-5 text-link mt-4 pt-2"
                v-if="mode === 'edit'"
              >
                Cancel
              </router-link>
              <button
                :disabled="$isProcessing"
                class="btn bg-default"
                type="submit"
              >
                {{ 'Save' | capitalize }} Product
                <i class="far fa-paper-plane ml-1"></i>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </transition>
</template>
<script>
import Vue from 'vue'
import { log } from '../../../utilities/log'
import ImageUpload from '../../../components/ImageUpload'

import Flash from '../../../utilities/flash'
import { post, get, put } from '../../../utilities/api'
import Typeahead from '../../../components/Typeahead'
import CustomHeader from '../../../components/customHeader'
import CurrencyInput from '../../../components/CurrencyInput.vue'
import { toMulipartedForm } from '../../../utilities/form'

function initialize(to) {
  let urls = {
    create: `/api/product/create`,
    edit: `/api/website-product/${to.params.id}/edit`,
  }
  return urls[to.meta.mode]
}

export default {
  components: { Typeahead, CustomHeader, CurrencyInput, ImageUpload },
  props: {},
  data() {
    return {
      price: null,
      preloaded_image: null,
      url: null,
      form: {},
      product_types: [],
      mode: null,
      error: {},
      show: false,
      store: '/api/website-product',
      method: 'POST',
    }
  },
  beforeRouteEnter(to, from, next) {
    if (to.meta.mode === 'edit') {
      get(`/api/website-product/${to.params.id}`)
        .then(data => {
          next(vm => {
            vm.prepareForm(data.data.data)
          })
        })
        .catch(() => next(() => Flash.setError('Error Preparing form')))
    } else {
      let form = {}
      next(vm => {
        vm.prepareForm(form)
      })
    }
  },
  methods: {
    onFileChange(e) {
      const file = e.target.files[0]
      this.url = URL.createObjectURL(file)
    },
    async prepareForm(data) {
      this.$LIPS(true)
      Vue.set(this.$data, 'mode', this.$route.meta.mode)

      if (this.mode === 'edit') {
        this.store = `/api/website-product/${this.$route.params.id}`;
        this.method = 'PUT';
        let form = {};
        form.name = data.name;
        form.description = data.description;
        this.price = data.price;
        this.preloaded_image = `${process.env.VUE_APP_S3_URL}/${data.image_url}`
        Vue.set(this.$data, 'form', form)
      } else {
        Vue.set(this.$data, 'form', data)
      }
      this.$LIPS(false)
      this.show = true
    },
    getParent(name, array) {
      return array.find(item => {
        return item.name === name
      })
    },

    onSave() {
      let form = toMulipartedForm(this.form)
      this.$validator.validateAll().then(result => {
        if (result) {
          if (this.$network()) {
            this.$LIPS(true);
            (this.mode === 'edit'
              ? put(this.store, this.form)
              : post(this.store, form)
            )
              .then(({ data }) => {
                if (data.status === 'success') {
                  Vue.set(this.$data, 'form', {})
                  this.$swal({
                    icon: 'success',
                    title:
                      this.mode === 'edit'
                        ? 'Product Updated Successfully'
                        : 'Product added Successfully',
                  })
                  return this.$router.push({
                    path: '/gen-utils/website-product',
                  })
                }
              })
              .catch(({ response: r }) => {
                let { data, status } = r
                if (status === 422) {
                  this.error = data.errors ? data.errors : data
                  this.$networkErr('unique')
                }
              })
              .finally(() => {
                this.$scrollToTop()
                this.$LIPS(false)
              })
          } else this.$networkErr()
        } else this.$networkErr('form')
      })
    },
  },
  watch: {},
  computed: {
    imageUrl() {
      return URL.createObjectURL(this.form.image)
    },
    showPrice() {
      return this.form.price
    },
  },
}
</script>
