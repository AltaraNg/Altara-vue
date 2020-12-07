<template>
  <div class="searchBar-x">
    <div class="row form-group my-5 mx-5">
      <!-- <div class="col-md w-100">
        <label for="search" class="form-control-label">Search Input</label>
        <input
          type="text"
          class="form-control w-100"
          placeholder="Enter key word  ..."
          v-model="searchQuery.search"
        />
      </div> -->
      <div v-for="(stack, index) in stacks" :key="index" class="col-md">
        <label for="toDate" class="form-control-label">
          {{ stack.title }}
        </label>
        <input class="form-control w-100" type="text" v-model="stack.value" />
        <!-- end of checkboxes -->
      </div>
      <div class="col-md">
        <label for="branch" class="form-control-label">Branch</label>
        <select
          name="branch"
          id="branch"
          v-model="searchQuery.branch"
          class="text-capitalize font-weight-bold h5"
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
import { get, post, put } from "../utilities/api";
import queryParam from "../utilities/queryParam";

export default {
  components: {
    DatePicker,
  },
  data() {
    return {
      searchQuery: {},
      searchFilter: {},
      elements: [],
    };
  },
  props: {
    stacks: {},
  },
  computed: {
    selectedFilters: function () {
      let filters = [];
      let checkedFiters = this.stacks.filter((obj) => obj.value);
      checkedFiters.forEach((element) => {
        filters.push({
          [element.column]: element.value,
        });
      });
      return filters;
    },
    ...mapGetters(["getBranches"]),
  },

  methods: {
    addElement: function () {
      this.elements.push({
        value: "",
      });
    },
    searchEvent() {
      const data = Object.assign(...this.selectedFilters.map((v) => v));
      const defaultData = this.searchQuery;
      if (defaultData.branch === "all") {
        delete defaultData.branch;
      }
      const filterParam = queryParam({
        ...defaultData,
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

.searchBar-x {
  background-color: #fff;
  border-radius: 7px;
  padding: 1px;
}
</style>
