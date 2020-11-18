<template>
    <transition name="fade">
        <div id="reminder" class="attendance">

            <custom-header :title="'Reminder List'"/>
            <div class="mt-5 mb-3 attendance-head">
                <div class="w-100 my-5 mx-0 hr"></div>
                <div class="row px-4 pt-3 pb-4 text-center">
                    <div class="col light-heading" style="max-width: 120px">S/N</div>
                    <div class="col light-heading" v-for="header in headings">{{header}}</div>
                </div>
            </div>
            <div class="tab-content mt-1 attendance-body">
                 <div class="mb-3 row attendance-item" :key="index" v-for="(order,index) in orders" @click="viewStuffs(order)">
                        <div class="col d-flex align-items-center" style="max-width: 120px"  >
                            <span class="user mx-auto" >{{index+OId}}</span>
                        </div>
                        <div class="col d-flex align-items-center justify-content-center" >
                            {{order.order_number}}
                        </div>
                        <div class="col d-flex align-items-center justify-content-center">
                            {{order.customer_name}}
                        </div>
                        <div class="col d-flex align-items-center justify-content-center">
                            {{order.customer_phone}}
                        </div>
                        <div class="col d-flex align-items-center justify-content-center">
                            {{order.product.name}}
                        </div>
                         <div class="col d-flex align-items-center justify-content-center">
                            {{order.repayment  |  currency('₦')}}
                        </div>
                         <div class="col d-flex align-items-center justify-content-center">
                            {{order.notifications[0]? order.notifications[0].type : 'Not available'}}
                        </div>




                </div>


            </div>
            <div class="modal fade repayment" id="viewStuffs">
                <div class="modal-dialog modal-lg" role="document">
                    <div class="modal-content" v-if="showModalContent">
                        <div class="modal-header py-2">
                            <h4>{{modalItem.customer_name}}</h4>
                            <span>{{modalItem.customer_phone}}</span>
                            <a aria-label="Close" class="close py-1" data-dismiss="modal">
                        <span aria-hidden="true" class="modal-close text-danger">

                            <i class="fas fa-times"></i>
                        </span>
                            </a>
                        </div>
                        <div class="modal-body px-5">
                            <div class="table-responsive" v-if="modalItem.notifications.length > 0">
                                <table class="table table-bordered table-striped">
                                    <thead>
                                        <tr>
                                            <th>SN</th>
                                            <th>Type</th>
                                            <th>Feedback</th>
                                            <th>Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    <tr v-for="(notification, index) in modalItem.notifications">
                                        <td>{{index+1}}</td>
                                        <td>{{notification.type}}</td>
                                        <td>{{notification.data.feedback}}</td>
                                        <td>{{notification.created_at.split(' ')[0]}}</td>
                                    </tr>

                                    </tbody>
                                </table>
                            </div>

                            <div class="w-100">
                                <label class="control-label">Feedback: </label>
                                <textarea v-model="form.feedback" name="feedback" class="form-control" rows="6" placeholder="Enter comment ...">

                                </textarea>
                                <div class="row">
                                <div class="col-4 ">
                                    <label class="control-label">Call Type: </label>
                                    <select name="call-type" id="call-type" class="form-control" v-model="form.type">
                                        <option value="first_call">First Call</option>
                                        <option value="second_call">Second Call</option>
                                        <option value="third_call">Third Call</option>

                                    </select>
                                </div>
                                <div class="col-4">
                                    <label class="control-label">Status: </label>
                                    <select name="status" id="status" class="form-control" v-model="form.status">
                                        <option value="called">Called</option>
                                        <option value="unreachable">Unreachable</option>


                                    </select>
                                </div>
                                <div class="col-4">
                                    <label class="control-label">Promise Date: </label>
                                    <input type="date" name="date" v-model="form.promise_date" class="form-control"/>
                                    <input type="checkbox" id="null" name="null" v-model="form.promise_date"><label for="null" >Not Called</label>
                                </div>
                                </div>
                                <div class="text-center">
                                    <button class="btn bg-default"  @click="save"> Submit</button>
                                </div>

                            </div>




                        </div>
                        <div class="modal-footer justify-content-center">

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

                modalMode: null,
                form: {},
                orders: null,
                response: {},
                show: false,
                showModalContent:false,
                headings:
                    ['Order Number', 'Customer name', 'Phone Number', 'Product', 'Repayment', 'Call Count', ]
            }
        },

        methods: {
             fetchData() {

                this.$scrollToTop();
                this.$LIPS(true);
                let {page, page_size} = this.$data;
                get(`${this.urlToFetchOrders}${!!page ? `?page=${page}` : ''}${!!page_size ? `&pageSize=${page_size}` : ''}`
                )
                    .then(({data}) => this.prepareList(data))
                    .catch(() => Flash.setError('Error Preparing form'));


            },
            prepareList(response){
                let {current_page, first_page_url, from, last_page, last_page_url, data, per_page, next_page_url, to, total, prev_page_url} = response.data;
                this.pageParams = Object.assign({}, this.pageParams, {current_page, first_page_url, from, last_page, last_page_url, per_page, next_page_url, to, total, prev_page_url});
                this.orders = data;
                this.OId = from;
                this.$LIPS(false);

            },
             viewStuffs(item){
                this.showModalContent = true;
                this.modalItem = item;
                return $(`#viewStuffs`).modal('toggle');
            },
            save(){
                let data = {
                    "feedback": this.form.feedback,
                    "order_id": this.modalItem.id,
                    "type": this.form.type,
                    "status": this.form.status,
                    "promise_date": this.form.promise_date === true? null : this.form.promise_date
                    };

                post(this.urlToFetchOrders, data).then(({data}) => {
                    if(data.status === 'success'){
                        this.$swal({
                                                              icon: 'success',
                                            title: "Feedback saved successfully"

                                        });
                                        return this.$router.push(
                                            {path: '/dva/call-list'}
                                        )
                    }
                })
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
