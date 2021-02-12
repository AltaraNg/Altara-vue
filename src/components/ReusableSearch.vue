<template>
  <div class="searchBar-x">
    <div class="row form-group my-5 mx-5">      
      <slot :searchQuery="searchQuery"></slot>
      <div class="col-md" v-if="showBranch === true">
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
      <div class="col-md" v-if="showDate === true">
        <label for="fromDate" class="form-control-label">From Date</label>

        <date-picker
          class="w-100"
          v-model="searchQuery.fromDate"
          valueType="format"
          placeholder="Date"
        ></date-picker>
      </div>
      <div class="col-md" v-if="showDate === true">
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
        <i class="fa fa-search" aria-hidden="true"></i>
      </button>
       <button
        class="btn btn-primary bg-default myBtn float-right my-2"
        @click="clearQuery"
      >
        <i class="fa fa-trash" aria-hidden="true"></i>
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
    showBranch: {
      type: Boolean,
      required: false,
      default: true
    },
     showDate: {
      type: Boolean,
      required: false,
      default: true
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
      if (this.url === '/api/new_order?renewalList=true'){
        this.searchQuery.renewalList = 'true';
        this.url = this.url.slice(0, 14);
      }
      this.$LIPS(true);
      if(this.searchQuery.branch === 'all'){
        this.searchQuery.branch = '';
      }
      get(this.url + queryParam(this.searchQuery)).then(response => {
        if(this.searchQuery.days !== undefined){
          this.$emit("childToParent", {
            data: response.data.data,
            days: this.searchQuery.days
          });
        }
        else{
          this.$emit("childToParent", response.data);        
        }
        
        
        }).catch(err => {
          Flash.setError('Unable to fetch');
        }).finally(() => {
          this.$LIPS(false);
        })
      
      
    },
    clearQuery(){
      this.searchQuery = {};
      this.searchEvent();
    }
  },
  created() {
    this.$prepareBranches();
  },
};
</script>

<style lang="scss" scoped>
.searchBar-x {
  background-color: #fff;
  border-radius: 7px;
  padding: 1px;
}
</style>
