<template>
  <div class="searchBar-x">
    <div class="row form-group my-5 mx-5">      
      <slot :searchQuery="searchQuery"></slot>
      <div class="col-md">
        <div>
        <label for="branch" class="form-control-label">Branch</label>
        </div>
        <select
          name="branch"
          id="branch"
          v-model="searchQuery.branch"
          class="custom-select"
        >
          <option value="all" selected="selected">All</option>
          <option
            :value="branch.id"
            :key="getBranches[branch]"
            v-for="branch in getBranches"
          >
            {{ branch.name }}
          </option>
        </select>
      </div>
      <div class="col-md">
        <label for="fromDate" class="form-control-label">From Date</label>

        <date-picker
          class="w-100"
          v-model="searchQuery.fromDate"
          valueType="format"
          placeholder="Date"
        ></date-picker>
      </div>
      <div class="col-md">
        <label for="toDate" class="form-control-label">To Date</label>

        <date-picker
          class="w-100"
          v-model="searchQuery.toDate"
          valueType="format"
          placeholder="Date"
        ></date-picker>
      </div>
      <!-- check boxes -->

      <button
        class="btn btn-primary bg-default myBtn float-right my-2"
        @click="searchEvent"
      >
        Search
      </button>
    </div>
  </div>
</template>

<script>
import DatePicker from "vue2-datepicker";
import { mapGetters } from "vuex";
import "vue2-datepicker/index.css";
import Flash from "../utilities/flash";
import { get, post, put } from "../utilities/api";
import queryParam from "../utilities/queryParam";

export default {
  components: {
    DatePicker,
  },
  data() {
    return {
      searchQuery: {        
      },
      searchFilter: {},
      elements: [],
    };
  },
  props: {
    url: {
      type: String,
      required: true
    },
  },
  computed: {   
    ...mapGetters(["getBranches"]),
  },

  methods: {
    addElement: function () {
      this.elements.push({
        value: "",
      });
    },
    searchEvent() {
      this.$LIPS(true);
      get(this.url + queryParam(this.searchQuery)).then(response => {
        this.$emit("childToParent", response.data);
        this.searchQuery = {};
        }).catch(err => {
          Flash.setError('Unable to fetch');
        })
      
      
    },
  },
  created() {
    this.$prepareBranches();
  },
};
</script>

<style lang="scss" scoped>
select {
  width: 187px;
  height: 34px;
}

.searchBar-x {
  background-color: #fff;
  border-radius: 7px;
  padding: 1px;
}
</style>
