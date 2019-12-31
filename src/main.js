import Vue from 'vue'
import App from './App.vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faBackward, faPlay, faStop, faForward, faUndo, faRandom, faRetweet, faBars } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faBackward, faPlay, faStop, faForward, faUndo, faRandom, faRetweet, faBars)
Vue.component('fa', FontAwesomeIcon)
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
