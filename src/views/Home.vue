<template>
  <div class="home">
  <!-- <select v-model="selectedCounty">
    <option v-for="(option, index) in countiesList" :value="Object.keys(option)[0]" :key="index">
      {{ Object.keys(option)[0] }}
    </option>
  </select> -->
  <dropdown 
    :data="countiesList" 
    :cbChanged="changed"
    :placeholder="'Select city'" 
    :width="200"></dropdown>  
  <!-- <stf-select v-model="selectedCounty" style="width: 300px; margin: 0 auto">
    <div slot="label">Select county</div>
    <div slot="value">
      <div v-if="selectedCounty">
          <span>{{selectedCounty.english}}</span>
      </div>
    </div>
    <section class="options delivery_order__options">
        <stf-select-option  
          v-for="(item, index) of countiesList" :key="index"
          :value="item"
          >
            <span>{{item.english}}</span>
        </stf-select-option>
    </section>
  </stf-select>   -->
  <!-- <span>Selected: {{ selectedCounty }}</span>     -->
    <div class="wrapper">
      <Chart :selectedCounty="selectedCounty" />
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import Vue from 'vue';
import Chart from "@/components/Chart.vue";
import Dropdown from "hsy-vue-dropdown";
// import {StfSelect, StfSelectOption} from "stf-vue-select";
// import "stf-vue-select/dist/lib/stf-vue-select.min.css";

Vue.use(Dropdown);

export default {
  name: "home",
  components: {
    // StfSelect,
    // StfSelectOption,
    Chart
  },
  data () {
    return {
      selectedCounty: "Total",
      countiesList: [
        {label: "Total", value: "中文"},
        {label: "New Taipei City", value: "中文"},
        {label: "Taipei City", value: "中文"},
        {label: "Taoyuan City", value: "中文"},
        {label: "Taichung City", value: "中文"},
        {label: "Tainan City", value: "中文"},
        {label: "Kaohsiung City", value: "中文"},
        {label: "Yilan County", value: "中文"},
        {label: "Hsinchu County", value: "中文"},
        {label: "Miaoli County", value: "中文"},
        {label: "Changhua County", value: "中文"},
        {label: "Nantou County", value: "中文"},
        {label: "Yunlin County", value: "中文"},
        {label: "Chiayi County", value: "中文"},
        {label: "Pingtung County", value: "中文"},
        {label: "Taitung County", value: "中文"},
        {label: "Hualien County", value: "中文"},
        {label: "Penghu County", value: "中文"},
        {label: "Keelung City", value: "中文"},
        {label: "Hsinchu City", value: "中文"},
        {label: "Chiayi City", value: "中文"},
        {label: "Kinmen County", value: "中文"},
        {label: "Lienchiang County", value: "中文"}
      ]      
    }
  },
  methods: {
    changed (item) {
      this.selectedCounty = item[0].label;
    }
  }
};
</script>

<style lang="scss">
  body {
    background: #222536;    
  }
  .wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
