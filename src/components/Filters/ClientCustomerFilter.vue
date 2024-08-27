<template>
    <div class="card w-100 fixed">
        <div class="card-header">
            <h3 class="card-title">Filter</h3>
        </div>
        <div class="d-flex card-body justify-content-around">
            <div class="w-100">
                <!-- ?Customer ID        </div> -->
                <input type="text" v-model="customerId" placeholder="Customer ID" class="mx-input w-100" />
            </div>

            <div class="w-100">
                <!-- ?Customer ID        </div> -->
                <input type="text" v-model="name" placeholder="Customer Name" class="mx-input w-100" />
            </div>

            <div class="w-100">
                <!-- ?Customer ID        </div> -->
                <input type="text" v-model="telephone" placeholder="Customer Phone" class="mx-input w-100" />
            </div>
            <div class="w-100">
                <!-- ?Tenant ID        </div> -->
                <select name="" id="" class="custom-select w-100" v-model="tenantId">
                    <option value="" disabled selected>--Select Tenant--</option>
                    <option :value="tenant.id" v-for="tenant in tenants" :key="tenant.id">{{ tenant.name }}</option>
                </select>
            </div>
            <div class="w-100">
                <!-- ?Date       </div> -->
                <date-picker placeholder="From date" v-model="fromDate" class="w-100"></date-picker>
            </div>
            <div class="w-100">
                <!-- ?Name         </div> -->
                <date-picker placeholder="To date" v-model="toDate" class="w-100"></date-picker>
            </div>
            <div class="w-100">
                <!-- ?Branch ID        </div> -->
                <select name="" id="" class="custom-select w-100" v-model="branchId">
                    <option value="" selected disabled>--Select Branch--</option>
                    <option :value="branch.id" v-for="branch in branches" :key="branch.id">{{ branch.name }}</option>
                </select>
            </div>
        </div>
        <div class="card-footer text-right">
            <button class="btn bg-default p-3" @click="applyFilter" :disabled="$isProcessing">Apply</button
            ><button class="btn btn-danger p-3" @click="resetFilter">Reset</button>
        </div>
    </div>
</template>
<script>
import DatePicker from "vue2-datepicker";
import "vue2-datepicker/index.css";

export default {
    name: "ClientCustomerFilter",
    components: {
        DatePicker,
    },
    props: {
        tenants: {
            type: Array,
            required: true,
        },
        branches: {
            type: Array,
            required: true,
        },
    },
    data() {
        return {
            customerId: null,
            fromDate: null,
            toDate: null,
            branchId: "",
            tenantId: "",
            name: "",
            telephone: "",
        };
    },

    methods: {
        applyFilter() {
            let data = {};
            this.customerId ? (data.custom_customer_id = this.customerId) : "";
            this.fromDate ? (data.fromDate = this.fromDate) : "";
            this.toDate ? (data.toDate = this.toDate) : "";
            this.branchId != "" ? (data.branch = this.branchId) : "";
            this.tenantId != "" ? (data.tenant = this.tenantId) : "";
            this.name != "" ? (data.name = this.name) : "";
            this.telephone != "" ? (data.telephone = this.telephone) : "";

            this.$emit("applyFilter", data);
        },

        resetFilter() {
            this.customerId = null;
            this.fromDate = null;
            this.toDate = null;
            this.branchId = "";
            this.tenantId = "";
            this.name = "";
            this.telephone = "";
            this.$emit("resetFilter");
        },
    },
};
</script>

<style scoped>
.fixed {
    position: -webkit-sticky; /* Safari & IE */
    position: sticky;
    top: 0;
}
</style>
