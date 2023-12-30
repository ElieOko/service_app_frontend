import { createRouter, createWebHistory,  type RouteRecordRaw } from 'vue-router'
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
import DetteView from '../views/dette/DetteView.vue'
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
//@ts-ignore
import AppendTauxView from '../views/taux/AppendTauxView.vue'
//@ts-ignore
import ErrorView from '../views/ErrorView.vue'
import { getUser } from '@/stores/user'

const routes : RouteRecordRaw[] =  [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta:{ requiresAuth: true , reload: true}
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
      component: AppendArticleView,
      meta:{ requiresAuth: true , reload: true}
    },
    {
      path: '/article',
      name: 'article',
      component: ArticleView,
      meta:{ requiresAuth: true , reload: true}
    },
    {
      path: '/dette',
      name: 'dette',
      component: DetteView,
      meta:{ requiresAuth: true , reload: true}
    },
    {
      path: '/facturation',
      name: 'facturation',
      component: FacturationView,
      meta:{ requiresAuth: true , reload: true}

    },
    {
      path: '/facturation/add',
      name: 'facturation_add',
      component: AppendFacturationView,
      meta:{ requiresAuth: true , reload: true}
    },
    {
      path: '/taux',
      name: 'taux',
      component: AppendTauxView,
      meta:{ requiresAuth: true , reload: true}
    },
    {
      path: '/stock/add',
      name: 'stock_add',
      component: AppendStockView,
      meta:{ requiresAuth: true , reload: true}
    },
    {
      path: '/stock',
      name: 'stock',
      component: StockView,

    },
    {
      path: '/stock/historique/entree',
      name: 'stock_historique_entree',
      component: HistoriqueEntreeStockView,
      meta:{ requiresAuth: true , reload: true}
    },
    {
      path: '/stock/historique/sortie',
      name: 'stock_historique_sortie',
      component: HistoriqueSortieStockView,
      meta:{ requiresAuth: true , reload: true}
    },
    {
      path: '/signal',
      name: 'signal',
      component: SignalView,
      meta:{ requiresAuth: true , reload: true}
    },
    {
      path: '/signal/add',
      name: 'signal_add',
      component: AppendSignalView,
      meta:{ requiresAuth: true , reload: true}
    }, 
    { 
      path: '/:catchAll(.*)',
      component:ErrorView,
      meta: { layout: 'empty' }
    // component: 
     }
  ]
const router = createRouter({
  history: createWebHistory(),
  routes,
})
router.beforeEach((to, from, next) => {
  //const store = useTestStore()
  if (to.meta.requiresAuth && getUser() == null) {
    next('/login'); // Rediriger vers la page de connexion si l'utilisateur n'est pas authentifié
  } else {
    next(); // Permettre l'accès à la page demandée
  }
});
export default router