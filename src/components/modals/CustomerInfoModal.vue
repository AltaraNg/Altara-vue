<template>
    <div>
        <div class="modal-header py-2">
            <h4>Customer Details</h4>
            <a aria-label="Close" class="close py-1" data-dismiss="modal" @click="closeModal">
                <span aria-hidden="true" class="modal-close text-danger">
                    <i class="fas fa-times"></i>
                </span>
            </a>
        </div>
        <div class="modal-body px-5 scrol-modal">
            <div class="table-responsive">
                <table class="table table-bordered table-striped">
                    <tbody>
                        <tr>
                            <th>Customer Name</th>
                            <td>
                                {{ `${modalItem.first_name} ${modalItem.last_name}` || "Not Available" }}
                            </td>
                        </tr>
                        <tr>
                            <th>Customer Number</th>
                            <td>{{ modalItem.telephone }}</td>
                        </tr>

                        <tr>
                            <th>Occupation</th>
                            <td>{{ modalItem.occupation || "N/A" }}</td>
                        </tr>
                        <tr>
                            <th>Address</th>
                            <td>{{ `${modalItem.add_street}, ${modalItem.city}` }}</td>
                        </tr>
                    </tbody>
                </table>
                <h5 class="pt-3" v-if="modalItem.guarantors && modalItem.guarantors.length > 0">Guarantor List</h5>
                <table v-if="modalItem.guarantors && modalItem.guarantors.length > 0" class="table table-bordered table-striped">
                    <tr>
                        <th>S/N</th>
                        <th>Name</th>
                        <th>Phone</th>
                    </tr>
                    <template v-for="(guarantor, index) in guarantors">
                        <tr :key="index" v-if="index < 2">
                            <td>{{ index + 1 }}</td>
                            <td>
                                {{ `${guarantor.first_name} ${guarantor.last_name}` }}
                            </td>
                            <td>{{ `${guarantor.phone_number}` }}</td>
                        </tr>
                    </template>
                </table>

                <div v-if="documents && documents.length > 0" class="pb-4">
                    <h5>Documents</h5>
                    <div class="d-flex justify-content-evenly">
                        <div v-for="document in documents" :key="document.name" class="mx-2 my-2 overflow-auto">
                            <h6>{{ document.name }}</h6>
                            <div v-if="isImage(imageUrl(document.document_url))">
                                <a :href="imageUrl(document.document_url)" target="_blank">
                                    <img :src="imageUrl(document.document_url)" :alt="document.name" width="180" height="150" />
                                </a>
                            </div>
                            <div v-else>
                                <a :href="imageUrl(document.document_url)" target="_blank">
                                    <img src="../../assets/file-icon.svg" :alt="document.name" width="180" height="150" />
                                </a>
                            </div>

                            <!-- <h6 @click="downloadFile(imageUrl(document.document_url))" class="pointer">Download</h6> -->
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="modal-footer justify-content-center"></div>
    </div>
</template>

<script>
export default {
    props: {
        modalItem: {
            required: true,
        },
        documents: { required: false },
    },

    methods: {
        closeModal() {
            this.$emit("close");
        },
        imageUrl(url) {
            return `${process.env.VUE_APP_S3_URL}/${url}`;
        },
        isImage(url) {
            return /^https?:\/\/.+\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(url);
        },
        downloadFile(url) {
           // eslint-disable-next-line no-undef
            get(url).then((res) => {
                var FILE = window.URL.createObjectURL(new Blob([res.data]));
                var docUrl = document.createElement("x");
                docUrl.href = FILE;
                docUrl.setAttribute("download", "file.pdf");
                document.body.appendChild(docUrl);
                docUrl.click();
            });
        },
    },
    computed: {
        guarantors() {
            // eslint-disable-next-line vue/no-side-effects-in-computed-properties
            return this.modalItem.guarantors.sort((a, b) => {
                const da = new Date(a.created_at);
                const db = new Date(b.created_at);
                return db - da;
            });
        },
    },
};
</script>

<style lang="scss" scoped>
.scrol-modal {
    height: 70vh;
    overflow-y: auto;
}
</style>
