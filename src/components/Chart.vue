<template>
  <div class="chart">
    <svg v-if="svgReady" :height="canvasHeight">
      <!-- COUNTRIES LIST -->
      <transition-group v-if="!filters.regions" tag="g" name="list">
        <g v-for="(row, index) in chartData" :key="row.country" class="list-row">
          <image 
            class="flag-icon" 
            :x="0"
            :y="index * 50" 
            :xlink:href="`flag-icons/svg/${getCountry(row.country).code}.svg`" />       
          <text
            class="row-text has-flag"
            :y="index * 50 + 15"
            :x="0">
            <tspan>{{ getCountry(row.country).alias }}</tspan>
            <tspan dx="10" class="tspan male" :class="{'is-hidden': !filters.male}">{{ row.male }}</tspan>
            <tspan dx="10" class="tspan female" :class="{'is-hidden': !filters.female}">{{ row.female }}</tspan>
          </text>
          <text
            class="row-code has-flag"
            :y="index * 50 + 15"
            :x="0">
            {{ getCountry(row.country).code }}
          </text>
          <rect 
            class="row-bar male" 
            :key="'male-' + index" 
            :y="50 * index" 
            :x="0"
            :width="row.maleWidth" 
            :height="20">
          </rect>
          <rect 
            class="row-bar female" 
            :key="'female-' + index" 
            :y="50 * index" 
            :x="row.maleWidth"
            :width="row.femaleWidth" 
            :height="20">
          </rect>
        </g>
			</transition-group>
      <!-- -->
      <!-- REGIONS LIST -->   
      <transition-group v-else-if="filters.regions" tag="g" name="list">
        <g v-for="(row, index) in chartData" :key="row.region" class="list-row">
          <text
            class="row-text"
            :y="index * 50 + 15"
            :x="0">
            <tspan>{{ row.region }}</tspan>
            <tspan dx="10" class="tspan male">{{ row.male }}</tspan>
            <tspan dx="10" class="tspan female">{{ row.female }}</tspan>
          </text>
          <text
            class="row-code"
            :y="index * 50 + 15"
            :x="0">
            <tspan>{{ row.region }}</tspan>
          </text>
          <rect 
            class="row-bar male" 
            :key="'male-' + index" 
            :y="50 * index" 
            :x="0"
            :width="row.maleWidth" 
            :height="20">
          </rect>
          <rect 
            class="row-bar female" 
            :key="'female-' + index" 
            :y="50 * index" 
            :x="row.maleWidth"
            :width="row.femaleWidth" 
            :height="20">
          </rect>
        </g>
			</transition-group>
      <!-- -->    
    </svg>
  </div>
</template>

<script>
import * as d3 from "d3";
import TWEEN from "@tweenjs/tween.js";
import countryAliases from "../assets/countryAliases.js";
// console.log(taiwanCountries);

// const widthScale = d3.scaleSqrt()
//     .domain([2, d3.max(this.data, function(d) { return d.cities["Total"].m; })])
//     .range([0, 200])

// const scaleLog = d3.scaleLog()
//     .domain([2, d3.max(this.data, function(d) { return d.cities["Total"].m; })])
//     .range([0, 200])
//     .base(2)

export default {
  name: "Chart",
  props: {
    selectedCity: {
      type: String,
      default: "Total"
    },
    filters: {
      type: Object,
      default: () => {
        return {
          orderBy: "country",
          male: true,
          female: true
        };
      }
    }
  },
  data() {
    return {
      canvasHeight: null,
      jsonData: null,
      chartData: [],
      countryAliases,
      showingRegions: false
    };
  },
  computed: {
    svgReady() {
      // Draw chart when we have all required data and params
      return this.canvasHeight;
    }
  },
  watch: {
    jsonData () {
      if(!this.jsonData) return;
      this.generateChart();
    },
    selectedCity(newCity, oldCity) {
      if (newCity === oldCity) return;
      this.generateChart();
    },
    chartData() {
      this.$nextTick(() => {
        this.animateChart();
      });
    },
    filters: {
      handler: function(newFilters) {
        if (newFilters.regions === this.showingRegions) {
          this.chartData = this.sortChart(this.chartData);
        } else {
          this.generateChart();
        }
        this.showingRegions = newFilters.regions;
      },
      deep: true
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      d3.json("populationData.json", json => {
        // Remove first item which is "All foreigners"
        // otherwise it ruins the chart proportions
        json.shift();
        this.jsonData = json;
      });

      // Setup the animation loop.
      function animate(time) {
        requestAnimationFrame(animate);
        TWEEN.update(time);
      }
      requestAnimationFrame(animate);
    },
    generateChart() {
      if (this.filters.regions) {
        this.generateChartRegions();
      } else {
        this.generateChartCountries();
      }
    },
    generateChartRegions() {
      const chartEl = document.getElementsByClassName("chart")[0];
      // Arbitrary bar width for mobile
      const barWidth = chartEl.offsetWidth / 4;

      let newData = [];
      this.jsonData.forEach((data, index) => {
        if (this.getCountry(data.country)) {
          const city = data.cities[this.selectedCity];
          const countryRegion = this.getCountry(data.country).region;
          const entry = newData.find(entry => entry.region === countryRegion);
          if (entry) {
            entry.male += city.m;
            entry.female += city.f;
          } else {
            const entry = {
              region: countryRegion,
              maleWidth: 0,
              femaleWidth: 0,
              male: city.m,
              female: city.f
            };
            newData.push(entry);
          }
        }
      });

      const scaleSqrt = d3
        .scaleSqrt()
        .domain([
          2,
          d3.max(newData, d => {
            return d.male + d.female;
          })
        ])
        .range([0, barWidth]);

      newData = newData.reduce((arr, entry) => {
        // Previous data for animated transitions
        const prevEntry = this.chartData.find(c => c.region === entry.region);
        const prevMaleWidth = prevEntry ? prevEntry.maleWidth : 0;
        const prevFemaleWidth = prevEntry ? prevEntry.maleWidth : 0;
        
        entry.maleWidth = this.filters.male ? prevMaleWidth : 0;
        entry.femaleWidth = this.filters.female ? prevFemaleWidth : 0;
        entry.maleScaled = entry.m < 2 ? 1 : scaleSqrt(entry.male);
        entry.femaleScaled = entry.f < 2 ? 1: scaleSqrt(entry.female);
        arr.push(entry);
        return arr;
      }, []);

      this.canvasHeight = newData.length * 50;
      this.chartData = this.sortChart(newData);
    },
    generateChartCountries() {
      const chartEl = document.getElementsByClassName("chart")[0];
      // Arbitrary bar width for mobile
      const barWidth = chartEl.offsetWidth / 4;
      const scaleSqrt = d3
        .scaleSqrt()
        .domain([
          2,
          d3.max(this.jsonData, d => {
            return (
              d.cities[this.selectedCity].m + d.cities[this.selectedCity].f
            );
          })
        ])
        .range([0, barWidth]);

      const newData = [];
      this.jsonData.forEach((data, index) => {
        const city = data.cities[this.selectedCity];
        const prevEntry = this.chartData.find(c => c.country === data.country);
        // Previous data for animated transitions
        const prevMaleWidth = prevEntry ? prevEntry.maleWidth : 0;
        const prevFemaleWidth = prevEntry ? prevEntry.maleWidth : 0;
        // Higher than 1 otherwise log returns negative width
        const entry = {
          country: data.country,
          maleWidth: this.filters.male ? prevMaleWidth : 0,
          femaleWidth: this.filters.female ? prevFemaleWidth : 0,
          maleScaled: city.m < 2 ? 1 : scaleSqrt(city.m),
          femaleScaled: city.f < 2 ? 1 : scaleSqrt(city.f),
          male: city.m,
          female: city.f
        };
        newData.push(entry);
      });
      this.canvasHeight = newData.length * 50;
      this.chartData = this.sortChart(newData);
    },
    sortChart(data) {
      const orderBy = this.filters.orderBy;
      if (orderBy === "country") {
        return data.sort((a, b) => {
          if (a.country < b.country) {
            return -1;
          } else if (a.country > b.country) {
            return 1;
          } else {
            return 0;
          }
        });
      } else {
        return data.sort((a, b) => {
          const countM = this.filters.male;
          const countF = this.filters.female;
          const aSum =
            (countM ? a.male : 0) + (countF ? a.female : 0);
          const bSum =
            (countM ? b.male : 0) + (countF ? b.female : 0);
          if (aSum < bSum) {
            return orderBy === "highest" ? 1 : -1;
          } else if (aSum > bSum) {
            return orderBy === "highest" ? -1 : 1;
          } else {
            return 0;
          }
        });
      }
    },
    getCountry (name) {
      if (countryAliases[name]) {
        return countryAliases[name];
      } else {
        return {
          alias: name
        };
      }
    },
    animateChart() {
      this.chartData.forEach(entry => {
        const tween = new TWEEN.Tween(entry) // Create a new tween that modifies 'coords'.
          .to(
            {
              maleWidth: this.filters.male ? entry.maleScaled : 0,
              femaleWidth: this.filters.female ? entry.femaleScaled : 0
            },
            1000
          )
          .easing(TWEEN.Easing.Quadratic.Out)
          .start();
      });
    }
  }
};
</script>

<style scoped lang="scss">
.chart {
  width: 100%;
  box-sizing: border-box;
  padding: 0 20px;
  margin: 0 auto;
  position: relative;
  svg {
    position: relative;
    width: 100%;
  }
  .row-text,
  .row-code {
    fill: #fff;
  }
  .tspan {
    &.male {
      fill: #00a4ed;
    }
    &.female {
      fill: #e52669;
    }
  }
  .row-bar {
    &.male {
      fill: #00a4ed;
    }
    &.female {
      fill: #e52669;
    }
  }
  .list-row {
    transition: all 0.5s;
    display: inline-block;
    margin-right: 10px;
  }
  .list-enter,
  .list-leave-to {
    opacity: 0;
    transform: translateY(30px);
  }
  .list-leave-active {
    position: absolute;
  }
  .is-hidden {
    display: none;
  }
}

@media (max-width: 700px) {
  .chart {
    .row-bar {
      display: none;
    }
    .row-code {
      display: none;
    }
    .has-flag {
      transform: translateX(40px);
    }
  }
}

@media (min-width: 700px) {
  .chart {
    .row-code {
      display: none;
    }
    .row-bar {
      transform: translateX(300px);
    }
    .has-flag {
      transform: translateX(40px);
    }
  }
}
</style>
