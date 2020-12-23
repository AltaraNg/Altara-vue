<template>
    <div>
        <div class="mt-5 mb-3 attendance-head">
             <resueable-search :url="url" @childToParent="prepareList" :showBranch="true" :showDate="true">
             </resueable-search>
                <div class="w-100 my-5 mx-0 hr"></div>
                <div class="row px-4 pt-3 pb-4 text-center">
                    <div class="col light-heading" style="max-width: 120px">S/N</div>
                    <div class="col light-heading" v-for="header in headings">{{header}}</div>
                </div>
        </div>
        <div class="tab-content mt-1 attendance-body">
             <div class="mb-3 row attendance-item" :key="index" v-for="(order, index) in orders" v-if="orders">
                 <div class="col d-flex align-items-center" style="max-width: 120px">
                     <span class="user mx-auto">{{ index + OId }}</span>
                 </div>
                 <div class="col-12 col-xs-3 col-md col-lg d-flex align-items-center justify-content-center">
                     {{order.order_number}}
                 </div>
                 <div class="col-12 col-xs-3 col-md col-lg d-flex align-items-center justify-content-center" data-hoverable="true"  @click="viewStuffs(order, 'order')">
                     {{ order.order_date }}
                 </div>
                 <div class="col-12 col-xs-3 col-md col-lg d-flex align-items-center justify-content-center"data-hoverable="true" @click="viewStuffs(order.customer, 'customer')">
                     ID: {{order.customer.id }}-{{order.customer.employment_status}}
                 </div>
                 <div class="col-12 col-xs-3 col-md col-lg d-flex align-items-center justify-content-center" data-hoverable="true"  @click="viewStuffs(order, 'amortization')">
                     {{order.repayment - calcDebt(order.amortization) | currency('₦')}} | {{order.repayment  |  currency('₦')}}
                 </div>
                  <div class="col-12 col-xs-3 col-md col-lg d-flex align-items-center justify-content-center" data-hoverable="true"  @click="viewStuffs(order.notifications, 'notification')">
                     {{order.notifications[0]? order.notifications.length : '0'}} reminder(s) sent
                 </div>
          
             </div>
        </div>

         <div class="modal fade repayment" id="viewStuffs">
                <div class="modal-dialog modal-lg" role="document">
                    <div class="modal-content " v-if="showModalContent">

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
                                        <th>Order Number</th>
                                        <td>{{ modalItem.order_number || "Not Available" }}</td>
                                    </tr>
                                    <tr >
                                        <th>Order Date</th>
                                        <td>{{ modalItem.order_date}}</td>
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
                    <div v-else-if="mode==='amortization'">
                        <new-order-amortization
                        :standAlone="true"
                        :order="modalItem"
                        :customer="modalItem.customer"
                        ></new-order-amortization>
                        

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
                                <div v-if="modalItem.length === 0">
                                    No Notifications to see!!!
                                </div>
                                <table class="table table-bordered table-striped"  v-else>
                                    <thead>
                                        <tr>
                                            <th>S/N</th>
                                             <th>Date</th>
                                             <th>Notification Type</th>
                                              <th>SMS/Feedback</th>
                                               
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="(object, index) in modalItem">
                                            <td>{{index+1}}</td>
                                            <td>{{convertDate(object.created_at)}}</td>
                                            <td>{{object.type == "App\\Notifications\\SmsReminderSent"? "SMS" : "Call"}}</td>
                                            <td>{{object.type == "App\\Notifications\\SmsReminderSent"? object.data.message : object.data.feedback}}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            


                        </div>
                        <div class="modal-footer justify-content-center">

                        </div>
                    </div>
                    <div v-else-if="mode === 'customer'">
                        <div class="modal-header py-2">
                            <h4>Customer Details</h4>
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
                                        <th>Customer Name</th>
                                        <td>{{ `${modalItem.first_name} ${modalItem.last_name}` || "Not Available" }}</td>
                                    </tr>
                                    <tr >
                                        <th>Customer Number</th>
                                        <td>{{ modalItem.telephone}}</td>
                                    </tr>

                                    <tr>
                                        <th>Registered By</th>
                                        <td>{{modalItem.employee_name }}</td>
                                    </tr>
                                    <tr>
                                        <th>Date Registered</th>
                                        <td>{{modalItem.date_of_registration}}</td>
                                    </tr>
                                    
                                    <tr>
                                        <th>Occupation</th>
                                        <td>{{modalItem.occupation}}</td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>

                            


                        </div>
                        <div class="modal-footer justify-content-center">

                        </div>
                    </div>
                    </div>
                </div>

                 
            </div>
            <div v-if="pageParams">
                <base-pagination
                    :page-param="pageParams"
                    :page="page"
                    @fetchData="fetchData"
                    @next="next()"
                    @prev="prev()"
                >
                </base-pagination>

            </div>


    </div>
</template>

<script>
import Vue from 'vue';
import {get} from '../utilities/api';
import {mapGetters, mapActions} from "vuex";
 import Vue2Filters from 'vue2-filters';
 import NewOrderAmortization from './NewOrderAmortization';
 import ResueableSearch from './ReusableSearch.vue';
 import BasePagination from './Pagination/BasePagination';

 Vue.use(Vue2Filters);
    export default {
        components: {NewOrderAmortization, ResueableSearch, BasePagination},
        computed: {...mapGetters(['getBranches'])},
        data(){
            return {
                headings:  ['Order Number', 'Order Summary', 'Customer Info Summary', 'Repayment Summary', 'Reminder History'],
                orders: null,
                url: '/api/new_order',
                pageParams: null,
                OId: 0,
                showModalContent: false,
                mode: null,
                modalItem: null,
                page: 1

            
            }
        },
        methods: {
            fetchData() {
                this.$scrollToTop();
                this.$LIPS(true);
                let { page, page_size } = this.$data;
                get(
                    this.url +
                    `${!!page ? `?page=${page}` : ""}` +
                    `${!!page_size ? `&pageSize=${page_size}` : ""}`
                    )
                   .then(({ data }) => this.prepareList(data))
                    .catch(() => Flash.setError("Error Preparing form"));
                },

            
            prepareList(response){
                let {current_page, first_page_url, from, last_page, last_page_url, data, per_page, next_page_url, to, total, prev_page_url} = response.data;
                this.pageParams = Object.assign({}, this.pageParams, {current_page, first_page_url, from, last_page, last_page_url, per_page, next_page_url, to, total, prev_page_url});
                this.orders = data;
                this.OId = from;
                this.$LIPS(false);

            },
             calcDebt(amortization){
                // I assumed that all repayments are uniform and are not varied
                let res = amortization.filter(amor => {
                    return amor.actual_amount === 0
                });
                return res.length * amortization[0].expected_amount;
            },
             viewStuffs(item, model){
                 this.modalItem = item;
                 this.mode = model;
                this.showModalContent = true;    
                return $(`#viewStuffs`).modal('toggle');
            },
            next(firstPage = null) {
                if (this.pageParams.next_page_url) {
                    this.page = firstPage ? firstPage : parseInt(this.page) + 1;
                    this.fetchData();
                    }
                },

            prev(lastPage = null) {
                if (this.pageParams.prev_page_url) {
                    this.page = lastPage ? lastPage : parseInt(this.page) - 1;
                    this.fetchData();
                    }
                },
        },
        created() {            
            this.$prepareBranches();
            this.fetchData();
        },

        
    }
</script>

<style lang="scss" scoped>

</style>