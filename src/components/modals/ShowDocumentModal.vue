<template>
  <div>
    <div class="modal-header">
      <h3 class=" my-1" id="exampleModalLongTitle">
        {{ document.name }}
      </h3>
      <div slot="top-right">
        <span
          type="button"
          class="close text-danger h4 my-0 py-0 pointer"
          data-dismiss="modal"
          aria-label="Close"
          @click="$modal.hide('viewDocumentModal')"
        >
          <span aria-hidden="true" class="h5">&times;</span>
        </span>
      </div>
    </div>
    <div class="modal-body">
      <form @submit.prevent="save" enctype="multipart/form-data">
        <div>
          <div class="bg-default text-white">
            max-size: 512kb max-dimension: 1200 x 1200
          </div>
          <div class="upload-image p-2">
            <div class="upload-box">
                <img :src="imageUrl(document.document_url)" width="200" height="200"/>
            </div>
          </div>
        </div>
      </form>
    </div>
    <div class="modal-footer px-4">
      <button
        type="button"
        class="btn btn-danger rounded"
        data-dismiss="modal"
        @click="$modal.hide('viewDocumentModal')"
      >
        Close
      </button>
    </div>
  </div>
</template>

<script>
import ImageUpload from "../ImageUpload.vue"
export default {
  components: { ImageUpload },
  props: {
    document: {
      required: true,
      default: {},
    },
  },
  data() {
    return {}
  },

  methods: {
    imageUrl(url){
        return `${process.env.VUE_APP_S3_URL}/${url}`
    }
  },
  created() {},
}
</script>

<style lang="scss" scoped>
.modal-dialog {
  overflow-y: initial !important;
}
.modal-body {
  overflow-y: auto;
}
.display-text {
  color: black;
  font-size: 1.5em;
  font-weight: 500;
  text-transform: capitalize;
}
</style>
