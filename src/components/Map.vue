<template>
  <div class="container">
     <l-map
      v-if="showMap"
      :zoom="zoom"
      :center="center"
      :options="mapOptions"
      style="height: 100%"
      @update:center="centerUpdate"
      @update:zoom="zoomUpdate"
    >
      <l-tile-layer
        :url="tileData.url"
        :attribution="tileData.attribution"
      />
      <LeafletHeatmap
        ref="heatmap"
        :lat-lng="heatmapPoints"
        :blur="heatmapConfig.blur"
        :radius="heatmapConfig.radius"
      />
    </l-map>
  </div>
</template>

<script>
//import h337 from 'heatmap.js'
import { latLng } from "leaflet";
import LeafletHeatmap from './LeafletHeatmap'

export default {
  name: 'Map',
  props: {
    points: {
      type: Array,
      default: null
    }
  },
  components: {
    LeafletHeatmap
  },
  computed: {
    heatmapPoints () {
      if (!this.points) return []
      return this.points.map(point => {
        return latLng(point.lat, point.lng, point.cases)
      })
    }
  },
  data() {
    return {
      showMap: true,
      zoom: 7,
      center: latLng(54, -1),
      mapOptions: {
        zoomSnap: 0.5
      },
      currentZoom: 0,
      currentCenter: null,
      tileData: {
        url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        attribution:
          '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      },
      heatmapConfig: {
        radius: 40,
        blur: 23,
      }
    }
  },
  methods: {
    updatePoints(points) {
      this.points = points;
    },
    zoomUpdate(zoom) {
      this.currentZoom = zoom;
    },
    centerUpdate(center) {
      this.currentCenter = center;
    }
  }
}
</script>

<style scoped>
  .container {
    height: 100%;
    margin: 0px 0px 20px 0px;
  }
</style>
