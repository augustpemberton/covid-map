<template>
  <div id="app" v-if="loaded">
    <Map ref="map" :points="points"/>
    <vue-slider v-model="dateSlider" :max="dateRange-1" />
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
      dateSlider: 0
    }
  },
  asyncComputed: {
    points: {
      get() {
        console.log(this.dateRange - this.dateSlider)
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
