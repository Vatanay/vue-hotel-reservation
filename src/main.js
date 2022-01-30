import Vue from "vue";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "vue-select/dist/vue-select.css";
import "vue2-daterange-picker/dist/vue2-daterange-picker.css";
import "bootstrap";

import "./style.scss";

import App from "./App.vue";
import store from "../store";

new Vue({
  el: "#app",
  store,
  render: (h) => h(App),
});
