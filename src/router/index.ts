import { createRouter, createWebHistory } from 'vue-router'
//@ts-ignore
import HomeView from '../views/HomeView.vue'
//@ts-ignore
import AuthentificationView from '../views/AuthentificationView.vue'
//@ts-ignore
import AppendUserView from '../views/user/AppendUserView.vue'
//@ts-ignore
import UserView from '../views/user/UserView.vue'
//@ts-ignore
import AppendArticleView from '../views/article/AppendArticleView.vue'
//@ts-ignore
import ArticleView from '../views/article/ArticleView.vue'
//@ts-ignore
import AppendFacturationView from '../views/facturation/AppendFacturationView.vue'
//@ts-ignore
import FacturationView from '../views/facturation/FacturationView.vue'
//@ts-ignore
import AppendStockView from '../views/stock/AppendStockView.vue'
//@ts-ignore
import StockView from '../views/stock/StockView.vue'
//@ts-ignore
import HistoriqueEntreeStockView from '../views/stock/HistoriqueEntreeStockView.vue'
//@ts-ignore
import HistoriqueSortieStockView from '../views/stock/HistoriqueSortieStockView.vue'
//@ts-ignore
import SignalView from '../views/signal/SignalView.vue'
//@ts-ignore
import AppendSignalView from '../views/signal/AppendSignalView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/register',
      name: 'register',
      component: AppendUserView,
      meta: { layout: 'empty' }
    },
    {
      path: '/login',
      name: 'login',
      component: AuthentificationView,
      meta: { layout: 'empty' }
    },
    {
      path: '/article/add',
      name: 'article_add',
      component: AppendArticleView
    },
    {
      path: '/article',
      name: 'article',
      component: ArticleView
    },
    {
      path: '/facturation',
      name: 'facturation',
      component: FacturationView
    },
    {
      path: '/facturation/add',
      name: 'facturation_add',
      component: AppendFacturationView
    },
    {
      path: '/stock/add',
      name: 'stock_add',
      component: AppendStockView
    },
    {
      path: '/stock',
      name: 'stock',
      component: StockView
    },
    {
      path: '/stock/historique/entree',
      name: 'stock_historique_entree',
      component: HistoriqueEntreeStockView
    },
    {
      path: '/stock/historique/sortie',
      name: 'stock_historique_sortie',
      component: HistoriqueSortieStockView
    },
    {
      path: '/signal',
      name: 'signal',
      component: SignalView
    },
    {
      path: '/signal/add',
      name: 'signal_add',
      component: AppendSignalView
    }, 
  ]
})

export default router
