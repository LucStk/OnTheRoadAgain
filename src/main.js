/* Optional third-party libraries
import $ from "jquery";
import _ from "lodash";
import noUiSlider from "nouislider";
import "datatables.net";
import "dropzone/dist/dropzone-min.js";

window._ = _;
window.$ = $;
window.jQuery = $;
window.DataTable = $.fn.dataTable;
window.noUiSlider = noUiSlider;*/

// FlyonUI
import "flyonui/flyonui";
import './style.css';
import 'leaflet/dist/leaflet.css';
import './assets/css/elements.css';

import 'maplibre-gl/dist/maplibre-gl.css';
import VueMaplibreGl from '@indoorequal/vue-maplibre-gl'

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';


const pinia = createPinia()
const app = createApp(App)

app.use(VueMaplibreGl)
app.use(pinia)
app.mount('#app')
