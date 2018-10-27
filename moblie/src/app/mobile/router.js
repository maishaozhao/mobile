import Vue    from 'vue';
import Router from 'vue-router';

const Home  = () => import('./views/Home.vue');
const About = () => import('./views/About.vue');
const welcomeLogin  = () => import('./views/welcome/Login.vue');


Vue.use(Router);

const router = new Router({
  mode: process.env.NODE_ENV === 'production' ? 'history' : 'hash',
  base: process.env.BASE_URL,
  linkExactActiveClass: 'active',
  routes: [
    {
      path: '/',
      component: {
        template: '<router-view></router-view>',
      },
      meta: {
        // 必须登陆
        authorization: true,
      },
      children: [
        // 首页
        {
          path: '/',
          name: 'mobile.Home',
          component: Home,
        },

        // 关于我们
        {
          path: '/about',
          name: 'mobile.About',
          component: About,
        },
      ],
    },

    //welcome
     {
       path: '/welcome',
       redirect: '/welcome/login',
       component: {
         template: '<router-view></router-view>',
       },
       children: [
         {
          path: 'login',
          name: 'mobile.WelcomeLogin',
          component: welcomeLogin,
         }
       ]
     }
  ],
});

export default router;