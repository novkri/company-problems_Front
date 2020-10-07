import Vue from "vue";

import VueRouter from "vue-router";
import store from '../store'

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Problems",
    component: () =>  import("../views/Problems.vue"),
    props: true,
    meta: { 
      requiresAuth: true,
      layout: 'main'
    }
  },
  {
    path: "/my-problems",
    name: "MyProblems",
    component: () =>  import("../views/MyProblems.vue"),
    props: true,
    meta: { 
      requiresAuth: true,
      layout: 'main'
    }
  },
  {
    path: "/problems-for-execution",
    name: "ProblemsForExecution",
    component: () =>  import("../views/ProblemsForExecution.vue"),
    props: true,
    meta: { 
      requiresAuth: true,
      layout: 'main'
    }
  },
  {
    path: "/group-problems",
    name: "ProblemsForConfirmation",
    component: () =>  import("../views/ProblemsForConfirmation.vue"),
    props: true,
    meta: { 
      requiresAuth: true,
      layout: 'main'
    }
  },
  {
    path: "/problems-user-archive",
    name: "ProblemsArchive",
    component: () =>  import("../views/Archive.vue"),
    props: true,
    meta: { 
      requiresAuth: true,
      layout: 'main'
    }
  },
  {
    path: "/problems-of-all-groups",
    name: "ProblemsAllGroups",
    component: () =>  import("../views/ProblemsAllGroups.vue"),
    props: true,
    meta: { 
      requiresAuth: true,
      layout: 'main'
    }
  },
  {
    path: "/problems-by-groups/:id",
    name: "ProblemsGroupId",
    component: () =>  import("../views/ProblemsGroupId.vue"),
    props: true,
    meta: { 
      requiresAuth: true,
      layout: 'main'
    }
  },

  {
    path: "/login",
    name: "Login",
    component: () =>
      import("../views/Auth/Login.vue"),
      meta: { 
        layout: 'none'
      }
  },
  {
    path: "/register",
    name: "Register",
    component: () =>
      import("../views/Auth/Register.vue"),
      meta: { 
        layout: 'none'
      }
  },
  {
    path: "/groups",
    name: "Groups",
    component: () =>  import("../views/Groups.vue"),
    meta: { 
      requiresAuth: true,
      layout: 'main'
    }
  },
  { path: '*', component: () =>  import("../views/NotFound.vue"),
  meta: { 
    requiresAuth: true,
    layout: 'none'
  }}
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
