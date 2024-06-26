import { createApp } from 'vue'
import { createPinia } from 'pinia'
import YouTube from 'vue3-youtube'
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faStepForward,
  faStepBackward,
  faPause,
  faPlay,
  faChevronUp,
  faChevronDown,
  faChevronLeft,
  faChevronRight,
  faWindowClose,
  faPlus,
  faMinus,
  faSquare,
  faCheck,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import App from './App.vue'
import router from './router'

library.add(
    faStepForward,
    faStepBackward,
    faPause,
    faPlay,
    faWindowClose,
    faChevronUp,
    faChevronDown,
    faChevronLeft,
    faChevronRight,
    faPlus,
    faMinus,
    faSquare,
    faCheck,
    faTrash,
  );

const app = createApp(App)
app.config.globalProperties.window = window
app.use(createPinia())
app.use(router)
app.component("FontAwesomeIcon", FontAwesomeIcon)
app.component('YoutubePlayer', YouTube)
app.mount('#app')
