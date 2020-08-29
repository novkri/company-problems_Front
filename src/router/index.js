import Vue from "vue";
import VueRouter from "vue-router";
import Main from "../views/Main.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Main",
    component: Main,
  },
  {
    path: "/problems",
    name: "Home",
    component: () =>  import("../views/Home.vue"),
  },
  {
    path: "/login",
    name: "Login",
    component: () =>
      import("../components/Auth/Login.vue")
  },
  {
    path: "/register",
    name: "Register",
    component: () =>
      import("../components/Auth/Register.vue")
  },
  { path: '*', component: () =>  import("../views/NotFound.vue")}
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
