import Vue from 'vue'
import VueRouter from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Login from '@/components/Login'
import Register from '@/components/Register'
import Transactions from '@/components/TransactionStatistics'
import { lockedPaguesForGuest } from '../constants/const'
import { lockedPagesForUser } from '../constants/const'
import authService from '../services/auth-service'
import TransactionView from '@/components/TransactionView'

Vue.use(VueRouter)
const router = new VueRouter(
  {
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/register',
      name: 'Register',
      component: Register
    },

    {
      path: '/transactions',
      name: 'Transactions',
      props: true,
      component: Transactions
    },
    {
      path: '/view/transactions',
      name: 'TransactionView',
      props: true,
      component: TransactionView
    }
  ],
  mode: 'history'
})
router.beforeEach((to, from, next)=>
{
  if (authService.isLoggedIn())
  {
    if (lockedPagesForUser.filter(lockedPage=>lockedPage==to.path).length<1)
    {
      next();
    }
    else next('/transactions');
  }
  else
  {
    if (lockedPaguesForGuest.filter(lockedPage=>lockedPage==to.path).length<1)
    {
      next();
    }
    else next('/');
  }
});  
export default router;
