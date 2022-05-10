<template>
  <div class="col">
    <div>
      <label :for="'toggle_button'+switchName">
        <input type="checkbox" :id="'toggle_button'+switchName" v-model="checkedValue" class="mr-3" />
         <span>{{label ? label :'click'}}</span>
        <span class="toggle__switch"></span>
      </label>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    defaultState: {
      type: Boolean,
      default: false,
    },
    switchName: {
      type: String,
    },
    label: {
      type: String
    }
  },

  data() {
    return {
      currentState: this.defaultState,
    };
  },

  computed: {
    isActive() {
      return this.currentState;
    },

    checkedValue: {
      get() {
        return this.defaultState;
      },
      set(newValue) {
        this.currentState = newValue;
        this.$emit("valueChangedEvent", newValue, this.switchName);
      },
    },
  },
  methods: {
    emitPlease() {
      this.$emit("valueChangedEvent", this.checked, this.switchName);
    },
  },
};
</script>

<style scoped>
.toggle__button {
   cursor: pointer;
  text-indent: -9999px;
  width: 50px;
  height: 25px;
  background: grey;
  display: block;
  border-radius: 10px;
  position: relative;
}
.toggle__button input[type="checkbox"] {
  opacity: 0;
  position: absolute;
  width: 1px;
  height: 1px;
}
.toggle__button .toggle__switch {
  display: inline-block;
  height: 12px;
  border-radius: 6px;
  width: 40px;
  background: #bfcbd9;
  box-shadow: inset 0 0 1px #bfcbd9;
  position: relative;
  margin-left: 10px;
  transition: all 0.25s;
}

.toggle__button .toggle__switch::after,
.toggle__button .toggle__switch::before {
  content: "";
  position: absolute;
  display: block;
  height: 18px;
  width: 18px;
  border-radius: 50%;
  left: 0;
  top: -3px;
  transform: translateX(0);
  transition: all 0.25s cubic-bezier(0.5, -0.6, 0.5, 1.6);
}

.toggle__button .toggle__switch::after {
  background: #4d4d4d;
  box-shadow: 0 0 1px #666;
}
.toggle__button .toggle__switch::before {
  background: #4d4d4d;
  box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.1);
  opacity: 0;
}
</style>