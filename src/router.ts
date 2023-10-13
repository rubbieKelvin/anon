import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

const routes: Readonly<RouteRecordRaw[]> = [
  {
    path: "/",
    name: "home",
    component: () => import("@/pages/index.vue"),
  },
  {
    path: "/:id",
    name: "room",
    component: () => import("@/pages/room.vue"),
  },
];

export default createRouter({
  history: createWebHistory(),
  routes,
});
