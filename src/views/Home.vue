<template>
  <div class="home">
  <!-- <select v-model="selectedCounty">
    <option v-for="(option, index) in countiesList" :value="Object.keys(option)[0]" :key="index">
      {{ Object.keys(option)[0] }}
    </option>
  </select> -->
  <div id="city-selector">
    <dropdown
      :data="countiesList" 
      :cbChanged="changed"
      :width="'auto'"
      :placeholder="'Select city'">
    </dropdown>
  </div>
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
        {label: "Total"},
        {label: "New Taipei City"},
        {label: "Taipei City"},
        {label: "Taoyuan City"},
        {label: "Taichung City"},
        {label: "Tainan City"},
        {label: "Kaohsiung City"},
        {label: "Yilan County"},
        {label: "Hsinchu County"},
        {label: "Miaoli County"},
        {label: "Changhua County"},
        {label: "Nantou County"},
        {label: "Yunlin County"},
        {label: "Chiayi County"},
        {label: "Pingtung County"},
        {label: "Taitung County"},
        {label: "Hualien County"},
        {label: "Penghu County"},
        {label: "Keelung City"},
        {label: "Hsinchu City"},
        {label: "Chiayi City"},
        {label: "Kinmen County"},
        {label: "Lienchiang County"}
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
#city-selector {
  width: 100%;
  padding: 50px 0;
  margin: 0 auto;
  max-width: 600px;
  .hsy-dropdown {
    width: 100%;
    .selected:not(.item) {
      border: none;
      font-weight: 200;
      border-bottom: 1px solid #fff;
      border-radius: 0;
      color: rgba(255, 255, 255, 0.7);
      font-size: 20px;
      height: 50px;
      line-height: 50px;
      padding: 0;
      width: 100%;
      &:hover {
        color: #fff;
      }
    }
    .list {
      width: 100%;
    }
    .item.selected {
      background: #989cb3;
      padding: 0 10px;
    }
  }
}
.wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
}

@media (max-width: 700px) {
  #city-selector {
    width: calc(100% - 30px);
    .hsy-dropdown {
      width: 100%;
      .selected:not(.item) {
        width: 100%;
      }
      .list {
        width: 100%;
      }
    }    
  } 
}
</style>
