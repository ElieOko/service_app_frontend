import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
//@ts-ignore
import App from './App.vue'
import router from './router'
//@ts-ignore
import Layout from './components/Layout.vue'
//@ts-ignore
import EmptyLayout from './components/EmptyLayout.vue'
//@ts-ignore
import CfLayout from './chambre-froide/components/CfLayout.vue'
import '@progress/kendo-theme-default/dist/all.css';
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import Vue3Toastify, { type ToastContainerOptions } from 'vue3-toastify';

const app = createApp(App)
app.use(Vue3Toastify, {
    autoClose: 9000,
  } as ToastContainerOptions)
app.component('DefaultLayout', Layout)
app.component('EmptyLayout', EmptyLayout)
app.component('CfLayout', CfLayout)
app.component('font-awesome-icon', FontAwesomeIcon)
app.use(createPinia())
app.use(router)

app.mount('#app')
