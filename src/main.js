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
import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import 'leaflet/dist/leaflet.css';
import './assets/css/elements.css';


createApp(App).mount('#app')
