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
                        <option disabled>--select--</option>
                        <option :value="option.value" v-for="option in message">{{option.name}}</option>                       
                    </select>
                </div>
                <div class="col-md">
                    <div>
                    <label class="form-control-label">Business Type:  </label>
                    </div>
                    <select name="option" v-model="searchQuery.businessType"  class="custom-select">
                        <option disabled>--select--</option>
                        <option :value="option.id" v-for="option in businessTypes">{{option.name}}</option>                       
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
                     <div class="col light-heading" v-if="evalMode==='collection' || evalMode === 'recovery'">Visited?</div>
                    <div class="col light-heading" v-if="evalMode==='call' || evalMode === 'collection' || evalMode === 'recovery'">Feedback</div>
                    <div class="col light-heading" v-if="evalMode==='call'">Promise Date</div>
                    <div class="col light-heading" v-if="evalMode==='recovery'">Action</div>
                   
                    
                </div>
            </div>
            <div class="tab-content mt-1 attendance-body">
                 <div class="mb-3 row attendance-item" :key="index" v-for="(order,index) in orders">
                        <div class="col d-flex align-items-center"  style="max-width: 120px"  >
                            <span class="user mx-auto" :class="{'isProcessed': order.isProcessed}" v-if="evalMode==='call' || evalMode === 'collection' || evalMode === 'recovery'" @click="save(order)">{{index + OId}}</span>
                            <span class="user mx-auto" :class="{'isProcessed': order.isProcessed}" v-else>{{index + OId}}</span>
                        </div>
                        <div class="col d-flex align-items-center justify-content-center" @click="viewStuffs(order, 'order')">
                            {{order.order_number}}
                        </div>
                        <div class="col d-flex align-items-center justify-content-center" @click="viewStuffs(order.customer, 'customer')">
                            {{order.customer_name}}
                        </div>
                        <div class="col d-flex align-items-center justify-content-center" >
                            {{order.product ? order.product.name : 'N/A'}}
                        </div>
                         <div class="col d-flex align-items-center justify-content-center overflow-auto" @click="viewStuffs(order, 'amortization')">
                            {{order.repayment - calcDebt(order.amortization) | currency('₦')}} | {{order.repayment  |  currency('₦')}} 
                        </div>
                         <div class="col d-flex align-items-center justify-content-center" @click="viewStuffs(order.notifications, 'notification')">
                            {{order.notifications[0]? order.notifications.length : 'N/A'}}
                        </div>
                         <div class="col d-flex align-items-center justify-content-center" v-if="evalMode==='collection' || evalMode === 'recovery'">
                            <span>
                                <span class="radio w-50 pr-3 mb-0 float-left">
                                    <input type="radio" :value="true" v-model="order.is_visited" :id="`present${index}`" v-if="!order.isProcessed" v-validate="'required'" :name="`isPresent${index}` " :disabled="order.isProcessed" class="form-check-input">
                                    <label :for="`present${index}`" v-if="!order.isProcessed">yes</label>
                                     <input type="radio" :value="true" v-model="order.visited" :id="`present${index}`" v-if="order.isProcessed" v-validate="'required'" :name="`isPresent${index}` " :disabled="order.isProcessed" class="form-check-input">
                                    <label :for="`present${index}`" v-if="order.isProcessed">yes</label>
                                </span>
                                <span class="radio w-50 pl-3 mb-0 float-left">
                                    <input type="radio" :value="false" v-model="order.is_visited" v-if="!order.isProcessed" :id="`absent${index}`" v-validate="'required'" :disabled="order.isProcessed" 
                            :name="`isPresent${index}`" class="form-check-input">
                                    <label :for="`absent${index}`" v-if="!order.isProcessed" >no</label>
                                    <input type="radio" :value="false" v-model="order.visited" v-if="order.isProcessed" :id="`absent${index}`" v-validate="'required'" :disabled="order.isProcessed" 
                            :name="`isPresent${index}`" class="form-check-input">
                                    <label :for="`absent${index}`" v-if="order.isProcessed" >no</label>
                                </span>
                            </span>
                        </div>



                        <div class="col d-flex align-items-center justify-content-center"  v-if="evalMode==='call' || evalMode === 'collection' || evalMode === 'recovery'">
                            <input type="text" :name="'feedback_'+index"  class="form-control"  v-model="order.feedback" v-validate="'required'" :disabled="order.isProcessed" >
                            
                        </div>
                        <div class="col d-flex align-items-center justify-content-center" v-if="evalMode==='call'">
                            <input type="date" name="date" v-model="order.promise_date" class="form-control" required :disabled="order.isProcessed" v-validate="'required'"/>
                        </div>

                        <div class="col d-flex align-items-center justify-content-center" v-if="evalMode==='recovery'">
                            <button class="bg-default btn" @click="confirmModal(order)" :disabled="order.status === 'Repossessed'">Repossess</button>
                        </div>




                </div>


            </div>
            <div class="modal fade repayment" id="viewStuffs">
                <div class="modal-dialog modal-xl" role="document">
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
                                        <td>{{modalItem.product.name || '' }}</td>
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
                                            <td>{{object.data.type}}</td>
                                            <td>{{object.type === "App\\Notifications\\SmsReminderSent"? object.data.message : object.data.feedback}}</td>
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
                    @fetchData="fetchData"                    
                    
                >
                </base-pagination>

            </div>
            <div>
                <confirm-modal :show="showPrompt" @touched="repossess($event)"></confirm-modal>
            </div>





        </div>

    </transition>
</template>
<script>
    import Vue from 'vue';
    import {get, post, patch} from '../../utilities/api';
    import Flash from "../../utilities/flash";
    import {mapGetters, mapActions} from "vuex";
    import CustomHeader from '../../components/customHeader';
    import confirmModal from '../../components/modals/ConfirmModal';
    import BasePagination from '../../components/Pagination/BasePagination';
    import Vue2Filters from 'vue2-filters';
    import NewOrderAmortization from "../../components/NewOrderAmortization"
    import OrderWithPromiseCall from '../../utilities/reminder';
    import ResueableSearch from '../../components/ReusableSearch.vue';
import ConfirmModal from '../../components/modals/ConfirmModal.vue';
import queryParam from '../../utilities/queryParam';




    Vue.use(Vue2Filters);

    export default {
        props: {
            //TODO::verify if its necessary to make this a prop
            withBranchFilter: {default: true},
            
        },

        components: {CustomHeader, BasePagination, NewOrderAmortization, ResueableSearch, ConfirmModal},

        computed: {...mapGetters(['getBranches'])},

        data() {
            return {
                urlToFetchOrders: '/api/repayment_reminder',
                formErrors: [],
                selectedOrder: null,
                showPrompt: false,
                branch_id: '',
                modalItem: null,    
                 OId: null,
                date_from: null,
                date_to: null,
                page: 1,
                pageParams: {},
                searchQuery: {},
                 limit: 10,
                filters: [
                    {name: 'date from', model: 'date_from'},
                    {name: 'date to', model: 'date_to'}
                ],
                mode: '',
                modeType: 'first_sms',
                message: [],
                promise_date: null,
                evalMode: null,
                businessTypes: [],
               
                orders: null,
                type: null,
                response: {},
                show: false,
                showModalContent:false,
                headings:
                    ['Order Number', 'Order Customer name', 'Product', 'Paid | Repayment', 'Reminder Count'],
                disabledOrders: [],
                error: {}
            }
        },

        methods: {
             async fetchData() {

                // this.$scrollToTop();
                this.$LIPS(true);
               
                let params = {
                    days: this.type === null ? 7 : this.type,
                    page: this.pageParams.page ?? '',
                    limit: this.pageParams.limit ?? '',
                    ...this.searchQuery
                }
                if(this.$route.query){
          params = {...params, ...this.$route.query};
        }
                await get(this.urlToFetchOrders + queryParam(params))
                   .then(({data}) => this.prepareList(data))
                    .catch(() => Flash.setError('Error Preparing form'));

                   


            },
           prepareList(response){
                if(response.days !== undefined){
                    this.modeType = this.message.find((item) => {
                        return item.value === response.days
                        }).name;
                    this.type = response.days; 
                }
                           
                let {current_page, first_page_url, from, last_page, last_page_url, data, per_page, next_page_url, to, total, prev_page_url} = response.data;
                this.pageParams = Object.assign({}, this.pageParams, {current_page, first_page_url, from, last_page, last_page_url, per_page, next_page_url, to, total, prev_page_url});
                this.orders = data;
                 if(response.queryParams !== undefined){
        this.searchQuery = response.queryParams;
      }
                this.OId = from;
                this.classAdd(this.modeType);
                this.$LIPS(false);

            },
             viewStuffs(item, model){
                 this.modalItem = item;
                 this.mode = model;
                this.showModalContent = true;    
                return $(`#viewStuffs`).modal('toggle');
            },
            calcDebt(amortization){
                // * Assumed equal distribution of amortization
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
                    this.pageParams.page = firstPage ? firstPage : parseInt(this.pageParams.page) + 1;

                    this.fetchData();
                    }
                },
            
            async getReminderValues(){
                let values = await get('/api/reminder_value');
                this.message = values.data.data.data;
                this.message.sort((a,b) => {
                   return (a.id < b.id) ? -1 : 1
                });
            },

            confirmModal(order){
                if(this.showPrompt === true){
                    this.showPrompt = false
                }else{
                this.showPrompt = true;

                }
                this.selectedOrder = order;
            },

             async getBusinessType(){
                let values = await get('/api/business_type');
                this.businessTypes = values.data.data.data;
                
            },

            excemptFunc(element){
                element.isProcessed = true;

            },

            prev(lastPage = null) {
                if (this.pageParams.prev_page_url) {
                    this.page = lastPage ? lastPage : parseInt(this.page) - 1;
                    this.fetchData();
                    }
                },
             save(order){
                 if(!order.isProcessed){
                     
                     this.$validator.validate().then(valid => {
                         if(valid){
                             
                         }
                     })
                 this.$LIPS(true);
                 let type = this.message.find(item => item.value === this.type);
                 let data = {};
                 if(this.evalMode === 'call'){
                     
                     if(order.feedback === undefined || order.promise_date === undefined){
                        this.orders.find(item => {
                             return item.id === order.id
                         }).error = true
                     }
                    data = {
                    "feedback": order.feedback,
                    "order_id": order.id,
                    "type": type.name,
                    "status": "called",
                    "promise_date": order.promise_date === true? null : order.promise_date
                    };

                 }else{
                    data = {
                    "feedback": order.feedback,
                    "order_id": order.id,
                    "type": type.name,
                    "visited": order.is_visited,                  
                    };
                    this.urlToFetchOrders = '/api/collection'
                 }
                
                post(this.urlToFetchOrders, data).then(({data}) => {
                    if(data.status === 'success'){
                        this.$swal({
                                                              icon: 'success',
                                            title: "Feedback saved successfully"

                                        });
                                        
                                        order.feedback = "";
                                        order.promise_date = "";
                                        order.is_visited = ""; 
                                        this.urlToFetchOrders = '/api/repayment_reminder'                                      
                                        this.fetchData();
                                        this.$LIPS(false);                
                                        
                    }
                }).catch(({response:r}) => {
                                    let {data, status} = r;
                                    if (status === 422) {
                                        this.error = data.errors ? data.errors : data;
                                       
                                        
                                    }
                                }).finally(() => {                                
                                this.$LIPS(false);
                            });
                 }
            },
            classAdd(modeType){
                
                 this.orders.forEach(order => {
                    if (order.notifications.some(note => {
                        return note.data.type === modeType;
                    }) === true){
                        this.excemptFunc(order);
                    }
                    if(order.notifications.some(note => {
                        return note.data.type === modeType && note.data.visited 
                    }) === true){
                        order.visited = true;
                    }
                    else{
                        order.visited =false;
                    }
                    
                });
            },
            repossess(elem){
                if(elem) {
                    //send the request
                    this.$LIPS(true);
                    patch(`/api/new-order/${this.selectedOrder.id}/repossess`).then((res) => {
                        
                        this.fetchData();
                         this.$swal({
                                                              icon: 'success',
                                            title: "Product successfully Repossessed and Order Closed!!"

                                        });
                    }).catch((err) => {
                        Flash.setError(err)
                    }).finally(() => {
                        this.$LIPS(false);
                    })

                }
                else{
                    //close modal
                    
                    
                }
                this.showPrompt = false;
            }
        },
        async created(){

          await  this.getReminderValues();
          await this.getBusinessType();         
        await this.fetchData();   
        },
        mounted(){
           
        },
        watch: {
            modeType: function(modeType){
                this.disabledOrders = [];
                if (modeType === 'first_sms' || modeType === 'second_sms' || modeType === 'third_sms'){
                    this.evalMode = 'message';
                }
                else if(modeType === 'first_call' || modeType === 'second_call' || modeType === 'third_call'){
                    this.evalMode = 'call';
                }
                else if(modeType === 'first_collection' || modeType === 'second_collection' || modeType === 'third_collection'){
                    this.evalMode = 'collection';
                }
                else if(modeType === 'first_recovery' || modeType === 'second_recovery' || modeType === 'third_recovery' || modeType === 'recovery'){
                    this.evalMode = 'recovery';
                }

                this.classAdd(modeType);

            }
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
    .isProcessed{
        background: green;
    }
    .formError{
        border: crimson solid;
    }
</style>
