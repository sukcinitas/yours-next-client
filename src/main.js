import { createApp } from 'vue'
import { createPinia } from 'pinia'
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
app.use(createPinia())
app.use(router)
app.component("font-awesome-icon", FontAwesomeIcon)
app.mount('#app')
