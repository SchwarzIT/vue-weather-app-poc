import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";

import { Auth0Plugin } from "./auth";

import { applyPolyfills, defineCustomElements } from "@scu/core-ui/dist/loader";
import "@scu/core-ui/dist/schwarz-core-ui/schwarz-core-ui.css";

Vue.use(Auth0Plugin);

Vue.config.productionTip = false;

Vue.config.ignoredElements = [/scu-\w*/];

applyPolyfills().then(() => {
  defineCustomElements();
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
