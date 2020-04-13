<template>
  <div class="container">
    <GmapMap ref="mapRef" 
      :center="{lat: 54, lng: -1}"
      :zoom="7"
      map-type-id="terrain"
      style="width: 1000px; height: 800px"
    />
    <vue-slider @change="changeDate" :min="1" :value="1" :max="40"/>
  </div>
</template>

<script>
import { gmapApi } from 'vue2-google-maps'
import axios from 'axios'
import districts from '@/districts.json'
import moment from 'moment'

export default {
  name: 'Map',
  data() {
    return {
      points: {},
      maxInfections: 0,
      date: null,
      heatmapPoints: null
    }
  },
  computed: {
    google: gmapApi,
  },
  watch: {
    date: function(newDate) {
      if (!this.points[newDate]) {
        this.updateData()
      } else {
        this.updateHeatmap()
      }
    }
  },
  mounted() {
    this.date = moment().subtract(1, 'days').format('YYYY-MM-DD');
    this.$gmapApiPromiseLazy().then(() => {
      this.heatmapPoints = new self.google.maps.MVCArray();
      this.createHeatmap();
      this.updateData()
    })
  },
  methods: {
    updateData() {
      this.updateCases()
      .then(data => this.updatePoints(data))
      .then(() => this.updateHeatmap())
    },
    updateCases() {
      var self = this;
      return new Promise((resolve, reject) => {
        var where = "date = '" + self.date +"'"
        var url = `https://covid-19-uk-datasette-65tzkjlxkq-ew.a.run.app/covid-19-uk.json?sql=
          select date,AreaCode,TotalCases
          from cases 
          where `+where+`
          group by date,AreaCode`;
        axios.get(url)
        .then(res => {
          var rows = res.data.rows;
          var data = {};
          rows.forEach(row => {
            var date = row[0];
            var areaCode = row[1];
            var cases = row[2];
            if (!data[date]) data[date] = [];
            data[date].push({
              'areaCode': areaCode,
              'cases': cases
            })
          })
          resolve(data);
        })
        .catch(err => reject(err));
      })
    },
    updatePoints(data) {
      if (data == null) return [];
      var points = {};
      var self = this;
      Object.keys(data).forEach(date => {
        data[date].forEach(row => {
          var count = self.parseCount(row.cases);
          if (count > self.maxInfections) {
            self.maxInfections = count;
          }
          if (districts[row.areaCode] === undefined) return {}

          if (!points[date]) points[date] = [];
          points[date].push({
            lat: districts[row.areaCode].lat,
            lng: districts[row.areaCode].long,
            count: count
          })
        })
      })
      this.points = {...points, ...this.points};
    },
    updateHeatmap() {
      var arr = new this.google.maps.MVCArray();
      this.points[this.date].forEach(point => {
        var wl = {};
        wl.location = new this.google.maps.LatLng(point.lat, point.lng)
        wl.weight = point.count
        arr.push(wl)
      })
      this.$heatmap.set('data', arr);
    },
    createHeatmap() {
      var self = this;
      this.$heatmap = new this.google.maps.visualization.HeatmapLayer({
        data: this.heatmapPoints,
        map: this.$refs.mapRef.$mapObject,
        opacity: 0.7,
        maxIntensity: self.maxInfections,
        radius: 50,
      })
      this.$heatmap.setMap(this.$refs.mapRef.$mapObject);
    },
    parseCount(count) {
      if (count == "1 to 4") {
        return 4;
      } else {
        return parseInt(count);
      }
    },
    changeDate(prevDays) {
      var newDate;
      if (prevDays > 0) {
        newDate = moment().subtract(prevDays, 'days').format('YYYY-MM-DD');
      } else {
        newDate = moment().format('YYYY-MM-DD');
      }
      if (this.date === newDate) return;
      this.date = newDate;
    },
  }
}
</script>

<style scoped>
</style>
