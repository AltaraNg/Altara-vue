<template>
    <div class="">
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
                    <div class="col-12 col-xs-2 col-md col-lg d-flex user-name align-items-center justify-content-center">
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
    </div>
</template>
<script>
import { get } from "../utilities/api";
import Pagination from "./Pagination/pagination.vue";
import { mapGetters } from "vuex";

export default {
    name: "ClientCustomers",
    components: { "custom-pagination": Pagination },

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
            apiUrls: {
                customers: "/api/uploaded/client/customers",
            },
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
    },
    async mounted() {
        await this.fetchCustomers();
    },
};
</script>
