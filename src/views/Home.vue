<template>
  <div id="home">
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
          <li><a href="#" @click.prevent="orderBy('country')" :class="{'is-active': filters.orderBy === 'country'}">Name</a></li>
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
          <li>
            <a href="#" @click.prevent="toggleRegions(true)" :class="{'is-active': filters.regions}">
              <span>Regions</span>
            </a>
          </li>
          <li>
            <a href="#" @click.prevent="toggleRegions(false)" :class="{'is-active': !filters.regions}">
              <span>Countries</span>
            </a>
          </li>
        </ul>
      </div>      
      <Chart :selectedCity="selectedCity" :filters="filters" />
    </div>
    <a href="https://github.com/Horsetoast/TW-Immigration-Chart" target="_blank" id="github-icon">
      <span class="icon icon-github-circled"></span>
      <span>Github</span>
    </a>
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
        female: true,
        regions: false
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
    toggleRegions () {
      this.filters.regions = !this.filters.regions;
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

#home {
  max-width: 800px;
  width: 100%;
  margin: 0 auto;
  padding: 0 20px;
  box-sizing: border-box;
}

#city-selector {
  width: 100%;
  padding: 50px 20px 10px;
  box-sizing: border-box;
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

#github-icon {
  position: fixed;
  bottom: 20px;
  right: 20px;
  display: inline-block;
  background: linear-gradient(to bottom, #f9fafb 0%,#e6edf1 100%);
  text-decoration: none;
  padding: 5px 10px 5px 7px;
  border-radius: 20px;
  font-size: 0.85em;
  font-weight: bold;
  &:hover {
    background: #e6edf1;
  }
  span.icon {
    margin-right: 3px;
  }
  span {
    color: #25292e;
  }
}

#chart-filters {
  color: #989cb3;
  max-width: 800px;
  width: 100%;
  margin: 0 auto 20px;
  padding: 20px;
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
      border: 1px solid lighten(#222536, 10%); 
      padding: 8px 14px;
      border-radius: 20px;
      .icon {
        margin-left: -4px;
      }
      &:hover {
        color: #fff;
        background: lighten(#222536, 14%);
        border: 1px solid lighten(#222536, 14%); 
      }
      &.is-active {
        color: #fff;
        background: lighten(#222536, 10%);
      }
      &.gender {
        &.male {
          color: #fff;
          background: #00a4ed;
          border: 1px solid #00a4ed;
          &:hover {
            background: darken(#00a4ed, 8%);
            border: 1px solid darken(#00a4ed, 8%);
          }
        }
        &.female {
          color: #fff;
          background: #e52669;
          border: 1px solid #e52669; 
          &:hover {
            background: darken(#e52669, 8%);
            border: 1px solid darken(#e52669, 8%);
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
  #github-icon {
    display: none;
  }
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
