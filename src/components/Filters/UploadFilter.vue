<template>
    <div class="card w-100 fixed">
        <div class="card-header">
            <h3 class="card-title">Filter</h3>
        </div>
        <div class="d-flex card-body justify-content-around">
            <div class="w-100">
                <!-- ?Tenant ID        </div> -->
                <select name="" id="" class="custom-select w-100" v-model="tenantId">
                    <option value="" disabled selected>--Select Tenant--</option>
                    <option :value="tenant.id" v-for="tenant in tenants" :key="tenant.id">{{ tenant.name }}</option>
                </select>
            </div>
            <div class="w-100">
                <!-- ?Date       </div> -->
                <date-picker placeholder="From date" v-model="fromDate" class="w-100" :format="dateFormat" valueType="format"></date-picker>
            </div>
            <div class="w-100">
                <!-- ?Name         </div> -->
                <date-picker placeholder="To date" v-model="toDate" class="w-100" :format="dateFormat" valueType="format"></date-picker>
            </div>
            <div class="w-100">
                <!-- ?Branch ID        </div> -->
                <select name="" id="" class="custom-select w-100" v-model="status">
                    <option value="" selected disabled>--Select Status--</option>
                    <option :value="status" v-for="(status, index) in statuses" :key="index">{{ status }}</option>
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
    name: "UploadFilter",
    components: {
        DatePicker,
    },
    props: {
        tenants: {
            type: Array,
            required: true,
        },
       
    },
    data() {
        return {
            fromDate: null,
            toDate: null,
            tenantId: "",
            status: "",
            dateFormat: "YYYY-MM-DD",

            statuses: ["pending", "completed", "pending", "in_progress", "failed"],
        };
    },

    methods: {
        applyFilter() {
            let data = {};
            this.fromDate ? (data.fromDate = this.fromDate) : "";
            this.toDate ? (data.toDate = this.toDate) : "";
            this.tenantId != "" ? (data.tenant = this.tenantId) : "";
            this.status != "" ? (data.status = this.status) : "";

            this.$emit("applyFilter", data);
        },

        resetFilter() {
            this.status = "";
            this.fromDate = null;
            this.toDate = null;
            this.tenantId = "";
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
