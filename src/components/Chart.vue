<template>
  <div class="chart">
    <svg v-if="svgReady" :width="settings.width" :height="settings.height">
      <transition-group tag="g" name="list">
        <g v-for="(row, index) in chartData" :key="row.country" class="list-row">
          <image :x="0" :y="index * 50" :xlink:href="`flag-icons/svg/${countryAliases[row.country].code}.svg`" />       
          <text
            class="pop-text"
            :y="index * 50 + 15"
            :x="40">
            {{ countryAliases[row.country].alias }}
          </text>
          <rect 
            class="pop-bar male" 
            :key="'male-' + index" 
            :y="50 * index" 
            :x="200"
            :width="row.maleWidth" 
            :height="20">
          </rect>
          <rect 
            class="pop-bar female" 
            :key="'female-' + index" 
            :y="50 * index" 
            :x="row.maleWidth + 200"
            :width="row.femaleWidth" 
            :height="20">
          </rect>
        </g>
			</transition-group>      
    </svg>
  </div>
</template>

<script>
import * as d3 from "d3";
import TWEEN from "@tweenjs/tween.js";
import countryAliases from "../assets/countryAliases.js";
// console.log(taiwanCountries);

// const widthScale = d3.scaleSqrt()
//     .domain([2, d3.max(this.data, function(d) { return d.counties["Total"].m; })])
//     .range([0, 200])

// const scaleLog = d3.scaleLog()
//     .domain([2, d3.max(this.data, function(d) { return d.counties["Total"].m; })])
//     .range([0, 200])
//     .base(2)

export default {
  name: "Chart",
  props: {
    selectedCounty: {
      type: String,
      default: "Total"
    }
  },
  data() {
    return {
      settings: {
        width: null,
        height: null
      },
      jsonData: null,
      chartData: [],
      countryAliases
    };
  },
  computed: {
    svgReady () {
      return this.settings.width && this.settings.height;
    }
  },
  watch: {
    jsonData() {
      if (!this.jsonData) return;
      this.generateChart();
    },
    selectedCounty(newCountry, oldCountry) {
      if (newCountry === oldCountry) return;
      this.generateChart();
    },
    chartData() {
      this.$nextTick(() => {
        this.animateChart();
      });
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
      const app = document.getElementById('app');
      const barWidth = app.offsetWidth < 400 ? 50 : 300;
      const scaleSqrt = d3
        .scaleSqrt()
        .domain([
          2,
          d3.max(this.jsonData, d => {
            return d.counties[this.selectedCounty].m;
          })
        ])
        .range([0, barWidth]);

      const newData = [];
      this.jsonData.forEach((data, index) => {
        const county = data.counties[this.selectedCounty];
        const prevEntry = this.chartData.find(c => c.country === data.country);
        const prevMaleWidth = prevEntry ? prevEntry.maleWidth : 0;
        const prevFemaleWidth = prevEntry ? prevEntry.maleWidth : 0;
        // Higher than 1 otherwise log returns negative width
        if (county.m > 2 && county.f > 2) {
          const entry = {
            country: data.country,
            maleWidth: prevMaleWidth,
            femaleWidth: prevFemaleWidth,
            maleScaled: scaleSqrt(county.m),
            femaleScaled: scaleSqrt(county.f),
            male: county.m,
            female: county.f
          };
          newData.push(entry);
        }
      });
      this.settings.height = newData.length * 50;
      this.settings.width = app.offsetWidth > 400 ? 600 : app.offsetWidth - 20;
      // console.table(newData);
      this.chartData = newData.sort((a, b) => {
        if((a.maleScaled + a.femaleScaled) < (b.maleScaled + b.femaleScaled)) {
          return 1;
        } else if ((a.maleScaled + a.femaleScaled) > (b.maleScaled + b.femaleScaled)) {
          return -1;
        } else {
          return 0;
        }
      });
    },
    animateChart() {
      this.chartData.forEach(entry => {
        const tween = new TWEEN.Tween(entry) // Create a new tween that modifies 'coords'.
          .to(
            {
              maleWidth: entry.maleScaled,
              femaleWidth: entry.femaleScaled
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
  svg {
    position: relative;
    border: 1px solid red;
  }
  .pop-text {
    fill: #fff;
  }
  .pop-bar {
    &.male {
      fill: #00a4ed;
    }
    &.female {
      fill: #e52669;
    }
  }
  .list-row {
    transition: all 1s;
    display: inline-block;
    margin-right: 10px;
  }
  .list-enter, .list-leave-to
  /* .list-complete-leave-active below version 2.1.8 */ {
    opacity: 0;
    transform: translateY(30px);
  }
  .list-leave-active {
    position: absolute;
  }
  .flag-icon {
    border-radius: 2px;
  }
}
</style>
