<template>
    <transition name="fade">
        <div id="reminder">
            <switch-component :options="options" @selected="handleSwitch"/>
            <div v-if="orderMode === 'old'">
            <div class="mt-5 mb-3 attendance-head">
                <ul class="nav nav-tabs justify-content-center p-0" role="tablist">
                    <li class="col p-0 nav-item mb-0" v-for="(tab,index) in details.tabs" :key="index">
                        <a 
                        aria-selected="true" 
                        class="nav-link" 
                        :class=" (index === 0 ) && 'active'"
                        data-toggle="tab" 
                        href="#renewal-panel" 
                        @click="listToOrder = tab"
                        role="tab" 
                        v-html="tab">
                        </a>
                    </li>
                </ul>
            </div>
            
            <div class="mt-5 mb-3 attendance-head">
                <div class="row px-4 pt-3 pb-4 text-center">
                    <div class="col light-heading" :key="index" v-for="(header,index) in details.headings">{{header}}</div>
                    <div class="col light-heading">Feedback</div>
                </div>
            </div>
            <Orders :list="listToOrder" :tab="listToOrder" :mode="mode()"/>

        </div>
        <new-orders v-if="orderMode === 'new' " :url="options[1].url" ></new-orders>
        </div>
    </transition>
</template>

<script>
    import Orders from "../../../components/Orders";
    import SwitchComponent from '../../../components/SwitchComponent';
    import NewOrders from "../../../components/NewOrders"



    export default {
        components: {Orders, SwitchComponent, NewOrders},
        data() {
            return {
                listToOrder: 'Current',
                options: [
                    {
                        name: "Old records",
                        url: "/api/reminder/create"
                    },
                    {
                        name: "New records",
                        url: "/new-order-renewal-list"
                    }
                ],
                orderMode: 'old'
            }
        },
        methods: {
            mode(query = null, mode = this.$route.meta.mode.toLowerCase()) {
                return query ? mode === query : mode
            },
            handleSwitch(option){
                this.$LIPS(true);
                if (option.name === "New records"){
                    this.orderMode = 'new';
                }
                else{
                    this.orderMode = 'old';
                    this.$LIPS(false);
                }
            },
        },
        computed: {           
            details() {
                let list = 1;
                const tabs = ["Current","Successful", "Callback","Unreachable"];
                const headings2 = ['Status','Date-Time'];
                const headings1 = ['Action','Order Number', 'Order Summary', 'Customer Info Summary','Repayment Summary'];
                const headings0 = [ ...headings1 , ...headings2];
                const headings = this.listToOrder != "Successful" ? headings0 : headings1;
                return {tabs, headings, list};
            },
        }
    }
</script>

<style scoped type="scss">
    .attendance-head .light-heading:nth-child(1) {
        max-width: 120px;
    }
</style>
