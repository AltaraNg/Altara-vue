<template>
    <transition name="fade">
        <div class="pt-md-3 pt-2 attendance-view" id="index">

            <custom-header :to="'/log/products'" :title="mode + ' product'" :button-title="'view Products!'" />

            <div class="attendance-body">
                <form @submit.prevent="onSave">
                    <div class="my-4 clearfix p-5 row bg-white shadow-sm card-radius">
                        <div class="form-group col-md-6 col-12 float-left px-0 px-md-3">
                            <label>Product name</label>
                            <input class="form-control" placeholder="product name" type="text" v-model="productName"
                                required>
                            <small v-if="error.name">{{ error.name[0] }}</small>
                        </div>
                        <div class="form-group col-md-6 col-12 float-left px-0 px-md-3">
                            <label>Retail Price</label>
                            <input class="form-control" name="price" placeholder="retail price" type="number"
                                v-model="retailPrice" v-validate="'required|max:50'">
                            <small v-if="errors.first('price')">{{ errors.first('price') }}</small>

                        </div>
                        <!-- <div class="form-group col-md-6 col-12 float-left px-0 px-md-3">
                            <label>Product feature</label>
                            <input class="form-control" name="feature" placeholder="product feature" type="text"
                                :disabled="mode === 'edit'" v-model="form.feature" v-validate="'required|max:50'">
                            <small v-if="errors.first('feature')">{{ errors.first('feature') }}</small>
                        </div> -->
                        <div class="spaceBetween mb-md-2 mb-0"></div>
                        <!-- <div class="form-group col-md-6 col-12 ">
                            <label for="brand" class="form-control-label">Brand </label>
                            <br>
                            <select name="brand" id="brand" v-model="form.brand_id" class="custom-select"
                                data-vv-as="brand id" :disabled="mode === 'edit'">
                                <option disabled value="">--select--</option>
                                <option :value="brand.id" v-for="brand of brands" :key="brand.id">{{ brand.name }}</option>
                            </select>
                        </div>
                        <div class="form-group col-md-6 col-12 float-left px-0 px-md-3">
                            <label class="form-control-label" for="category">Category</label>
                            <br>
                            <select name="category" id="category" v-model="form.category_id" class="custom-select"
                                data-vv-as="category id" :disabled="mode === 'edit'">
                                <option disabled value="">--select--</option>
                                <option :value="category.id" v-for="category of categories" :key="category.id">{{ category.name }}</option>
                            </select>
                        </div> -->
                        <div class="spaceBetween mb-md-2 mb-0"></div>


                        <div class="form-group col-md-6 col-12 ">
                            <label for="product_type" class="form-control-label">Product Type </label>
                            <br>
                            <select name="product_type" id="product_type" v-model="form.product_type_id"
                                class="custom-select" :disabled="mode === 'edit'">
                                <option value="all" selected="selected">--select--</option>
                                <option :value="type.id" v-for="type of product_types" :key="type.id">{{ type.name }}
                                </option>
                            </select>
                        </div>
                    </div>


                    <div class="mb-5 px-0 row align-items-center">
                        <div class="clearfix d-flex justify-content-end w-100">
                            <router-link to="/log/products" class="mx-5 text-link mt-4 pt-2" v-if="mode === 'edit'">
                                Cancel
                            </router-link>
                            <button :disabled="$isProcessing" class="btn bg-default" type="submit">
                                {{ mode | capitalize }} Product <i class="far fa-paper-plane ml-1"></i>
                            </button>
                        </div>
                    </div>

                </form>
            </div>
        </div>
    </transition>
</template>
<script>
import Vue from 'vue';
import Flash from "../../../utilities/flash";
import { post, get, put } from '../../../utilities/api';
import CustomHeader from '../../../components/customHeader';



export default {
    components: { CustomHeader },
    props: {},
    data() {
        return {
            form: {},
            categories: [],
            product_types: [],
            brands: [],
            mode: null,
            error: {},
            show: false,
            store: '/api/product',
            method: 'POST',
            productName: null,
            retailPrice: null
        }
    },
    beforeRouteEnter(to, from, next) {
        if (to.meta.mode === 'edit') {
            get(`/api/product/${to.params.id}`).then((data) => {

                next(vm => {

                    vm.prepareForm(data.data.data)
                })
            })
                .catch(() => next(() => Flash.setError('Error Preparing form')));
        }
        else {
            let form = {};
            next(vm => {
                vm.prepareForm(form)
            })
        }
    },
    methods: {
        async prepareForm(data) {
            this.$LIPS(true);
            Vue.set(this.$data, 'mode', this.$route.meta.mode);
            // await get('/api/brand').then((res) => {
            //     Vue.set(this.$data, 'brands', res.data.data.data);
            // }).catch(() => Flash.setError('Error Preparing form'));

            await get('/api/product_type').then((res) => {
                Vue.set(this.$data, 'product_types', res.data.data.data);
            }).catch(() => Flash.setError('Error Preparing form'));

            // await get('/api/category').then((res) => {
            //     Vue.set(this.$data, 'categories', res.data.data.data);
            // }).catch(() => Flash.setError('Error Preparing form'));





            if (this.mode === 'edit') {
                //TODO change the edit form
                this.store = `/api/product/${this.$route.params.id}`;
                this.method = 'PUT';
                let form = {};
                form.feature = data.feature;
                form.brand_id = this.getParent(data.brand, this.brands).id;
                form.category_id = this.getParent(data.category, this.categories).id;
                form.product_type_id = this.getParent(data.product_type, this.product_types).id;
                form.retail_price = data.retail_price;
                Vue.set(this.$data, 'form', form);
            } else {
                Vue.set(this.$data, 'form', data);
            }
            this.$LIPS(false);
            this.show = true;

        },
        getParent(name, array) {
            return array.find((item) => {
                return item.name === name;
            });
        },
        onSave() {
            this.$validator.validateAll().then(result => {
                if (result) {
                    if (this.$network()) {
                        this.$LIPS(true);
                        this.form.name = this.productName;
                        this.form.retail_price = this.retailPrice;
                        this.form.brand_id = 1;
                        this.form.category_id = 1;
                        this.form.feature = "model feature";

                        (this.mode === 'edit' ? put(this.store, this.form) : post(this.store, this.form))
                            .then(({ data }) => {
                                if (data.status === 'success') {
                                    Vue.set(this.$data, 'form', {});
                                    this.$swal({
                                        icon: 'success',
                                        title: this.mode === 'edit' ? 'Product Updated Successfully' : 'Product added Successfully'

                                    });
                                    return this.$router.push(
                                        { path: '/log/products' }
                                    )
                                }
                            })
                            .catch(({ response: r }) => {
                                let { data, status } = r;
                                if (status === 422) {
                                    this.error = data.errors ? data.errors : data;
                                    this.$networkErr('unique');
                                }
                            }).finally(() => {
                                this.$scrollToTop();
                                this.$LIPS(false);
                            });
                    } else this.$networkErr()
                } else this.$networkErr('form');
            })
        }
    },
    watch: {
        form: {
            handler: function (val) {

                const brand = this.brands.find(el => el.id === val.brand_id);

                if (brand) {

                    Vue.set(this.$data, 'categories', brand.categories);
                } else return ''
            },
            deep: true
        }
    },
    computed: {
        // productName() {
        //     let brand, category, feature, brand_name, category_name;
        //     if (this.form.brand_id && this.form.category_id) {
        //         brand = this.brands.find(item => item.id === this.form.brand_id);
        //         brand !== undefined ? brand_name = brand.name : brand_name = '';
        //         category = this.categories.find(item => item.id === this.form.category_id);
        //         category !== undefined ? category_name = category.name : category_name = '';

        //         feature = this.form.feature;
        //         return `${feature} ${brand_name} ${category_name}`;
        //     } else return 'Product Name';
        // }
    }

}
</script>
