<template>
  <div>
    <div class="searchBar">
      <div class="row">
        <div class="col-md-6">
          <input
            type="text"
            class="form-control"
            v-model="searchQ"
            @input="searchEvent"
            @change="searchEvent"
          />
        </div>

        <div
          class="col-md-6 float-left d-flex justify-content-around align-items-center"
        >
          <span
            class="position-relative radio"
            :key="searchColumns[object]"
            v-for="object in searchColumns"
          >
            <input
              checked
              :value="object.column"
              @change="searchEvent"
              name="choice"
              :id="object.column"
              type="radio"
              v-model="searchFilter"
            />
            <label :for="object.column">{{ object.title | capitalize }}</label>
          </span>
        </div>
        <div class="col-md-2">
          <label for="bank" class="form-control-label">Branch</label>
          <select
            class="custom-select w-100"
            v-model="branch"
            v-validate="'required'"
            @change="searchEvent"
          >
            <option disabled selected="selected">Branch</option>
            <option :value="type.id" :key="type.id" v-for="type in getBranches">
              {{ type.name }}
            </option>
          </select>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import queryParam from "../utilities/queryParam";
  import { mapGetters } from "vuex";

  export default {
    name: "InventorySearch",
    props: {
      searchColumns: {},
    },
    data() {
      return {
        searchQ: "",
        searchFilter: {},
        branch: null,
      };
    },

    methods: {
      searchEvent() {
        let filters = {};

        filters[this.searchFilter] = this.searchQ;
        const filterParam = queryParam({
          ...filters,
          branch: this.branch === null ? "" : this.branch,
        });
        this.$emit("childToParent", filterParam);
      },
    },
    computed: {
      ...mapGetters(["getBranches"]),
    },
  };
</script>

<style scoped>
  .searchBar {
    background-color: #fff;
    border-radius: 7px;
    padding: 20px;
  }
</style>
