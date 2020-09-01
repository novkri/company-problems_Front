import Vue from "vue";
import VueRouter from "vue-router";
import Main from "../views/Main.vue";
import store from '../store'

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
    meta: { 
      requiresAuth: true
    }
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
router.beforeEach((to, from, next) => {
  if(to.matched.some(record => record.meta.requiresAuth)) {
    if (store.getters.isLoggedIn) {
      next()
      return
    }
    next('/login') 
  } else {
    next() 
  }
})

export default router;
