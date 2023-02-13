<template>
  <div>
    <div class="modal-header">
      <h3 class="modal-title" id="exampleModalLongTitle">
        Verification Checklist
      </h3>
      <button
        type="button"
        class="close"
        data-dismiss="modal"
        aria-label="Close"
      >
        <span aria-hidden="true" class="h5">&times;</span>
      </button>
    </div>
    <div class="modal-body">
      <form>
        <div class="form-group my-3">
          <label for="checklist1" class=""
            >What location was visited and verified?</label
          ><br />
          <div
            class="form-check form-check-radio form-check-inline"
            v-for="option in verifiedOptions"
          >
            <label class="form-check-label">
              <input
                type="radio"
                class="form-check-input "
                :value="option"
                name="checklist1"
              />
              <span class="px-2">{{ option }}</span>
              <span class="form-check-sign"> </span>
            </label>
          </div>
        </div>
        <div class="form-group my-3">
          <label for="checklist">If other, Specify</label>
         <input type="text" class="form-control " />
        </div>
        <div class="form-group my-3">
          <label for="exampleFormControlSelect2">Does the Address match what was given in the application form</label>
          <br />

          <div
            class="form-check form-check-radio form-check-inline"
          >
            <label class="form-check-label">
              <input
                type="radio"
                class="form-check-input "
                value="yes"
                name="checklist2"
              />
              <span class="px-2">Yes</span>
              <span class="form-check-sign"> </span>
            </label>
          </div>
          <div
            class="form-check form-check-radio form-check-inline"
          >
            <label class="form-check-label">
              <input
                type="radio"
                class="form-check-input "
                value="yes"
                name="checklist2"
              />
              <span class="px-2">No</span>
              <span class="form-check-sign"> </span>
            </label>
          </div>
        </div>


        <div class="form-group my-3">
          <label for="exampleFormControlSelect2">Does the Address match what was given in the Bank Statement</label>
          <br />

          <div
            class="form-check form-check-radio form-check-inline"
          >
            <label class="form-check-label">
              <input
                type="radio"
                class="form-check-input "
                value="yes"
                name="checklist2"
              />
              <span class="px-2">Yes</span>
              <span class="form-check-sign"> </span>
            </label>
          </div>
          <div
            class="form-check form-check-radio form-check-inline"
          >
            <label class="form-check-label">
              <input
                type="radio"
                class="form-check-input "
                value="yes"
                name="checklist2"
              />
              <span class="px-2">No</span>
              <span class="form-check-sign"> </span>
            </label>
          </div>
        </div>
        <div class="form-group">
          <label for="exampleFormControlTextarea1">If no, what’s the reason? And who’s house is it? When did they move out from the address?</label>
          <textarea
            class="form-control"
            id="exampleFormControlTextarea1"
            rows="3"
          ></textarea>
        </div>

        <div class="form-group my-3">
          <label for="exampleFormControlSelect2">Is this customer aware of what happens when he/she defaults?</label>
          <br />

          <div
            class="form-check form-check-radio form-check-inline"
          >
            <label class="form-check-label">
              <input
                type="radio"
                class="form-check-input "
                value="yes"
                name="checklist2"
              />
              <span class="px-2">Yes</span>
              <span class="form-check-sign"> </span>
            </label>
          </div>
          <div
            class="form-check form-check-radio form-check-inline"
          >
            <label class="form-check-label">
              <input
                type="radio"
                class="form-check-input "
                value="yes"
                name="checklist2"
              />
              <span class="px-2">No</span>
              <span class="form-check-sign"> </span>
            </label>
          </div>
        </div>

        <div class="form-group my-3">
          <label for="exampleFormControlSelect2">Was the customer double verified? i.e office/shop and home</label>
          <br />

          <div
            class="form-check form-check-radio form-check-inline"
          >
            <label class="form-check-label">
              <input
                type="radio"
                class="form-check-input "
                value="yes"
                name="checklist2"
              />
              <span class="px-2">Yes</span>
              <span class="form-check-sign"> </span>
            </label>
          </div>
          <div
            class="form-check form-check-radio form-check-inline"
          >
            <label class="form-check-label">
              <input
                type="radio"
                class="form-check-input "
                value="yes"
                name="checklist2"
              />
              <span class="px-2">No</span>
              <span class="form-check-sign"> </span>
            </label>
          </div>
        </div>

        <div class="form-group">
          <label for="exampleFormControlTextarea1">What was the feedback from the neighbour?</label>
          <textarea
            class="form-control"
            id="exampleFormControlTextarea1"
            rows="3"
          ></textarea>
        </div>
      </form>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-secondary" data-dismiss="modal">
        Close
      </button>
      <button type="button" class="btn btn-primary">Save changes</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      verifiedOptions: ['Home', 'Business', 'Office', 'Other'],
    }
  },
}
</script>

<style lang="scss" scoped></style>
