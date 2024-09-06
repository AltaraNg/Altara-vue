<template>
    <div class="">
        <div class="mt-5 mb-3 attendance-head card-header-tabs">
            <client-customer-filter :tenants="tenants" :branches="getBranches" :states=states @applyFilter="submitFilter" @resetFilter="resetFilter" />
        </div>
        <div class="mt-5 mb-3 attendance-head">
            <div class="row px-5 mx-5 pt-3 pb-4 text-center">
                <div class="col light-heading align-items-center justify-content-center" style="max-width: 100px">S/No.</div>
                <div class="col light-heading align-items-center justify-content-center" v-for="(header, index) in customerHeaders" :key="index">
                    {{ header }}
                </div>
            </div>
        </div>
        <div class="tab-content mt-1 attendance-body">
            <div class="tab-pane active text-center" v-if="(show && customers.length > 0) || customers.length > 0">
                <div class="mb-3 row attendance-item" v-for="(item, index) in customers" :key="item.id">
                    <div class="col-12 col-xs-2 col-md col-lg d-flex align-items-center">
                        <span class="user mx-auto">{{ index + 1 }}</span>
                    </div>
                    <div class="col-12 col-xs-2 col-md col-lg d-flex user-name align-items-center justify-content-center">
                        {{ `${item.first_name} ${item.last_name}` }}
                    </div>
                    <div
                        class="col-12 col-xs-2 col-md col-lg d-flex user-name align-items-center justify-content-center"
                        @click="viewAmortization(item)"
                    >
                        {{ item.id }}
                    </div>
                    <div class="col-12 col-xs-2 col-md col-lg d-flex user-name align-items-center justify-content-center">
                        {{ getBranchName(item.branch_id) }}
                    </div>
                    <div class="col-12 col-xs-3 col-md col-lg d-flex align-items-center justify-content-center">
                        {{ getTenName(item.tenant_id) }}
                    </div>

                    <div class="col-12 col-xs-3 col-md col-lg d-flex align-items-center justify-content-center">
                        {{ item.date_of_registration }}
                    </div>
                </div>
                <custom-pagination :pageParam="pageData"></custom-pagination>
            </div>

            <div class="tab-pane active text-center" v-else>
                <div class="mb-3 row attendance-item">
                    <div class="col d-flex light-heading align-items-center justify-content-center">No records found!</div>
                </div>
            </div>
        </div>

        <div class="modal fade repayment" id="viewStuffs">
            <div class="modal-dialog modal-xl" role="document">
                <div class="modal-content" v-if="showModalContent">
                    <div>
                        <new-order-amortization :standAlone="true" :order="modalItem" :customer="modalItem.customer"></new-order-amortization>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { get } from "../utilities/api";
import queryParam from "../utilities/queryParam";
import ClientCustomerFilter from "./Filters/ClientCustomerFilter.vue";
import Pagination from "./Pagination/pagination.vue";
import NewOrderAmortization from "./NewOrderAmortization.vue";

import { mapGetters } from "vuex";

export default {
    name: "ClientCustomers",
    components: { "custom-pagination": Pagination, "client-customer-filter": ClientCustomerFilter, "new-order-amortization": NewOrderAmortization },

    props: {
        show: {
            type: Boolean,
        },
        tenants: {
            type: Array,
            required: true,
        },
    },
    data() {
        return {
            customerHeaders: ["Full Name", "Customer ID", "Branch", "Tenant", "Status"],
            pageData: null,
            customers: [],
            modalItem: null,
            showModalContent: false,
            apiUrls: {
                customers: "/api/uploaded/client/customers",
                new_order: "/api/new_order",
            },
            states: [],
        };
    },
    computed: {
        ...mapGetters(["getBranches"]),
    },
    methods: {
        async fetchCustomers() {
            this.$LIPS(true);
            try {
                const tenantList = await get(this.apiUrls.customers);
                this.pageData = tenantList?.data?.data?.customers;
                this.customers = tenantList?.data?.data?.customers.data;
            } catch (err) {
                this.$displayErrorMessage(err);
            } finally {
                this.$LIPS(false);
            }
        },
        getTenName(id) {
            return this.tenants.find((i) => i.id === id).name;
        },

        getBranchName(id) {
            return this.getBranches.find((i) => i.id === id).name;
        },

        async submitFilter(load) {
            this.$LIPS(true);
            try {
                let res = await get(this.apiUrls.customers + queryParam(load));
                this.customers = res?.data?.data?.customers.data;

                console.log(res);
            } catch (error) {
                console.log(error);
            } finally {
                this.$LIPS(false);
            }
        },
        async viewAmortization(item) {
            try {
                this.$LIPS(true);
                let res = await get(this.apiUrls.new_order + queryParam({ customer_id: item.id }));
                console.log(res);
                this.modalItem = res.data.data.data[0];
                this.showModalContent = true;
                return $(`#viewStuffs`).modal("toggle");
            } catch (error) {
                console.log(error);
            } finally {
                this.$LIPS(false);
            }

            // this.modalItem = item;
            // this.showModalContent = true;
            // return $(`#viewStuffs`).modal("toggle");
        },
        async resetFilter() {
            this.fetchCustomers();
        },

        async fetchStates() {
            this.$LIPS(true);
            try {
                const states = await get("/api/state");
                this.states = states.data.states;
                console.log(states);
            } catch (err) {
                this.$displayErrorMessage(err);
            } finally {
                this.$LIPS(false);
            }
        },
    },
    async mounted() {
        await this.fetchCustomers();
        await this.fetchStates();
    },
};
</script>
