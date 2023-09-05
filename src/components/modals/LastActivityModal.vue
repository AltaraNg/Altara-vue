<template>
  <div class="h-50">
    <div class="modal-header py-2">
      <h4>All Activities</h4>
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
    <div class="modal-body adjusted" v-if="modalItem.length > 0">
      <div class="">
        <p>
          Sales logged by: <b>{{ modalItem[0].attributes.owner }}</b>
        </p>
      </div>
      <div class="table-responsive">
        <table class="table table-bordered table-striped">
          <tbody>
            <tr>
              <th>S/N</th>
              <th>Creator</th>
              <th>feedback</th>
              <th>Status</th>
            </tr>
            <tr v-for="(item, index) in modalItem" :key="index">
              <td>{{ index + 1 }}</td>
              <td>{{ item.attributes.creator }}</td>
              <td>{{ item.attributes.feedback }}</td>
              <td>{{ item.attributes.renewal_prompter_status }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      modalItem: {
        required: true,
      },
    },

    methods: {
      closeModal() {
        this.$emit("close");
      },
    },
  };
</script>

<style lang="scss" scoped>
  .adjusted {
    height: 70vh;
    overflow-y: auto;
  }
</style>
