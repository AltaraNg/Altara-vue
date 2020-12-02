<template>
  <div class="row form-group my-5 mx-5">
    <div class="col-md w-100">
      <label for="search" class="form-control-label">Search Input</label>
      <input
        type="text"
        class="form-control w-100"
        placeholder="Enter key word  ..."
        v-model="searchQuery.search"
        @input="searchEvent"
        @change="searchEvent"
      />
    </div>
    <div class="col-md">
      <label for="branch" class="form-control-label">Branch</label>
      <select
        name="branch"
        id="branch"
        @change="searchEvent"
        v-model="searchQuery.branch"
        class="text-capitalize font-weight-bold h5"
      >
        <option value="all" selected="selected">All</option>
        <option
          :value="branch.id"
          :key="getBranches[branch]"
          v-for="branch in getBranches"
          @change="searchEvent"
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
        @change="searchEvent"
      ></date-picker>
    </div>
    <div class="col-md">
      <label for="toDate" class="form-control-label">To Date</label>

      <date-picker
        class="w-100"
        v-model="searchQuery.toDate"
        valueType="format"
        placeholder="Date"
        @change="searchEvent"
      ></date-picker>
    </div>
    <div
      class="col-mdfloat-left d-flex justify-content-around align-items-center"
    >
      <!-- check boxes -->
      <div id="checkboxes">
        <span
          v-for="(stack, index) in stacks"
          :key="index"
          class="position-relative"
        >
          <input
            class="form-check-input"
            type="checkbox"
            v-model="stack.checked"
            v-on:change="searchEvent"
          />
          <label class="form-check-label">
            {{ stack.title }}
          </label>
        </span>
      </div>
      <!-- end of checkboxes -->
    </div>
  </div>
</template>

<script>
import DatePicker from "vue2-datepicker";
import { mapGetters } from "vuex";
import "vue2-datepicker/index.css";
import { get, post, put } from "../utilities/api";
import queryParam from "../utilities/queryParam";

export default {
  components: {
    DatePicker,
  },
  data() {
    return {
      searchQuery: {
        search: "",
        branch: "",
        fromDate: "",
        toDate: "",
      },
      searchFilter: {},
    };
  },
  props: {
    stacks: {},
  },
  computed: {
    selectedFilters: function () {
      let filters = [];
      let checkedFiters = this.stacks.filter((obj) => obj.checked);
      checkedFiters.forEach((element) => {
        filters.push({
          column: element.column,
          checked: this.searchQuery.search,
        });
      });
      return filters;
    },
    ...mapGetters(["getBranches"]),
  },

  methods: {
    searchEvent() {
      const data = Object.assign(
        ...this.selectedFilters.map((v) => ({ [v.column]: v.checked }))
      );
      const filterParam = queryParam({
        ...this.searchQuery,
        ...data,
      });
      this.$emit("childToParent", filterParam);
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
</style>
