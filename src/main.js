import Vue from "vue";

import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap-icons/font/bootstrap-icons.css';
import "bootstrap";

import App from "./App.vue";
import store from "../store";

new Vue({
    el: "#app",
    store,
    render: (h) => h(App),
});
