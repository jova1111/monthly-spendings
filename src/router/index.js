import Vue from 'vue';
import VueRouter from 'vue-router';
import HomePage from '@/views/HomePage';
import LoginPage from '@/views/LoginPage';
import RegisterPage from '@/views/RegisterPage';
import TransactionsHomePage from '@/views/TransactionsHomePage';
import TransactionsPage from '@/views/TransactionsPage';
import TransactionUpdatePage from '@/views/TransactionUpdatePage';
import StatisticsPage from '@/views/StatisticsPage';
import { lockedPagesForGuestRegex } from '../constants/const';
import { lockedPagesForUserRegex } from '../constants/const';
import userService from '../services/user-service';

Vue.use(VueRouter)
const router = new VueRouter(
  {
    routes: [
      {
        path: '/',
        name: 'HomePage',
        component: HomePage
      },
      {
        path: '/login',
        name: 'LoginPage',
        component: LoginPage
      },
      {
        path: '/register',
        name: 'RegisterPage',
        component: RegisterPage
      },
      {
        path: '/transactions',
        name: 'TransactionsHomePage',
        props: true,
        component: TransactionsHomePage
      },
      {
        path: '/transactions/:year/:month',
        name: 'TransactionsPage',
        props: true,
        component: TransactionsPage
      },
      {
        path: '/statistics',
        name: 'StatisticsPage',
        component: StatisticsPage
      },
      {
        path: '/transaction/:id/update',
        name: 'TransactionUpdatePage',
        component: TransactionUpdatePage
      }
    ],

    mode: 'history'
  });

router.beforeResolve((to, from, next)=>
{
  if (userService.isLoggedIn())
  {
    if (to.path == '/') {
      next('/transactions');
    }
    else if (lockedPagesForUserRegex.filter(lockedPageRegex => to.path.match(lockedPageRegex)).length < 1)
    {
      next();
    }
    else {
      var date = new Date();
      next(`/transactions/${date.getUTCFullYear()}/${date.getUTCMonth() + 1}`);
    }
  }
  else
  {
    if (lockedPagesForGuestRegex.filter(lockedPageRegex => to.path.match(lockedPageRegex)).length < 1)
    {
      next();
    }
    else next('/login');
  }
});

export default router;
