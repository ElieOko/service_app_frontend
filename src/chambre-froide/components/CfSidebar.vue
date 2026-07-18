<script setup lang="ts">
import { computed, inject, ref, type Ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCfStore } from '../stores/cfStore'
import { clearAppMode } from '@/stores/appMode'

const store = useCfStore()
const route = useRoute()
const router = useRouter()
const mobileOpen = inject<Ref<boolean>>('cfSidebarOpen', ref(false))
const isMobileOpen = computed(() => mobileOpen.value)

const links = computed(() => {
  const all = [
    { to: '/cf', name: 'cf_home', label: 'Tableau de bord', roles: null as string[] | null },
    { to: '/cf/vente', name: 'cf_vente', label: 'Vente / Facturation', roles: ['Facturier', 'Administrateur', 'Directeur'] },
    { to: '/cf/caisse', name: 'cf_caisse', label: 'Caisse', roles: ['Caissier', 'Administrateur', 'Directeur'] },
    { to: '/cf/stock', name: 'cf_stock', label: 'Stocks', roles: null },
    { to: '/cf/fournisseurs', name: 'cf_fournisseurs', label: 'Fournisseurs', roles: null },
    { to: '/cf/approvisionnement', name: 'cf_appro', label: 'Approvisionnement', roles: ['Administrateur', 'Directeur', 'Superviseur'] },
    { to: '/cf/prix', name: 'cf_prix', label: 'Gestion des prix', roles: ['Administrateur', 'Directeur'] },
    { to: '/cf/rapports', name: 'cf_rapports', label: 'Rapports', roles: ['Administrateur', 'Directeur', 'Superviseur'] },
    { to: '/cf/recherche', name: 'cf_recherche', label: 'Recherche', roles: null },
    { to: '/cf/notifications', name: 'cf_notifications', label: 'Notifications', roles: null },
    { to: '/cf/utilisateurs', name: 'cf_users', label: 'Utilisateurs', roles: ['Administrateur', 'Directeur'] },
    { to: '/cf/logs', name: 'cf_logs', label: 'Journal d’activité', roles: ['Administrateur', 'Directeur'] },
    { to: '/cf/sauvegarde', name: 'cf_backup', label: 'Sauvegarde', roles: ['Administrateur', 'Directeur'] },
  ]
  return all.filter((l) => !l.roles || store.hasRole(...(l.roles as any)))
})

function isActive(name: string) {
  return route.name === name
}

function switchMode() {
  store.logout()
  clearAppMode()
  router.push('/select')
}

function closeMobile() {
  if (mobileOpen) mobileOpen.value = false
}
</script>

<template>
  <aside class="cf-side" :class="{ 'is-open': isMobileOpen }">
    <div class="cf-side__brand">
      <span class="cf-side__mark">CF</span>
      <div>
        <p class="cf-side__title">Chambre Froide</p>
        <p class="cf-side__sub">Service App V2</p>
      </div>
    </div>

    <nav class="cf-side__nav">
      <router-link
        v-for="link in links"
        :key="link.to"
        :to="link.to"
        class="cf-side__link"
        :class="{ 'is-active': isActive(link.name) }"
        @click="closeMobile"
      >
        {{ link.label }}
        <span
          v-if="link.name === 'cf_notifications' && store.unreadNotifications.length"
          class="cf-side__badge"
        >
          {{ store.unreadNotifications.length }}
        </span>
      </router-link>
    </nav>

    <button type="button" class="cf-side__switch" @click="switchMode">
      Changer de module
    </button>
  </aside>
</template>

<style scoped>
.cf-side {
  width: 260px;
  background: linear-gradient(180deg, #0b3d4a 0%, #0f4f55 55%, #126067 100%);
  color: #e8f6f5;
  padding: 1.25rem 0.9rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  position: fixed;
  inset: 0 auto 0 0;
  z-index: 40;
  transform: translateX(-100%);
  transition: transform 0.25s ease;
}

.cf-side.is-open {
  transform: translateX(0);
}

@media (min-width: 1024px) {
  .cf-side {
    position: static;
    transform: none;
  }
}

.cf-side__brand {
  display: flex;
  gap: 0.75rem;
  align-items: center;
  padding: 0.4rem 0.5rem 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);
}

.cf-side__mark {
  width: 42px;
  height: 42px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  background: rgba(255, 255, 255, 0.12);
  font-family: Fraunces, Georgia, serif;
  font-weight: 700;
}

.cf-side__title {
  margin: 0;
  font-weight: 700;
  font-size: 1.05rem;
}

.cf-side__sub {
  margin: 0;
  font-size: 0.78rem;
  opacity: 0.75;
}

.cf-side__nav {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  flex: 1;
  overflow: auto;
}

.cf-side__link {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.65rem 0.75rem;
  border-radius: 0.65rem;
  color: rgba(255, 255, 255, 0.82);
  text-decoration: none;
  font-size: 0.92rem;
  transition: background 0.2s ease;
}

.cf-side__link:hover,
.cf-side__link.is-active {
  background: rgba(255, 255, 255, 0.12);
  color: #fff;
}

.cf-side__badge {
  background: #f0b429;
  color: #1a2e35;
  border-radius: 999px;
  font-size: 0.7rem;
  font-weight: 700;
  min-width: 1.25rem;
  height: 1.25rem;
  display: grid;
  place-items: center;
  padding: 0 0.35rem;
}

.cf-side__switch {
  margin-top: auto;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: transparent;
  color: #fff;
  border-radius: 0.65rem;
  padding: 0.65rem;
  cursor: pointer;
  font-weight: 600;
}
</style>
