import Vue    from 'vue';
import Router from 'vue-router';

const Template = '<router-view></router-view>';

// home
const Home        = () => import('./views/home/Index.vue');
const OrderList   = () => import('./views/order/List.vue');

// welcome
const welcomeConf   = () => import('./views/welcome/Conf.vue');
const welcomeLogin  = () => import('./views/welcome/Login.vue');
const welcomeRegister  = () => import('./views/welcome/Register.vue');

// auth
const AuthGroupList   = () => import('./views/auth/Group_List.vue');
const AuthGroupAdd    = () => import('./views/auth/Group_Add.vue');

Vue.use(Router);

export default new Router({
  mode                 : process.env.NODE_ENV === 'production' ? 'history' : 'hash',
  base                 : process.env.BASE_URL,
  linkExactActiveClass : 'active',
  routes: [
    // home
    {
      path: '/home',
      component: {
        template: Template,
      },
      redirect: '/',
      meta: {
        title: '控制中心',
        // 必须登陆
        authorization: true,
      },
      children: [
        // 菜单管理
        {
          path: '/',
          name: 'admin.Home',
          component: Home,
          meta: {
            title: '菜单管理',
          },
        },
        // 首页配置
        {
          path: 'conf',
          name: 'admin.HomeConf',
          component: OrderList,
          meta: {
            title: '首页配置',
          },
        },
      ],
    },
    // auth
    {
      path: '/auth',
      component: {
        template: Template,
      },
      redirect: '/auth/group',
      meta: {
        title: '权限管理',
        // 必须登陆
        authorization: true,
      },
      children: [
        // 部门管理
        {
          path: 'group',
          name: 'admin.AuthGroupList',
          component: AuthGroupList,
          meta: {
            title: '部门管理',
          },
        },
        // 添加用户组
        {
          path: 'group/add',
          name: 'admin.AuthGroupAdd',
          component: AuthGroupAdd,
          meta: {
            title: '添加部门',
            menu: false,
          },
        },
        // 角色管理
        {
          path: 'role',
          name: 'admin.AuthRole',
          component: OrderList,
          meta: {
            title: '角色管理',
          },
        },
        // 人员管理
        {
          path: 'role',
          name: 'admin.AuthRole',
          component: OrderList,
          meta: {
            title: '人员管理',
          },
        },
      ],
    },
    // order
    {
      path: '/order',
      redirect: '/order/list',
      component: {
        template: Template,
      },
      meta: {
        title: '订单管理',
        // 必须登陆
        authorization: true,
      },
      children: [
        // 订单列表
        {
          path: 'list',
          name: 'admin.OrderList',
          component: Home,
          meta: {
            title: '订单列表',
          },
        },
        // 添加订单
        {
          path: 'add',
          name: 'admin.OrderAdd',
          component: OrderList,
          meta: {
            title: '添加订单',
          },
        },
      ],
    },

    // welcome
    {
      path: '/welcome',
      redirect: '/welcome/login',
      component: {
        template: Template,
      },
      meta: {
        title: '登陆页',
      },
      children: [
        // 配置数据库
        {
          path: 'conf',
          name: 'admin.WelcomeConf',
          component: welcomeConf,
          meta: {
            title: '配置数据库',
          },
        },
        // 登陆页
        {
          path: 'login',
          name: 'admin.WelcomeLogin',
          component: welcomeLogin,
          meta: {
            title: '欢迎登陆',
          },
        },
        // 注册页
        {
          path: 'register',
          name: 'admin.welcomeRegister',
          component: welcomeRegister,
          meta: {
            title: '注册账号',
          },
        },
      ],
    },

  ],
});
