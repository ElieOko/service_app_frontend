<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCfStore } from '../stores/cfStore'
import { clearAppMode } from '@/stores/appMode'

defineEmits<{ (e: 'toggle-sidebar'): void }>()

const store = useCfStore()
const router = useRouter()
const open = ref(false)

function logout() {
  store.logout()
  router.push('/cf/login')
}

function switchModule() {
  store.logout()
  clearAppMode()
  router.push('/select')
}
</script>

<template>
  <header class="cf-header">
    <div class="cf-header__left">
      <button type="button" class="cf-header__menu-btn" @click="$emit('toggle-sidebar')">☰</button>
      <div>
        <p class="cf-header__eyebrow">Chambre froide</p>
        <h1 class="cf-header__title">Gestion en temps réel</h1>
      </div>
    </div>
    <div class="cf-header__actions">
      <router-link to="/cf/notifications" class="cf-header__bell">
        Alertes
        <span v-if="store.unreadNotifications.length">{{ store.unreadNotifications.length }}</span>
      </router-link>
      <div class="cf-header__user" @click="open = !open">
        <div>
          <strong>{{ store.currentUser?.fullName }}</strong>
          <small>{{ store.currentUser?.role }}</small>
        </div>
        <div v-if="open" class="cf-header__menu">
          <button type="button" @click="logout">Déconnexion</button>
          <button type="button" @click="switchModule">Changer de module</button>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
.cf-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid rgba(18, 48, 58, 0.08);
  background: rgba(255, 255, 255, 0.65);
  backdrop-filter: blur(8px);
}

.cf-header__left {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.cf-header__menu-btn {
  border: 1px solid rgba(18, 48, 58, 0.12);
  background: white;
  border-radius: 0.55rem;
  width: 2.4rem;
  height: 2.4rem;
  cursor: pointer;
  font-size: 1.1rem;
}

@media (min-width: 1024px) {
  .cf-header__menu-btn { display: none; }
}

.cf-header__eyebrow {
  margin: 0;
  font-size: 0.75rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #5d7a84;
  font-weight: 600;
}

.cf-header__title {
  margin: 0.15rem 0 0;
  font-family: Fraunces, Georgia, serif;
  font-size: 1.35rem;
  color: #0b3d4a;
}

.cf-header__actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.cf-header__bell {
  text-decoration: none;
  color: #0f7f7a;
  font-weight: 600;
  background: #e5f5f4;
  padding: 0.45rem 0.75rem;
  border-radius: 999px;
  display: inline-flex;
  gap: 0.4rem;
  align-items: center;
}

.cf-header__bell span {
  background: #d97706;
  color: white;
  border-radius: 999px;
  min-width: 1.2rem;
  height: 1.2rem;
  font-size: 0.7rem;
  display: grid;
  place-items: center;
}

.cf-header__user {
  position: relative;
  cursor: pointer;
  background: white;
  border: 1px solid rgba(18, 48, 58, 0.1);
  border-radius: 0.85rem;
  padding: 0.45rem 0.8rem;
}

.cf-header__user strong {
  display: block;
  font-size: 0.9rem;
}

.cf-header__user small {
  color: #5d7a84;
}

.cf-header__menu {
  position: absolute;
  right: 0;
  top: calc(100% + 0.4rem);
  background: white;
  border: 1px solid rgba(18, 48, 58, 0.1);
  border-radius: 0.75rem;
  min-width: 180px;
  box-shadow: 0 12px 30px rgba(16, 42, 51, 0.12);
  z-index: 20;
  overflow: hidden;
}

.cf-header__menu button {
  display: block;
  width: 100%;
  text-align: left;
  padding: 0.7rem 0.9rem;
  border: 0;
  background: white;
  cursor: pointer;
}

.cf-header__menu button:hover {
  background: #f1f7f7;
}
</style>
