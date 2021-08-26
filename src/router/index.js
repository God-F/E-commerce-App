import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '@/views/Home.vue';
import Classify from '@/views/Classify.vue';
import Shopping from '@/views/Shopping.vue';
import User from '@/views/User.vue';
import NotFound from '@/views/404.vue';
import Search from '@/views/Search.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    redirect: '/home',
  },
  {
    path: '/home',
    name: 'home',
    component: Home,
    redirect: '/classify',
  }, {
    path: '/classify',
    name: 'classify',
    component: Classify,
  },
  {
    path: '/shopping',
    name: 'shopping',
    component: Shopping,
  },
  {
    path: '/user',
    name: 'user',
    component: User,
    redirect: '/classify',
  },
  {
    path: '/search',
    name: 'search',
    component: Search,
  },
  {
    path: '/*',
    name: '*',
    component: NotFound,
  }];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
