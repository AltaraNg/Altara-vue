<template>
  <div>
    <div class="modal-header">
      <h3 class="modal-title" id="exampleModalLongTitle">
        Verification Checklist
      </h3>
      <div slot="top-right">
        <span
          type="button"
          class="close text-danger h4 my-0 py-0 pointer"
          data-dismiss="modal"
          aria-label="Close"
          @click="$modal.hide('verificationView')"
        >
          <span aria-hidden="true" class="h5">&times;</span>
        </span>
      </div>
    </div>
    <div class="modal-body">
      <ol class="list-group">
        <li class="list-group-item my-3">
          <label for="checklist1" class=""
            >What location was visited and verified?</label
          >
          <p class="font-weight-bolder text-success">
            {{ verification.location }}
          </p>
        </li>
        <li class="list-group-item my-3">
          <label for="checklist">If other, Specify</label>
          <p class="font-weight-bolder text-success">
            {{ verification.otherOption || 'N/A' }}
          </p>
        </li>
        <li class="list-group-item my-3">
          <label for="exampleFormControlSelect2"
            >Does the Address match what was given in the application
            form</label
          >
          <p class="font-weight-bolder text-success">
            {{ verification.addressMatch }}
          </p>
        </li>

        <li class="list-group-item my-3">
          <label for="exampleFormControlSelect2"
            >Does the Address match what was given in the Bank Statement</label
          >
          <p class="font-weight-bolder text-success">
            {{ verification.addressMatchBank }}
          </p>
        </li>
        <li class="list-group-item">
          <label for="exampleFormControlTextarea1"
            >If no, what’s the reason? And who’s house is it? When did they move
            out from the address?</label
          >
          <p class="font-weight-bolder text-success">
            {{ verification.reasonForDiffer }}
          </p>
        </li>

        <li class="list-group-item my-3">
          <label for="exampleFormControlSelect2"
            >Is this customer aware of what happens when he/she defaults?</label
          >
          <p class="font-weight-bolder text-success">
            {{ verification.awareOfPenalty }}
          </p>
        </li>

        <li class="list-group-item my-3">
          <label for="exampleFormControlSelect2"
            >Was the customer double verified? i.e office/shop and home</label
          >
          <p class="font-weight-bolder text-success">
            {{ verification.locationDoubleChecked }}
          </p>
        </li>

        <li class="list-group-item my-3">
          <label for="exampleFormControlTextarea1"
            >What is the nature of the home/office/business location - how does
            it look? Is it obvious the customer lives there? Family pictures ?
            business name?</label
          >
          <p class="font-weight-bolder text-success">
            {{ verification.natureOfLocation }}
          </p>
        </li>

        <li class="list-group-item my-3">
          <label for="exampleFormControlTextarea1"
            >What was the feedback from the neighbour?</label
          >
          <p class="font-weight-bolder text-success">
            {{ verification.feedbackFromNeighbor }}
          </p>
        </li>

        <li class="list-group-item my-3">
          <label for="exampleFormControlTextarea1"
            >How long has the customer lived there, worked there or had their
            business there? Based on feedback from neighbour?</label
          >
          <p class="font-weight-bolder text-success">
            {{ verification.howLongInLocation }}
          </p>
        </li>

        <li class="list-group-item my-3">
          <label for="checklist">Date of verification</label>
          <p class="font-weight-bolder text-success">
            {{ verification.dateVerified }}
          </p>
        </li>

        <li class="list-group-item my-3">
          <label for="checklist">Verification was done by?</label>
          <p class="font-weight-bolder text-success">
            {{ verification.verifiedBy }}
          </p>
        </li>
      </ol>
    </div>
    <div class="modal-footer">
      <button
        type="button"
        class="btn btn-secondary"
        data-dismiss="modal"
        @click="$modal.hide('verificationView')"
      >
        Close
      </button>
    </div>
  </div>
</template>

<script>
import { get, post } from '../../utilities/api'
export default {
  props: {
    verification: {
      required: true,
      default: {},
    },
  },
  data() {
    return {}
  },

  methods: {},
  created() {},
}
</script>

<style lang="scss" scoped>
.modal-dialog {
  overflow-y: initial !important;
}
.modal-body {
  height: 80vh;
  overflow-y: auto;
}
</style>
