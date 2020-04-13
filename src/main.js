import Vue from 'vue'
import App from './App.vue'
import VuePapaParse from 'vue-papa-parse'
import * as VueGoogleMaps from 'vue2-google-maps'
import VueSlider from 'vue-slider-component'

import 'vue-slider-component/theme/default.css'

Vue.use(VuePapaParse)
Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyBHjhEd0g_lkTtWKqAEGw4EX-E7e6YpMqM',
    libraries: ["places", "visualization"]
  },
  installComponents: true
})

Vue.component('VueSlider', VueSlider);

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
