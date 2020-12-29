<template>
    <transition name="fade">
        <div id="reminder" class="attendance">

            <custom-header :title="'Reminder List'"/>
            

            <div class="mt-2 mt-lg-3 row attendance-head ">
                
                 
            <resueable-search :url="urlToFetchOrders" @childToParent="prepareList">
                <template #default= "{ searchQuery }">
                <div class="col-md">
                    <div>
                    <label class="form-control-label">Reminder Type:  </label>
                    </div>
                    <select name="option" v-model="searchQuery.days"  class="custom-select">
                        <option :value="message.default">Default</option>
                        <option :value="message.first_message">First message</option>
                        <option :value="message.second_message">Second message</option>
                        <option :value="message.third_message">Third message</option>
                        <option :value="message.first_call">First call</option>
                        <option :value="message.second_call">Second call</option>
                        <option :value="message.third_call">Third call</option>
                    </select>
                </div>
                </template>
            </resueable-search>
            
            </div>
            <div class="mt-5 mb-3 attendance-head">
                <div class="w-100 my-5 mx-0 hr"></div>
                
                <div class="row px-4 pt-3 pb-4 text-center">
                    <div class="col light-heading" style="max-width: 120px">S/N</div>
                    <div class="col light-heading" v-for="header in headings">{{header}}</div>
                    <div class="col light-heading" v-if="modeType==='call'">Feedback</div>
                    <div class="col light-heading" v-if="modeType==='call'">Promise Date</div>
                </div>
            </div>
            <div class="tab-content mt-1 attendance-body">
                 <div class="mb-3 row attendance-item" :key="index" v-for="(order,index) in orders">
                        <div class="col d-flex align-items-center" style="max-width: 120px"  >
                            <span class="user mx-auto" v-if="modeType==='call'" @click="save(order)">{{index + OId}}</span>
                            <span class="user mx-auto" v-else>{{index + OId}}</span>
                        </div>
                        <div class="col d-flex align-items-center justify-content-center" @click="viewStuffs(order, 'order')">
                            {{order.order_number}}
                        </div>
                        <div class="col d-flex align-items-center justify-content-center" @click="viewStuffs(order.customer, 'customer')">
                            {{order.customer_name}}
                        </div>
                        <div class="col d-flex align-items-center justify-content-center" >
                            {{order.product.name}}
                        </div>
                         <div class="col d-flex align-items-center justify-content-center overflow-auto" @click="viewStuffs(order, 'amortization')">
                            {{order.repayment - calcDebt(order.amortization) | currency('₦')}} | {{order.repayment  |  currency('₦')}} 
                        </div>
                         <div class="col d-flex align-items-center justify-content-center" @click="viewStuffs(order.notifications, 'notification')">
                            {{order.notifications[0]? order.notifications.length : 'Not available'}}
                        </div>
                        <div class="col d-flex align-items-center justify-content-center" v-if="modeType==='call'">
                            <input type="text" name="feedback"  class="form-control" v-model="order.feedback">
                        </div>
                        <div class="col d-flex align-items-center justify-content-center" v-if="modeType==='call'">
                            <input type="date" name="date" v-model="order.promise_date" class="form-control"/>
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

    </transition>
</template>
<script>
    import Vue from 'vue';
    import {get, post} from '../../utilities/api';
    import Flash from "../../utilities/flash";
    import {mapGetters, mapActions} from "vuex";
    import CustomHeader from '../../components/customHeader';
    
    import ReusableSearch from '../../components/ReusableSearch';
    import BasePagination from '../../components/Pagination/BasePagination';
    import Vue2Filters from 'vue2-filters';
    import NewOrderAmortization from "../../components/NewOrderAmortization"
    import OrderWithPromiseCall from '../../utilities/reminder';
    import ResueableSearch from '../../components/ReusableSearch.vue';




    Vue.use(Vue2Filters);

    export default {
        props: {
            //TODO::verify if its necessary to make this a prop
            withBranchFilter: {default: true},
            urlToFetchOrders: {default: '/api/repayment_reminder'}
        },

        components: {CustomHeader, BasePagination, NewOrderAmortization, ResueableSearch },

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
                 page_size: 10,
                filters: [
                    {name: 'date from', model: 'date_from'},
                    {name: 'date to', model: 'date_to'}
                ],
                mode: '',
                modeType: '',
                 message: {
                    default: 7,
                    first_message: 7,
                    second_message: 14,
                    third_message: 21,
                    first_call: 28,
                    second_call: 35,
                    third_call: 42

                },
                promise_date: null,
               
                orders: null,
                type: null,
                response: {},
                show: false,
                showModalContent:false,
                headings:
                    ['Order Number', 'Order Customer name', 'Product', 'Paid | Repayment', 'Reminder Count']
            }
        },

        methods: {
             fetchData() {

                this.$scrollToTop();
                this.$LIPS(true);
               
                let {page, page_size} = this.$data;
                get(`${this.urlToFetchOrders}?days=${this.type === null ? this.message.default : this.type}`+`${!!page ? `&page=${page}` : ""}` +
          `${!!page_size ? `&pageSize=${page_size}` : ""}`
                )
                   .then(({data}) => this.prepareList(data))
                    .catch(() => Flash.setError('Error Preparing form'));

                   


            },
           prepareList(response){
               console.log('here', response.days);
               this.type = response.days;
               response.days === this.message.first_call || response.days === this.message.second_call || response.days === this.message.third_call ? this.modeType = 'call' : this.modeType = 'message';
                let {current_page, first_page_url, from, last_page, last_page_url, data, per_page, next_page_url, to, total, prev_page_url} = response.data;
                this.pageParams = Object.assign({}, this.pageParams, {current_page, first_page_url, from, last_page, last_page_url, per_page, next_page_url, to, total, prev_page_url});
                this.orders = data;
                this.OId = from;
                this.$LIPS(false);

            },
             viewStuffs(item, model){
                 this.modalItem = item;
                 this.mode = model;
                this.showModalContent = true;    
                return $(`#viewStuffs`).modal('toggle');
            },
            calcDebt(amortization){
                // I assumed that all repayments are uniform and are not varied
                let res = amortization.filter(amor => {
                    return amor.actual_amount === 0
                });
                return res.length * amortization[0].expected_amount;
            },
            convertDate(date){
                let utcDate = new Date(date).toUTCString();
                return utcDate;

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
             save(order){
                 this.$LIPS(true);
                 let type = Object.keys(this.message).find(key => this.message[key] === this.type);
                let data = {
                    "feedback": order.feedback,
                    "order_id": order.id,
                    "type": type,
                    "status": "called",
                    "promise_date": order.promise_date === true? null : order.promise_date
                    };

                post(this.urlToFetchOrders, data).then(({data}) => {
                    if(data.status === 'success'){
                        this.$swal({
                                                              icon: 'success',
                                            title: "Feedback saved successfully"

                                        });
                                        this.$LIPS(false);
                                        order.feedback = "";
                                        order.promise_date = "";
                                        this.modeType = 'call';
                                        this.fetchData();
                                        
                    }
                }).catch(({response:r}) => {
                                    let {data, status} = r;
                                    if (status === 422) {
                                        this.error = data.errors ? data.errors : data;
                                        this.$networkErr('form');
                                    }
                                }).finally(() => {
                                this.$scrollToTop();
                                this.$LIPS(false);
                            });
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
