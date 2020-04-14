<template>
  <div id="app" v-if="loaded">
    <Map ref="map" :points="points"/>
    <div>
      <vue-slider v-model="dateSlider" :max="dateRange-1" />
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
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
