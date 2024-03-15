import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';
import Whiskey from '../components/Whiskey.vue';
import Brandy from '../components/Brandy.vue';
import Rum from '../components/Rum.vue';
import Vodka from '../components/Vodka.vue';
import Login from '../components/Login.vue';
import Signup from '../components/Signup.vue';
import Mypage from '../components/Mypage.vue';
import Cart from '../components/Cart.vue';
import Findid from '../components/Findid.vue';
import Findpw from '../components/Findpw.vue';
import Event from '../components/Event.vue';


Vue.use(VueRouter);

const routes = [
  { path: '/', component: Home },
  { path: '/whiskey', component: Whiskey },
  { path: '/brandy', component: Brandy },
  { path: '/rum', component: Rum },
  { path: '/vodka', component: Vodka },
  { path: '/login', component: Login },
  { path: '/signup', component: Signup },
  { path: '/mypage', component: Mypage },
  { path: '/cart', component: Cart},
  { path: '/findid', component: Findid },
  { path: '/findpw', component: Findpw },
  { path: '/event', component: Event },
];

const router = new VueRouter({
  routes,
});

export default router;