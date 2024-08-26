<template>
    <div class="mt-1 mx-5">
        <div class="mt-5 mb-3 attendance-head">
            <div class="row px-5 pt-3 pb-4 text-center">
                <div class="col light-heading" style="max-width: 100px">S/No.</div>
                <div class="col light-heading" v-for="(header, index) in headers" :key="index">
                    {{ header }}
                </div>
            </div>
        </div>
        <div class="tab-content mt-1 attendance-body">
            <div class="tab-pane active text-center" v-if="(show && uploadedCustomers.length > 0) || uploadedCustomers.length > 0">
                <div class="mb-3 row attendance-item" v-for="(item, index) in uploadedCustomers" :key="item.id">
                    <div class="col-12 col-xs-2 col-md col-lg d-flex align-items-center">
                        <span class="user mx-auto">{{ index + 1 }}</span>
                    </div>
                    <div class="col-12 col-xs-2 col-md col-lg d-flex user-name align-items-center justify-content-center">
                        {{ $humanizeDate(item.created_at) }}
                    </div>
                    <div class="col-12 col-xs-2 col-md col-lg d-flex user-name align-items-center justify-content-center">
                        {{ item.total_rows }}
                    </div>
                    <div class="col-12 col-xs-2 col-md col-lg d-flex user-name align-items-center justify-content-center">
                        {{ item.number_of_rows_processed }}
                    </div>
                    <div class="col-12 col-xs-3 col-md col-lg d-flex align-items-center justify-content-center">
                        {{ item.number_of_rows_failed }}
                    </div>

                    <div class="col-12 col-xs-3 col-md col-lg d-flex align-items-center justify-content-center">
                        {{ item.status }}
                    </div>

                    <div class="col-12 col-xs-3 col-md col-lg d-flex align-items-center justify-content-center">
                        {{ item.uploaded_by.full_name }}
                    </div>

                    <div class="col-12 col-xs-3 col-md col-lg d-flex align-items-center justify-content-center">
                        {{ item.client.name }}
                    </div>
                    <div class="col-12 col-xs-3 col-md col-lg d-flex align-items-center justify-content-center">
                        <a :href="item.uploaded_file_url" target="_blank">link</a>
                    </div>
                </div>
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

export default {
    name: "UploadedClient",
    props: {
        show: {
            type: Boolean,
        },
    },
    data() {
        return {
            headers: ["Date", "Total Records", "Successful", "Failed", "Status", "Uploaded By", "Client", "View File"],
            apiUrls: {
                uploadedCustomers: "/api/uploaded/client/customer/collection/data",
            },
            uploadedCustomers: [],
        };
    },
    methods: {
        async fetchUploadedCustomers() {
            this.$LIPS(true);
            try {
                const tenantList = await get(this.apiUrls.uploadedCustomers);
                this.uploadedCustomers = tenantList?.data?.data?.clientCustomerCollections.data;
            } catch (err) {
                this.$displayErrorMessage(err);
            } finally {
                this.$LIPS(false);
            }
        },
    },
    async mounted() {
        await this.fetchUploadedCustomers();
    },
};
</script>
