import { createWebHistory, createRouter } from 'vue-router';
import Generator from '@/views/Generator.vue';
import Checker from '@/views/Checker.vue';
import Video from '@/views/Video.vue';
import About from '@/views/About.vue';

const routes = [
  {
    path: '/',
    name: 'Generator',
    component: Generator,
  },
  {
    path: '/checker',
    name: 'Checker',
    component: Checker,
  },
  {
    path: '/video',
    name: 'Video',
    component: Video,
  },
  {
    path: '/about',
    name: 'About',
    component: About,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
