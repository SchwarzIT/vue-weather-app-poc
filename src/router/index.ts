import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Home from "../views/Home.vue";
import Callback from "../views/Callback.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/home",
    name: "home",
    component: Home
  },
  {
    path: "/",
    name: "initial",
    redirect: "/home"
  },
  {
    path: "/callback",
    name: "callback",
    component: Callback
  },
  {
    path: "/user-profile",
    name: "about",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/UserProfile.vue")
  },
  {
    path: "/country-list",
    name: "country-list",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "country-list" */ "../views/CountryList.vue")
  },
  {
    path: "/city-list/:iso",
    name: "city-list",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "city-list" */ "../views/CityList.vue")
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

router.beforeEach((to, from, next) => {
  if (to.name == "callback" || to.name == "home") {
    // check if "to"-route is "callback" and allow access
    next();
  } else {
    if (Vue.prototype.$auth.authenticated) {
      // if authenticated allow access
      next();
    } else {
      // trigger auth0's login.
      next(false);
    }
  }
});

export default router;
