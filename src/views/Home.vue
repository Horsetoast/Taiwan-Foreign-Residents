<template>
  <div class="home">
    <div id="city-selector">
      <span>Select city</span>
      <dropdown
        :data="countiesList" 
        :cbChanged="changed"
        :placeholder="'Select city'">
      </dropdown>
    </div>
    <div class="wrapper">
      <div id="chart-filters">
        <ul>
          <li><span>Sort by</span></li>
          <li><a href="#" @click.prevent="orderBy('country')" :class="{'is-active': filters.orderBy === 'country'}">Country name</a></li>
          <li>
            <a href="#" @click.prevent="orderBy('highest')" :class="{'is-active': filters.orderBy === 'highest'}">
              <span class="icon icon-up-dir"></span>
              <span>Highest</span>
            </a>
          </li>
          <li>
            <a href="#" @click.prevent="orderBy('lowest')" :class="{'is-active': filters.orderBy === 'lowest'}">
              <span class="icon icon-down-dir"></span>
              <span>Lowest</span>
            </a>
          </li>
        </ul>
        <ul>
          <li><span>Show</span></li>
          <li>
            <a href="#" class="gender male" @click.prevent="toggleGender('male')" :class="{'is-active': filters.male}">
              <span class="icon icon-male"></span>
              <span>Male</span>
            </a>
          </li>
          <li>
            <a href="#" class="gender female" @click.prevent="toggleGender('female')" :class="{'is-active': filters.female}">
              <span class="icon icon-female"></span>
              <span>Female</span>
            </a>
          </li>
        </ul>
      </div>      
      <Chart :selectedCity="selectedCity" :filters="filters" />
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
      selectedCity: "Total",
      filters: {
        orderBy: "country",
        male: true,
        female: true
      },
      countiesList: [
        {label: "Total", selected: true},
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
      this.selectedCity = item[0].label;
    },
    orderBy (type) {
      this.filters.orderBy = type;
    },
    toggleGender (gender) {
      if(this.filters.male && this.filters.female || this.filters[gender] === false) {
        this.filters[gender] = !this.filters[gender];
      }
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
  padding: 50px 0 10px;
  margin: 0 auto;
  max-width: 800px;
  & > span {
    font-size: 0.85em;
    color:#989cb3;
  }
  .hsy-dropdown {
    width: 100% !important;
    .selected:not(.item) {
      border: none;
      font-weight: 200;
      border-bottom: 1px solid #989cb3;
      border-radius: 0;
      color: #fff;
      font-size: 20px;
      height: 50px;
      line-height: 50px;
      padding: 0;
      width: 100% !important;
      background-position: center right !important;
      transition: all 0.3s;
      &:hover {
        border-bottom: 1px solid #fff;
      }
    }
    .list {
      width: 100% !important;
    }
    .item.selected {
      background: #989cb3;
      padding: 0 10px;
    }
  }
}

#chart-filters {
  color: #989cb3;
  max-width: 800px;
  width: calc(100% - 40px);
  margin: 0 auto 40px;
  border-bottom: 1px solid lighten(#222536, 10%);
  padding: 20px 0;
  box-sizing: border-box;
  font-size: 0.85em;
  ul {
    display: block;
    width: 100%;
    list-style: none;
    padding: 0;
    margin: 0 auto 15px;
    li {
      display: inline-block;
    }
    a {
      margin-left: 15px;
      display: inline-block;
      text-decoration: none;
      color: #989cb3;
      background: lighten(#222536, 10%);
      padding: 8px 14px;
      border-radius: 20px;
      .icon {
        margin-left: -4px;
      }
      &:hover {
        color: #fff;
        background: lighten(#222536, 14%);
      }
      &.is-active {
        color: #fff;
      }
      &.gender {
        &.male {
          color: #fff;
          background: #00a4ed;
          &:hover {
            background: darken(#00a4ed, 8%);
          }
        }
        &.female {
          color: #fff;
          background: #e52669;
          &:hover {
            background: darken(#e52669, 8%);
          }          
        }
        &:not(.is-active) {
          opacity: 0.3;
        }
      }
    }
  }
}

.wrapper {
  text-align: center;
}

@media (max-width: 700px) {
  #city-selector {
    padding-top: 15px;
    width: calc(100% - 30px);  
  }
  #chart-filters {
    padding: 20px;
    ul {
      li {
        a {
          margin: 8px 5px;
        }
        &:first-child {
          display: block;
          margin-bottom: 10px;
        }
      }
    }
  }
}
</style>
