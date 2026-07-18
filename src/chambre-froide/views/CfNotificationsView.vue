<script setup lang="ts">
import { useCfStore } from '../stores/cfStore'

const store = useCfStore()
</script>

<template>
  <div class="notifs">
    <header>
      <div>
        <h2>Notifications</h2>
        <p>Stock faible, rupture, facture annulée, accès non autorisé.</p>
      </div>
      <button type="button" @click="store.markAllNotificationsRead()">Tout marquer comme lu</button>
    </header>

    <ul>
      <li
        v-for="n in store.db.notifications"
        :key="n.id"
        :class="{ unread: !n.read }"
        @click="store.markNotificationRead(n.id)"
      >
        <strong>{{ n.title }}</strong>
        <span>{{ n.message }}</span>
        <small>{{ new Date(n.createdAt).toLocaleString('fr-FR') }} · {{ n.type }}</small>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.notifs { display: grid; gap: 1rem; }
header {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
}
header h2 { margin: 0; font-family: Fraunces, Georgia, serif; color: #0b3d4a; }
header p { margin: 0.35rem 0 0; color: #5d7a84; }
ul { list-style: none; margin: 0; padding: 0; display: grid; gap: 0.65rem; }
li {
  background: white;
  border: 1px solid rgba(18, 48, 58, 0.08);
  border-radius: 0.9rem;
  padding: 0.9rem 1rem;
  display: grid;
  gap: 0.25rem;
  cursor: pointer;
}
li.unread { border-left: 4px solid #0f7f7a; background: #f2fbfb; }
small { color: #5d7a84; }
button {
  border: 0;
  background: #0f7f7a;
  color: white;
  border-radius: 0.7rem;
  padding: 0.65rem 0.9rem;
  font-weight: 700;
  cursor: pointer;
  height: fit-content;
}
</style>
