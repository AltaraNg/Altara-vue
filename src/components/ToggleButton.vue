<template>
  <div class="col">
    <div class="toggle_container">
      <label :for="'toggle_button' + switchName" class="toggle__button mr-3">
        <input
          type="checkbox"
          :id="'toggle_button' + switchName"
          v-model="checkedValue"
          class="mr-5 toggle_check"
        />
        <span class="toggle__switch round"></span>
      </label>
      <span>{{ label ? label : "click" }}</span>
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
      type: String,
    },
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
.toggle_container{
  display: flex;
  align-items: center;
}
.toggle__button {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
}
.toggle__button input {
  opacity: 0;
  width: 0;
  height: 0;
}
.toggle__switch {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}
.toggle__switch:before {
  position: absolute;
  content: "";
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}
/* Rounded sliders */
.toggle__switch.round {
  border-radius: 34px;
}

.toggle__switch.round:before {
  border-radius: 50%;
}
.toggle_check:checked + .toggle__switch {
  background-color: green;
}

.toggle_check:focus + .toggle__switch {
  box-shadow: 0 0 1px green;
}

.toggle_check:checked + .toggle__switch:before {
  -webkit-transform: translateX(26px);
  -ms-transform: translateX(26px);
  transform: translateX(26px);
}
</style>