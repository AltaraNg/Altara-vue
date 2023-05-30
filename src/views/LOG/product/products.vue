<template>
    <transition name="fade">
        <div id="reminder" class="attendance">

            <custom-header :title="'Products List'"/>

            <div class="mt-2 mt-lg-3 row attendance-head ">
                <div class="col-md-10">
                    <resueable-search
                        @childToParent="prepareList"
                        :url="urlToFetchOrders"
                        :showBranch="false"
                        :showDate="false"
                    >
                        <template #default= "{ searchQuery }">
                            <div class="col-md">
                                <div>
                                    <label class="form-control-label">Name:  </label>                                    
                                </div>
                                <input type="text" v-model="searchQuery.name" class="form-control">
                            </div>
                 <div class="col-md">
                    <div>
                    <label class="form-control-label">Brand:  </label>
                    </div>
                    <select name="brand" id="brand" class="custom-select" v-model="searchQuery.brand">
                        <option :value="brand.name" v-for="brand in brands">
                            {{brand.name}}
                        </option>
                    </select>
                </div>
                <div class="col-md">
                    <div>
                    <label class="form-control-label">Category:  </label>
                    </div>
                   <select name="category" id="category" class="custom-select" v-model="searchQuery.category">
                        <option :value="category.name" v-for="category in categories">
                            {{category.name}}
                        </option>
                    </select>
                </div>
            </template>
          </resueable-search>
                </div>
                

                <div class="col-md-2">
                    <router-link :to="{name: 'productCreate'}">
                        <button class="btn btn-primary bg-default mt-0 myBtn float-right my-2"><i class="fa fa-plus" aria-hidden="true"></i></button>
                    </router-link>
                </div>
            </div>

            <div class="mt-5 mb-3 attendance-head">
                <div class="w-100 my-5 mx-0 hr"></div>
                <div class="row px-4 pt-3 pb-4 text-center">
                    <div class="col light-heading" style="max-width: 120px">S/N</div>
                    <div class="col light-heading" v-for="header in headings">{{header}}</div>
                </div>
            </div>
            <div class="tab-content mt-1 attendance-body">

                <div class="mb-3 row attendance-item" :key="index" v-for="(product,index) in products" @click="viewProduct(product)">
                    <div class="col d-flex align-items-center" style="max-width: 120px">
                        <span class="user mx-auto" >{{index+OId}}</span>
                    </div>
                    <div class="col d-flex align-items-center justify-content-center">
                        {{product.name}}
                    </div>
                    <div class="col d-flex align-items-center justify-content-center">
                        {{product.brand}}
                    </div>
                    <div class="col d-flex align-items-center justify-content-center">
                        {{product.category}}
                    </div>
                    <div class="col d-flex align-items-center justify-content-center">
                        {{product.retail_price | currency('₦')}}
                    </div>
                    <div class="col d-flex align-items-center justify-content-center">
                        {{product.is_active === 1 ? 'Active' : 'Inactive' }}
                    </div>



                </div>
            </div>
            <div class="modal fade repayment" id="viewProduct">
                <div class="modal-dialog " role="document">
                    <div class="modal-content" v-if="showModalContent">
                        <div class="modal-header py-2">
                            <h4>{{productItem.name}}</h4>
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
                                        <th>Name</th>
                                        <td>{{ productItem.name || "Not Available" }}</td>
                                    </tr>
                                    <tr >
                                        <th>Status</th>
                                        <td>{{ productItem.is_active | status}}</td>
                                    </tr>
                                    <tr >
                                        <th>Product Type</th>
                                        <td>{{ productItem.product_type }}</td>
                                    </tr>
                                    <tr >
                                        <th>Brand</th>
                                        <td>{{ productItem.brand }}</td>
                                    </tr>
                                    <tr >
                                        <th>Category</th>
                                        <td>{{ productItem.category}}</td>
                                    </tr>

                                    <tr>
                                        <th>Date</th>
                                        <td>{{productItem.created_at ? productItem.created_at.split(" ")[0] : "Not Available" }}</td>
                                    </tr>
                                    <tr>
                                        <th>Time</th>
                                        <td>{{productItem.created_at ? productItem.created_at.split(" ")[1] : "Not Available" }}</td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>


                        </div>
                        <div class="modal-footer justify-content-center">
                            <button @click="edit(productItem.id)" class="text-center btn bg-default">Edit</button>
                        </div>
                    </div>
                </div>
            </div>

            <div v-if="pageParams">
                <base-pagination
                    :page-param="pageParams"                    
                    @fetchData="fetchData"
                    
                >
                </base-pagination>

            </div>





        </div>
    </transition>
</template>
<script>
    import {get} from '../../../utilities/api';
    import Vue from 'vue';
    import Flash from "../../../utilities/flash";
    import Vue2Filters from 'vue2-filters'

    import {mapGetters, mapActions} from "vuex";
    import CustomHeader from '../../../components/customHeader';
    import BasePagination from '../../../components/Pagination/BasePagination'
    import InventorySearch from "../../../components/InventorySearch";
    import ResueableSearch from '../../../components/ReusableSearch.vue';
    Vue.use(Vue2Filters);
    export default {
        props: {
            //TODO::verify if its necessary to make this a prop
            withBranchFilter: {default: true},
            urlToFetchOrders: {default: '/api/product'}
        },

        components: {CustomHeader, BasePagination, ResueableSearch },

        computed: {...mapGetters(['getBranches'])},

        data() {
            return {
                branch_id: '',
                OId: null,
                showModalContent: false,
                pageParams: {},
                page_size: 10,
                date_from: null,
                date_to: null,
                page: 1,
                filters: [
                    {name: 'date from', model: 'date_from'},
                    {name: 'date to', model: 'date_to'}
                ],
                products: [],
                productItem: null,
                response: {},
                show: false,
                headings:
                    ['Name', 'Brand', 'Category', 'Price', 'Status'],
                searchColumns: [
                    {title: 'Name', column: 'name'},
                    {title: 'Brand', column: 'brand'},
                    {title: 'Category', column: 'category'},
                ],
                brands: [],
                categories: []
            }
        },

        methods: {
            async fetchData() {

                
                this.$LIPS(true);
                let {page, page_size} = this.$data;
                await get('/api/brand?limit=100').then((res) => {
                    Vue.set(this.$data, 'brands', res.data.data.data);
                }).catch(() => Flash.setError('Error Preparing form'));
                await get('/api/category?limit=100').then((res) => {
                    Vue.set(this.$data, 'categories', res.data.data.data);
                }).catch(() => Flash.setError('Error Preparing form'));
                get(`${this.urlToFetchOrders}`+`${!!this.pageParams.page ? `?page=${this.pageParams.page}` : ""}` +
          `${!!this.pageParams.limit ? `&limit=${this.pageParams.limit}` : ""}`
                )
                    .then(({data}) => this.prepareList(data))
                    .catch(() => Flash.setError('Error Preparing form'))
                    .finally(() => {
                        this.$LIPS(false);
                    });


            },

            prepareList(response){
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
                    prev_page_url
                } = response.data;
                this.pageParams = Object.assign({}, this.pageParams, {current_page, first_page_url, from, last_page, last_page_url, per_page, next_page_url, to, total, prev_page_url});
                this.products = data[0]?.name ? data : data?.data?.data;
                this.OId = from;
                this.$LIPS(false);

            },

            

            viewProduct(product){
                this.showModalContent = true;
                this.productItem = product;
                return $(`#viewProduct`).modal('toggle');
            },
            edit(item){
                this.showModalContent = false;
                $(`#viewProduct`).modal('toggle');

                return this.$router.push(
                    {name: 'productEdit', params: {id: item}}
                )
            },

            searchEvent (data) {
                get(this.urlToFetchOrders + data)
                    .then(({data}) => this.prepareList(data))
                    .catch(() => Flash.setError('Error Preparing form'));
            },

            ...mapActions('ModalAccess', [
                'addCustomerOptionsModalsToDom',
                'removeCustomerOptionsModalsFromDom'
            ])
        },

        created() {
            this.$props.withBranchFilter && this.filters.unshift({name: 'branch', model: 'branch_id'});
            this.addCustomerOptionsModalsToDom();
            this.$prepareBranches();
            this.fetchData();
        },

        destroyed() {
            this.removeCustomerOptionsModalsFromDom();
        },
        filters: {
            status: function(value){
                if (value === 1){
                    return 'Active'
                }else return 'Inactive'
            }
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
    .green{
        color: green;
    }
    .red{
        color: red;
    }
    .custom-select{
        width: 272px;
    }
</style>
