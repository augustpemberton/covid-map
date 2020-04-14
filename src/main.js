import Vue from 'vue'
import App from './App.vue'
import VuePapaParse from 'vue-papa-parse'
import * as VueGoogleMaps from 'vue2-google-maps'
import VueSlider from 'vue-slider-component'
import AsyncComputed from 'vue-async-computed'

import { LMap, LTileLayer, LMarker } from 'vue2-leaflet'
import 'leaflet/dist/leaflet.css'

import 'vue-slider-component/theme/default.css'

Vue.use(VuePapaParse)
Vue.use(AsyncComputed)
Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyBHjhEd0g_lkTtWKqAEGw4EX-E7e6YpMqM',
    libraries: ["places", "visualization"]
  },
  installComponents: true
})

Vue.component('VueSlider', VueSlider);
Vue.component('l-map', LMap);
Vue.component('l-tile-layer', LTileLayer);
Vue.component('l-marker', LMarker);

import CovidDataInterface from '@/CovidDataInterface'
Vue.prototype.$covid = new CovidDataInterface();

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
