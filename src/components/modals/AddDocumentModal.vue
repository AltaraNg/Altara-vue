<template>
  <div>
    <div class="modal-header">
      <h3 class=" my-1" id="exampleModalLongTitle">
        Upload Document
      </h3>
      <div slot="top-right">
        <span
          type="button"
          class="close text-danger h4 my-0 py-0 pointer"
          data-dismiss="modal"
          aria-label="Close"
          @click="$modal.hide('addDocumentModal')"
        >
          <span aria-hidden="true" class="h5">&times;</span>
        </span>
      </div>
    </div>
    <div class="modal-body mx-4">
      <form>
        <div class="form-group my-3 w-50">
          <label>Document Name</label>
          <input type="text" class="custom-select d-block w-100" v-model="fileName" />
        </div>

        <div>
          <label class="">
            <input type="file" ref="file" @change="fileUpload" />
          </label>
          <div v-if="imgSrc !== null">
            <img :src="imgSrc" alt="uploaded" width="200" height="200" />
          </div>
        </div>

        <div class="float-right">
          <button
            type="button"
            class="btn px-5 rounded bg-danger mx-3 my-5"
            data-dismiss="modal"
            @click="$modal.hide('verificationForm')"
          >
            Close
          </button>
          <button type="button" class="btn px-4 bg-default my-5" @click="save">
            Upload Image
          </button>
        </div>
      </form>
    </div>
   
  </div>
</template>

<script>
import { get, post } from "../../utilities/api"
import { EventBus } from "../../utilities/event-bus"
import { toMulipartedForm } from "../../utilities/form"

export default {
  props: {
    customer: {
      required: true,
      default: {},
    },
  },
  data() {
    return {
      verifiedOptions: ["Home", "Business", "Office", "Other"],
      fileName: null,
      verificationData: {},
      file: null,
      imgSrc: null,
    }
  },

  methods: {
    async save() {
      this.$validator.validateAll().then(async result => {
        if (result) {
          try {
            this.$LIPS(true)
            this.verificationData = {
                customer_id: this.customer.id,
                document: this.file,
                name: this.fileName
            }
            let form = toMulipartedForm(this.verificationData);

            let res = await post("/api/new_document", form)
            if (res.status === 200) {
              this.$swal({
                icon: "success",
                title: `Uploaded successfully`,
              })
              this.verificationData = {}

              this.$modal.hide("addDocumentModal")
            }
          } catch (err) {
            this.$swal({
              icon: "error",
              title: `Unable to complete`,
            })
          } finally {
            this.$LIPS(false)
          }
        }
      })
    },

    fileUpload() {
      this.file = this.$refs.file.files[0]
      this.imgSrc = URL.createObjectURL(this.file)
    },
  },
}
</script>

<style lang="scss" scoped>
.modal-dialog {
  overflow-y: initial !important;
}
.modal-body {
//   height: 75vh;
  overflow-y: auto;
}
</style>
