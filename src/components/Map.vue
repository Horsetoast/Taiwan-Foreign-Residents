<template>
  <div class="map">
    <svg :width="settings.width" :height="settings.height">
      <transition-group tag="g" name="line" >
        <path 
          v-for="(county, index) in map" 
          @click="clickCounty(index)"
          class="county" 
          :key="index" :d="county.d" :style="county.style"></path>
			</transition-group>      
    </svg>
  </div>
</template>

<script>
import * as d3 from "d3";
import * as d3geo from "d3-geo";
// import taiwanCountries from "../assets/twCounty2010.geo.json";

console.log(d3);
console.log(d3geo);
// console.log(taiwanCountries);

export default {
  name: "Map",
  data () {
    return {
      settings: {
        width: 600,
        height: 800
      },
      map: []
    }
  },
  mounted() {
    this.createMap();
  },
  methods: {
    createMap() {
      const { width, height } = this.settings;

      d3.json("twCounty2010.geo.json", (json) => {
        var center = d3geo.geoCentroid(json);
        var scale = 150;
        var offset = [width / 2, height / 2];
        var projection = d3geo
          .geoMercator()
          .scale(scale)
          .center(center)
          .translate(offset);

        // create the path
        var path = d3geo.geoPath().projection(projection);

        // using the path determine the bounds of the current map and use
        // these to determine better values for the scale and translation
        var bounds = path.bounds(json);
        var hscale = scale * width / (bounds[1][0] - bounds[0][0]);
        var vscale = scale * height / (bounds[1][1] - bounds[0][1]);
        var scale = hscale < vscale ? hscale : vscale;
        var offset = [
          width - (bounds[0][0] + bounds[1][0]) / 2,
          height - (bounds[0][1] + bounds[1][1]) / 2
        ];

        // new projection
        projection = d3geo
          .geoMercator()
          .center(center)
          .scale(scale)
          .translate(offset);
        path = path.projection(projection);

        // console.log(json.features);

        this.map = json.features.map(county => {
          return {
            d: path(county),
            name: county.properties.name
          }
        });
      });
    },
    clickCounty (index) {
      const county = this.map[index];
      console.log('Clicked county', county);
    }
    // createMap() {
    //   var width = 600;
    //   var height = 800;

    //   var vis = d3
    //     .select("#vis")
    //     .append("svg")
    //     .attr("width", width)
    //     .attr("height", height);

    //   d3.json("twCounty2010.geo.json", function(json) {
    //     var center = d3geo.geoCentroid(json);
    //     var scale = 150;
    //     var offset = [width / 2, height / 2];
    //     var projection = d3geo
    //       .geoMercator()
    //       .scale(scale)
    //       .center(center)
    //       .translate(offset);

    //     // create the path
    //     var path = d3geo.geoPath().projection(projection);

    //     // using the path determine the bounds of the current map and use
    //     // these to determine better values for the scale and translation
    //     var bounds = path.bounds(json);
    //     var hscale = scale * width / (bounds[1][0] - bounds[0][0]);
    //     var vscale = scale * height / (bounds[1][1] - bounds[0][1]);
    //     var scale = hscale < vscale ? hscale : vscale;
    //     var offset = [
    //       width - (bounds[0][0] + bounds[1][0]) / 2,
    //       height - (bounds[0][1] + bounds[1][1]) / 2
    //     ];

    //     // new projection
    //     projection = d3geo
    //       .geoMercator()
    //       .center(center)
    //       .scale(scale)
    //       .translate(offset);
    //     path = path.projection(projection);

    //     vis
    //       .selectAll("path")
    //       .data(json.features)
    //       .enter()
    //       .append("path")
    //       .attr("d", path)
    //       .style("fill", "red")
    //       .style("stroke-width", "1")
    //       .style("stroke", "white")
    //       .on("click", function() {
    //         console.log(this);
    //       });
    //   });
    // }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  .map {
    svg {
      border: 1px solid brown;
    }
    .county {
      fill: brown;
      stroke-width: 1px;
      stroke: white;
      &:hover {
        fill: darken(brown, 5%);
      }
    }
  }
</style>
