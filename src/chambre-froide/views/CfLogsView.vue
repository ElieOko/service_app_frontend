<script setup lang="ts">
import { useCfStore } from '../stores/cfStore'

const store = useCfStore()
</script>

<template>
  <div class="logs">
    <header>
      <h2>Journal d’activité</h2>
      <p>Utilisateur, action, date, heure et adresse IP.</p>
    </header>

    <section class="panel">
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Heure</th>
            <th>Utilisateur</th>
            <th>Action</th>
            <th>Détails</th>
            <th>IP</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="l in store.db.logs" :key="l.id">
            <td>{{ l.date }}</td>
            <td>{{ l.time }}</td>
            <td>{{ l.userName }}</td>
            <td>{{ l.action }}</td>
            <td>{{ l.details || '—' }}</td>
            <td>{{ l.ip }}</td>
          </tr>
        </tbody>
      </table>
    </section>
  </div>
</template>

<style scoped>
.logs { display: grid; gap: 1rem; }
header h2 { margin: 0; font-family: Fraunces, Georgia, serif; color: #0b3d4a; }
header p { margin: 0.35rem 0 0; color: #5d7a84; }
.panel {
  background: white;
  border: 1px solid rgba(18, 48, 58, 0.08);
  border-radius: 1rem;
  padding: 1rem;
  overflow: auto;
}
table { width: 100%; border-collapse: collapse; min-width: 800px; }
th, td { border-bottom: 1px solid #e5eef0; padding: 0.5rem; text-align: left; font-size: 0.88rem; }
</style>
