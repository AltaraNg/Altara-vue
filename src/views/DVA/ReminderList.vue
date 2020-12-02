<template>
    <transition name="fade">
        <div id="reminder" class="attendance">

            <custom-header :title="'Reminder Message List'"/>
            <div class="mt-2 mt-lg-3 row attendance-head attendance-view">
                <div class="col-4">
                    <label>Select Option: </label>
                    <select name="option" v-model="type" @change="fetchData" class="custom-select">
                        <option :value="message.default">Default</option>
                        <option :value="message.first_message">First message</option>
                        <option :value="message.second_message">Second message</option>
                        <option :value="message.third_message">Third message</option>
                    </select>
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
                 <div class="mb-3 row attendance-item" :key="index" v-for="(order,index) in orders">
                        <div class="col d-flex align-items-center" style="max-width: 120px"  >
                            <span class="user mx-auto" >{{index+1}}</span>
                        </div>
                        <div class="col d-flex align-items-center justify-content-center" @click="viewStuffs(order, 'order')">
                            {{order.order_number}}
                        </div>
                        <div class="col d-flex align-items-center justify-content-center">
                            {{order.customer_name}}
                        </div>
                        <div class="col d-flex align-items-center justify-content-center" >
                            {{order.product.name}}
                        </div>
                         <div class="col d-flex align-items-center justify-content-center" @click="viewStuffs(order.amortization, 'amortization')">
                            {{order.repayment  |  currency('₦')}}
                        </div>
                         <div class="col d-flex align-items-center justify-content-center" @click="viewStuffs(order.notifications, 'notification')">
                            {{order.notifications[0]? order.notifications[0].type : 'Not available'}}
                        </div>




                </div>


            </div>
            <div class="modal fade repayment" id="viewStuffs">
                <div class="modal-dialog " role="document">
                    <div class="modal-content" v-if="showModalContent">

                        <div v-if="mode==='order'">
                        <div class="modal-header py-2">
                            <h4>Order Summary</h4>
                            <a aria-label="Close" class="close py-1" data-dismiss="modal">
                        <span aria-hidden="true" class="modal-close text-danger">

                            <i class="fas fa-times"></i>
                        </span>
                            </a>
                        </div>
                        <div class="modal-body px-5">
                            <div class="table-responsive" >
                                <table class="table table-bordered table-striped">
                                    <tbody>
                                    <tr>
                                        <th>Oder Number</th>
                                        <td>{{ modalItem.order_number || "Not Available" }}</td>
                                    </tr>
                                    <tr >
                                        <th>Order Date</th>
                                        <td>{{ modalItem.price}}</td>
                                    </tr>

                                    <tr>
                                        <th>Product</th>
                                        <td>{{modalItem.product.name }}</td>
                                    </tr>
                                    <tr>
                                        <th>Business Type</th>
                                        <td>{{modalItem.business_type }}</td>
                                    </tr>
                                    <tr>
                                        <th>Repayment</th>
                                        <td>{{modalItem.repayment | currency('₦')}}</td>
                                    </tr>
                                     <tr>
                                        <th>Downpayment</th>
                                        <td>{{modalItem.down_payment | currency('₦')}}</td>
                                    </tr>
                                    <tr>
                                        <th>Total Amount to Pay</th>
                                        <td>{{modalItem.product_price | currency('₦')}}</td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>

                            


                        </div>
                        <div class="modal-footer justify-content-center">

                        </div>

                    </div>
                    <div v-else-if="mode==='amortization'" class="table-responsive">
                        

                    </div>
                    <div v-else-if="mode==='notification'" class="table-responsive">
                        <div class="modal-header py-2">
                            <h4>Notification Summary</h4>
                            <a aria-label="Close" class="close py-1" data-dismiss="modal">
                        <span aria-hidden="true" class="modal-close text-danger">

                            <i class="fas fa-times"></i>
                        </span>
                            </a>
                        </div>
                        <div class="modal-body px-5">
                            <div class="table-responsive" >
                                <table class="table table-bordered table-striped">
                                    <tbody>
                                    <tr>
                                        <th>Oder Number</th>
                                        <td>{{ modalItem.order_number || "Not Available" }}</td>
                                    </tr>
                                    <tr >
                                        <th>Order Date</th>
                                        <td>{{ modalItem.price}}</td>
                                    </tr>

                                    <tr>
                                        <th>Product</th>
                                        <td>{{modalItem.product.name }}</td>
                                    </tr>
                                    <tr>
                                        <th>Business Type</th>
                                        <td>{{modalItem.business_type }}</td>
                                    </tr>
                                    <tr>
                                        <th>Repayment</th>
                                        <td>{{modalItem.repayment | currency('₦')}}</td>
                                    </tr>
                                     <tr>
                                        <th>Downpayment</th>
                                        <td>{{modalItem.down_payment | currency('₦')}}</td>
                                    </tr>
                                    <tr>
                                        <th>Total Amount to Pay</th>
                                        <td>{{modalItem.product_price | currency('₦')}}</td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>

                            


                        </div>
                        <div class="modal-footer justify-content-center">

                        </div>
                    </div>
                    <div v-else class="table-responsive"></div>
                    </div>
                </div>
            </div>

             <!-- <div v-if="pageParams">
                <base-pagination
                    :page-param="pageParams"
                    :page="page"
                    @fetchData="fetchData"
                    @next="next()"
                    @prev="prev()"
                >
                </base-pagination>

            </div> -->





        </div>

    </transition>
</template>
<script>
    import Vue from 'vue';
    import {get} from '../../utilities/api';
    import Flash from "../../utilities/flash";
    import {mapGetters, mapActions} from "vuex";
    import CustomHeader from '../../components/customHeader';
    import BasePagination from '../../components/Pagination/BasePagination';
    import Vue2Filters from 'vue2-filters'

    Vue.use(Vue2Filters);

    export default {
        props: {
            //TODO::verify if its necessary to make this a prop
            withBranchFilter: {default: true},
            urlToFetchOrders: {default: '/api/repayment_reminder'}
        },

        components: {CustomHeader, BasePagination },

        computed: {...mapGetters(['getBranches'])},

        data() {
            return {
                branch_id: '',
                modalItem: null,
                page_size: 10,
                 OId: null,
                date_from: null,
                date_to: null,
                page: 1,
                pageParams: null,
                filters: [
                    {name: 'date from', model: 'date_from'},
                    {name: 'date to', model: 'date_to'}
                ],
                mode: "",
                 message: {
                    default: 7,
                    first_message: 7,
                    second_message: 14,
                    third_message: 21

                },
               
                orders: null,
                type: null,
                response: {},
                show: false,
                showModalContent:false,
                headings:
                    ['Order Number', 'Order Customer name', 'Product', 'Repayment', 'Reminder History']
            }
        },

        methods: {
             fetchData() {

                this.$scrollToTop();
                this.$LIPS(true);
                let {page, page_size} = this.$data;
                get(`${this.urlToFetchOrders}?days=${this.type === null ? this.message.default : this.type}`
                )
                    .then(({data}) => {
                        this.orders = data.data;
                         this.$LIPS(false);
                        })
                    .catch(() => Flash.setError('Error Preparing form'));

                   


            },
            prepareList(response){
                let {current_page, first_page_url, from, last_page, last_page_url, data, per_page, next_page_url, to, total, prev_page_url} = response.data;
                this.pageParams = Object.assign({}, this.pageParams, {current_page, first_page_url, from, last_page, last_page_url, per_page, next_page_url, to, total, prev_page_url});
                
                this.OId = from;
                

            },
             viewStuffs(item, model){
                 this.modalItem = item;
                 this.mode = model;
                this.showModalContent = true;    
                return $(`#viewStuffs`).modal('toggle');
            }
        },
        created(){

           this.fetchData();
        }

    }
</script>

<style scoped>
    .flex-row-bottom {
        display: flex;
        flex-direction: row;
        align-items: flex-end;
        justify-content: flex-end;
    }
</style>
