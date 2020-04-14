<template>
  <div id="app" v-if="loaded">
    <Map id="ma" ref="map" :points="points"/>
    <div id="controls">
      <vue-slider 
        v-model="dateSlider" 
        id="date-slider"
        :max="dateRange-1" 
        tooltip="always"
        :tooltip-formatter="val => formatTooltip(val)"
      />
      <button @click="animateHeatmap()">
        <span  v-if="!animation">
          Play animation
        </span>
        <span v-else>
          Pause animation
        </span>
      </button>
    </div>
  </div>
</template>

<script>
import Map from './components/Map.vue'
import moment from 'moment'

export default {
  name: 'App',
  components: {
    Map
  },
  computed: {
  },
  data () {
    return {
      dateRange: 39,
      loaded: false,
      dateSlider: 0,
      animation: null
    }
  },
  asyncComputed: {
    points: {
      get() {
        var date = moment().subtract(this.dateRange - this.dateSlider, 'days').format('YYYY-MM-DD');
        return this.$covid.getData(date).then(data => data);
      },
      default () {
        return []
      }
    }
  },
  mounted () {
    var self = this;
    this.dateSlider = this.dateRange-1;
    this.$covid.loadData(this.dateRange).then(() => {
      self.loaded = true;
    })
  },
  methods: {
    animateHeatmap() {
      if (this.animation) {
        clearInterval(this.animation);
        this.animation = null;
      } else {
        this.animation = setInterval(function() {
          this.dateSlider++;
          if (this.dateSlider > this.dateRange-1) {
            this.dateSlider = 0;
          }
        }.bind(this), 300);
      }
    },
    formatTooltip (value) {
      return moment().subtract(this.dateRange - value, 'days').format('YYYY-MM-DD');
    }
  }
}
</script>

<style>
body {
  margin: 0px;
}
#app {
  width: 100vw;
  height: 100vh;
}
#map {
  z-index: 0;
}
#controls {
  position: fixed;
  bottom: 0px;
  height: 10vh;
  z-index: 999;
  width: 100%;
  background-color: white;
  padding: 30px;
}
#date-slider {
  width: 80vw !important
}
</style>
