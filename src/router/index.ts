import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
//@ts-ignore
import HomeView from '../views/HomeView.vue'
//@ts-ignore
import AuthentificationView from '../views/AuthentificationView.vue'
//@ts-ignore
import AppendUserView from '../views/user/AppendUserView.vue'
//@ts-ignore
import ArticleView from '../views/article/ArticleView.vue'
//@ts-ignore
import AppendArticleView from '../views/article/AppendArticleView.vue'
//@ts-ignore
import AppendFacturationView from '../views/facturation/AppendFacturationView.vue'
//@ts-ignore
import DetteView from '../views/dette/DetteView.vue'
//@ts-ignore
import AppendDetteView from '../views/dette/AppendDetteView.vue'
//@ts-ignore
import SpecialDetteView from '../views/dette/SpecialDetteView.vue'
//@ts-ignore
import FacturationView from '../views/facturation/FacturationView.vue'
//@ts-ignore
import AppendStockView from '../views/stock/AppendStockView.vue'
//@ts-ignore
import StockView from '../views/stock/StockView.vue'
//@ts-ignore
import MarketeurView from '../views/marketeur/MarketeurView.vue'
//@ts-ignore
import AppendMarketeurView from '../views/marketeur/AppendMarketeurView.vue'
//@ts-ignore
import DetailMarketeurView from '../views/marketeur/DetailMarketeurView.vue'
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
import VersementView from '../views/versement/VersementView.vue'
//@ts-ignore
import DetailVersementView from '../views/versement/DetailVersementView.vue'
//@ts-ignore
import ErrorView from '../views/ErrorView.vue'
//@ts-ignore
import ModeSelectView from '../views/ModeSelectView.vue'
//@ts-ignore
import CfLoginView from '../chambre-froide/views/CfLoginView.vue'
//@ts-ignore
import CfRegisterOrgView from '../chambre-froide/views/CfRegisterOrgView.vue'
//@ts-ignore
import CfOrganisationView from '../chambre-froide/views/CfOrganisationView.vue'
//@ts-ignore
import CfDashboardView from '../chambre-froide/views/CfDashboardView.vue'
//@ts-ignore
import CfVenteView from '../chambre-froide/views/CfVenteView.vue'
//@ts-ignore
import CfCaisseView from '../chambre-froide/views/CfCaisseView.vue'
//@ts-ignore
import CfStockView from '../chambre-froide/views/CfStockView.vue'
//@ts-ignore
import CfApprovisionnementView from '../chambre-froide/views/CfApprovisionnementView.vue'
//@ts-ignore
import CfPrixView from '../chambre-froide/views/CfPrixView.vue'
//@ts-ignore
import CfRapportsView from '../chambre-froide/views/CfRapportsView.vue'
//@ts-ignore
import CfRechercheView from '../chambre-froide/views/CfRechercheView.vue'
//@ts-ignore
import CfNotificationsView from '../chambre-froide/views/CfNotificationsView.vue'
//@ts-ignore
import CfUsersView from '../chambre-froide/views/CfUsersView.vue'
//@ts-ignore
import CfLogsView from '../chambre-froide/views/CfLogsView.vue'
//@ts-ignore
import CfBackupView from '../chambre-froide/views/CfBackupView.vue'
//@ts-ignore
import CfFournisseursView from '../chambre-froide/views/CfFournisseursView.vue'
import { getUser } from '@/stores/user'
import { getAppMode } from '@/stores/appMode'
import { readSession } from '@/chambre-froide/db'

function getCfSession() {
  return readSession()
}

const routes: RouteRecordRaw[] = [
  {
    path: '/select',
    name: 'mode_select',
    component: ModeSelectView,
    meta: { layout: 'empty' },
  },
  // ---------- Chambre froide ----------
  {
    path: '/cf/login',
    name: 'cf_login',
    component: CfLoginView,
    meta: { layout: 'empty', module: 'chambre_froide' },
  },
  {
    path: '/cf/register-org',
    name: 'cf_register_org',
    component: CfRegisterOrgView,
    meta: { layout: 'empty', module: 'chambre_froide' },
  },
  {
    path: '/cf',
    name: 'cf_home',
    component: CfDashboardView,
    meta: { layout: 'cf', requiresCfAuth: true, module: 'chambre_froide' },
  },
  {
    path: '/cf/organisation',
    name: 'cf_organisation',
    component: CfOrganisationView,
    meta: { layout: 'cf', requiresCfAuth: true, module: 'chambre_froide' },
  },
  {
    path: '/cf/vente',
    name: 'cf_vente',
    component: CfVenteView,
    meta: { layout: 'cf', requiresCfAuth: true, module: 'chambre_froide', roles: ['Facturier', 'Administrateur', 'Directeur'] },
  },
  {
    path: '/cf/caisse',
    name: 'cf_caisse',
    component: CfCaisseView,
    meta: { layout: 'cf', requiresCfAuth: true, module: 'chambre_froide', roles: ['Caissier', 'Administrateur', 'Directeur'] },
  },
  {
    path: '/cf/stock',
    name: 'cf_stock',
    component: CfStockView,
    meta: { layout: 'cf', requiresCfAuth: true, module: 'chambre_froide' },
  },
  {
    path: '/cf/approvisionnement',
    name: 'cf_appro',
    component: CfApprovisionnementView,
    meta: { layout: 'cf', requiresCfAuth: true, module: 'chambre_froide', roles: ['Administrateur', 'Directeur', 'Superviseur'] },
  },
  {
    path: '/cf/fournisseurs',
    name: 'cf_fournisseurs',
    component: CfFournisseursView,
    meta: { layout: 'cf', requiresCfAuth: true, module: 'chambre_froide' },
  },
  {
    path: '/cf/prix',
    name: 'cf_prix',
    component: CfPrixView,
    meta: { layout: 'cf', requiresCfAuth: true, module: 'chambre_froide', roles: ['Administrateur', 'Directeur'] },
  },
  {
    path: '/cf/rapports',
    name: 'cf_rapports',
    component: CfRapportsView,
    meta: { layout: 'cf', requiresCfAuth: true, module: 'chambre_froide', roles: ['Administrateur', 'Directeur', 'Superviseur'] },
  },
  {
    path: '/cf/recherche',
    name: 'cf_recherche',
    component: CfRechercheView,
    meta: { layout: 'cf', requiresCfAuth: true, module: 'chambre_froide' },
  },
  {
    path: '/cf/notifications',
    name: 'cf_notifications',
    component: CfNotificationsView,
    meta: { layout: 'cf', requiresCfAuth: true, module: 'chambre_froide' },
  },
  {
    path: '/cf/utilisateurs',
    name: 'cf_users',
    component: CfUsersView,
    meta: { layout: 'cf', requiresCfAuth: true, module: 'chambre_froide', roles: ['Administrateur', 'Directeur'] },
  },
  {
    path: '/cf/logs',
    name: 'cf_logs',
    component: CfLogsView,
    meta: { layout: 'cf', requiresCfAuth: true, module: 'chambre_froide', roles: ['Administrateur', 'Directeur'] },
  },
  {
    path: '/cf/sauvegarde',
    name: 'cf_backup',
    component: CfBackupView,
    meta: { layout: 'cf', requiresCfAuth: true, module: 'chambre_froide', roles: ['Administrateur', 'Directeur'] },
  },
  // ---------- Boutique (existant) ----------
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: { requiresAuth: true, reload: true, module: 'boutique' },
  },
  {
    path: '/register',
    name: 'register',
    component: AppendUserView,
    meta: { layout: 'empty', module: 'boutique' },
  },
  {
    path: '/login',
    name: 'login',
    component: AuthentificationView,
    meta: { layout: 'empty', module: 'boutique' },
  },
  {
    path: '/article/add',
    name: 'article_add',
    component: AppendArticleView,
    meta: { requiresAuth: true, reload: true, module: 'boutique' },
  },
  {
    path: '/article',
    name: 'article',
    component: ArticleView,
    meta: { requiresAuth: true, reload: true, module: 'boutique' },
  },
  {
    path: '/dette',
    name: 'dette',
    component: DetteView,
    meta: { requiresAuth: true, reload: true, module: 'boutique' },
  },
  {
    path: '/dette/add',
    name: 'dette_add',
    component: AppendDetteView,
    meta: { requiresAuth: true, reload: true, module: 'boutique' },
  },
  {
    path: '/dette/special',
    name: 'dette_special',
    component: SpecialDetteView,
    meta: { requiresAuth: true, reload: true, module: 'boutique' },
  },
  {
    path: '/facturation',
    name: 'facturation',
    component: FacturationView,
    meta: { requiresAuth: true, reload: true, module: 'boutique' },
  },
  {
    path: '/facturation/add',
    name: 'facturation_add',
    component: AppendFacturationView,
    meta: { requiresAuth: true, reload: true, module: 'boutique' },
  },
  {
    path: '/taux',
    name: 'taux',
    component: AppendTauxView,
    meta: { requiresAuth: true, reload: true, module: 'boutique' },
  },
  {
    path: '/versement',
    name: 'versement',
    component: VersementView,
    meta: { requiresAuth: true, reload: true, module: 'boutique' },
  },
  {
    path: '/versement/detail',
    name: 'versement_detail',
    component: DetailVersementView,
    meta: { requiresAuth: true, reload: true, module: 'boutique' },
  },
  {
    path: '/marketeur',
    name: 'marketeur',
    component: MarketeurView,
    meta: { requiresAuth: true, reload: true, module: 'boutique' },
  },
  {
    path: '/marketeur/add',
    name: 'marketeur_add',
    component: AppendMarketeurView,
    meta: { requiresAuth: true, reload: true, module: 'boutique' },
  },
  {
    path: '/marketeur/detail',
    name: 'marketeur_detail',
    component: DetailMarketeurView,
    meta: { requiresAuth: true, reload: true, module: 'boutique' },
  },
  {
    path: '/stock/add',
    name: 'stock_add',
    component: AppendStockView,
    meta: { requiresAuth: true, reload: true, module: 'boutique' },
  },
  {
    path: '/stock',
    name: 'stock',
    component: StockView,
    meta: { module: 'boutique' },
  },
  {
    path: '/stock/historique/entree',
    name: 'stock_historique_entree',
    component: HistoriqueEntreeStockView,
    meta: { requiresAuth: true, reload: true, module: 'boutique' },
  },
  {
    path: '/stock/historique/sortie',
    name: 'stock_historique_sortie',
    component: HistoriqueSortieStockView,
    meta: { requiresAuth: true, reload: true, module: 'boutique' },
  },
  {
    path: '/signal',
    name: 'signal',
    component: SignalView,
    meta: { requiresAuth: true, reload: true, module: 'boutique' },
  },
  {
    path: '/signal/add',
    name: 'signal_add',
    component: AppendSignalView,
    meta: { requiresAuth: true, reload: true, module: 'boutique' },
  },
  {
    path: '/:catchAll(.*)',
    component: ErrorView,
    meta: { layout: 'empty' },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, _from, next) => {
  const mode = getAppMode()

  if (to.name === 'mode_select') {
    next()
    return
  }

  if (!mode) {
    next('/select')
    return
  }

  const targetModule = to.meta.module as string | undefined

  if (mode === 'boutique' && targetModule === 'chambre_froide') {
    next('/login')
    return
  }

  if (mode === 'chambre_froide' && targetModule === 'boutique') {
    next(getCfSession() ? '/cf' : '/cf/login')
    return
  }

  if (mode === 'chambre_froide' && to.path === '/') {
    next(getCfSession() ? '/cf' : '/cf/login')
    return
  }

  if (to.meta.requiresAuth && getUser() == null) {
    next('/login')
    return
  }

  if (to.meta.requiresCfAuth) {
    const session = getCfSession()
    if (!session?.user) {
      next('/cf/login')
      return
    }
    const roles = to.meta.roles as string[] | undefined
    if (roles && !roles.includes(session.user.role)) {
      next('/cf')
      return
    }
  }

  next()
})

export default router
