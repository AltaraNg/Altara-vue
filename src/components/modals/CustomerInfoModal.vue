<template>
  <div>
    <div class="modal-header py-2">
      <h4>Customer Details</h4>
      <a
        aria-label="Close"
        class="close py-1"
        data-dismiss="modal"
        @click="closeModal"
      >
        <span aria-hidden="true" class="modal-close text-danger">
          <i class="fas fa-times"></i>
        </span>
      </a>
    </div>
    <div class="modal-body px-5">
      <div class="table-responsive">
        <table class="table table-bordered table-striped">
          <tbody>
            <tr>
              <th>Customer Name</th>
              <td>
                {{
                  `${modalItem.first_name} ${modalItem.last_name}` ||
                    "Not Available"
                }}
              </td>
            </tr>
            <tr>
              <th>Customer Number</th>
              <td>{{ modalItem.telephone }}</td>
            </tr>

            <tr>
              <th>Date Registered</th>
              <td>{{ modalItem.date_of_registration }}</td>
            </tr>

            <tr>
              <th>Occupation</th>
              <td>{{ modalItem.occupation || "N/A" }}</td>
            </tr>
            <tr>
              <th>Address</th>
              <td>{{ `${modalItem.add_street}, ${modalItem.city}` }}</td>
            </tr>
            <tr v-if="modalItem.guarantors && modalItem.guarantors.length > 0">
              <th>Guarantor_1 Name</th>
              <td>
                {{
                  `${modalItem.guarantors[0].first_name} ${modalItem.guarantors[0].last_name}`
                }}
              </td>
            </tr>
            <tr v-if="modalItem.guarantors && modalItem.guarantors.length > 0">
              <th>Guarantor_1 Phone</th>
              <td>{{ `${modalItem.guarantors[0].phone_number}` }}</td>
            </tr>

            <tr v-if="modalItem.guarantors && modalItem.guarantors[1]">
              <th>Guarantor_2 Name</th>
              <td>
                {{
                  `${modalItem.guarantors[1].first_name} ${modalItem.guarantors[1].last_name}`
                }}
              </td>
            </tr>
            <tr v-if="modalItem.guarantors && modalItem.guarantors[1]">
              <th>Guarantor_2 Phone</th>
              <td>{{ `${modalItem.guarantors[1].phone_number}` }}</td>
            </tr>
          </tbody>
        </table>
        <div v-if="documents.length > 0" class="mt-2">
          <h5>Documents</h5>
          <div class="d-flex">
            <div v-for="document in documents" class="mx-2 my-2 overflow-auto">
              <h6>{{ document.name }}</h6>
              <div v-if="isImage(imageUrl(document.document_url))">
                <a :href="imageUrl(document.document_url)" target="_blank">
                  <img
                    :src="imageUrl(document.document_url)"
                    :alt="document.name"
                    width="100"
                    height="120"
                  />
                </a>
              </div>
              <div v-else>
                <a :href="imageUrl(document.document_url)" target="_blank">
                  <img
                    src="../../assets/file-icon.svg"
                    :alt="document.name"
                    width="100"
                    height="120"
                  />
                </a>
              </div>

              <h6 @click="downloadFile(imageUrl(document.document_url))" class="pointer">Download</h6>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-footer justify-content-center"></div>
  </div>
</template>

<script>
import { get } from "../../utilities/api"

export default {
  props: {
    modalItem: {
      required: true,
    },
    documents: { required: false },
  },

  methods: {
    closeModal() {
      this.$emit("close")
    },
    imageUrl(url) {
      return `${process.env.VUE_APP_S3_URL}/${url}`
    },
    isImage(url) {
      return /^https?:\/\/.+\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(url)
    },
    downloadFile(url) {
      get(url).then(res => {
        var FILE = window.URL.createObjectURL(new Blob([res.data]))
        var docUrl = document.createElement("x")
        docUrl.href = FILE
        docUrl.setAttribute("download", "file.pdf")
        document.body.appendChild(docUrl)
        docUrl.click()
      })
    },
  },
}
</script>

<style lang="scss" scoped></style>
