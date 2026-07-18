<script setup lang="ts">
import { ref } from 'vue'
import { toast } from 'vue3-toastify'
import { useCfStore } from '../stores/cfStore'
import { downloadBlob } from '../utils/helpers'

const store = useCfStore()
const importText = ref('')

function manualBackup() {
  try {
    const json = store.backup()
    const code = store.currentOrg?.code || 'org'
    downloadBlob(`cf-${code}-backup-${Date.now()}.json`, json, 'application/json')
    toast('Sauvegarde de l’organisation téléchargée')
  } catch (e: any) {
    toast(e.message || 'Erreur')
  }
}

function platformBackup() {
  try {
    const json = store.backupPlatform()
    downloadBlob(`cf-platform-backup-${Date.now()}.json`, json, 'application/json')
    toast('Sauvegarde plateforme téléchargée')
  } catch (e: any) {
    toast(e.message || 'Erreur')
  }
}

function restoreAuto() {
  const raw = localStorage.getItem('cf_auto_backup_v3') || localStorage.getItem('cf_auto_backup_v2')
  if (!raw) {
    toast('Aucune sauvegarde automatique trouvée')
    return
  }
  try {
    store.restore(raw)
    toast('Sauvegarde automatique restaurée')
  } catch (e: any) {
    toast(e.message || 'Erreur de restauration')
  }
}

function restoreManual() {
  try {
    store.restore(importText.value)
    toast('Données restaurées')
    importText.value = ''
  } catch (e: any) {
    toast(e.message || 'Fichier invalide')
  }
}

function onFile(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = () => {
    importText.value = String(reader.result || '')
  }
  reader.readAsText(file)
}

function resetDemo() {
  if (!confirm('Réinitialiser les données de CETTE organisation ?')) return
  try {
    store.resetDemoData()
    toast('Données de l’organisation réinitialisées')
  } catch (e: any) {
    toast(e.message || 'Erreur')
  }
}
</script>

<template>
  <div class="backup">
    <header>
      <h2>Sauvegarde & restauration</h2>
      <p>
        Sauvegarde isolée pour <strong>{{ store.currentOrg?.name }}</strong>
        ({{ store.currentOrg?.code }}).
      </p>
    </header>

    <section class="panel">
      <h3>Actions</h3>
      <div class="actions">
        <button type="button" @click="manualBackup">Sauvegarder cette organisation</button>
        <button v-if="store.canManageUsers()" type="button" class="secondary" @click="platformBackup">
          Sauvegarder toute la plateforme
        </button>
        <button type="button" class="secondary" @click="restoreAuto">Restaurer l’auto-sauvegarde</button>
        <button type="button" class="danger" @click="resetDemo">Réinitialiser cette organisation</button>
      </div>
      <p class="hint">
        Les sauvegardes d’organisation n’affectent pas les autres organisations présentes sur la plateforme.
      </p>
    </section>

    <section class="panel">
      <h3>Restaurer depuis un fichier</h3>
      <input type="file" accept="application/json,.json" @change="onFile" />
      <textarea v-model="importText" rows="8" placeholder="Collez le JSON de sauvegarde ici…" />
      <button type="button" :disabled="!importText.trim()" @click="restoreManual">Restaurer</button>
    </section>
  </div>
</template>

<style scoped>
.backup { display: grid; gap: 1rem; }
header h2 { margin: 0; font-family: Fraunces, Georgia, serif; color: #0b3d4a; }
header p { margin: 0.35rem 0 0; color: #5d7a84; }
.panel {
  background: white;
  border: 1px solid rgba(18, 48, 58, 0.08);
  border-radius: 1rem;
  padding: 1.1rem;
  display: grid;
  gap: 0.75rem;
}
.actions { display: flex; flex-wrap: wrap; gap: 0.55rem; }
button {
  border: 0;
  background: #0f7f7a;
  color: white;
  border-radius: 0.7rem;
  padding: 0.7rem 1rem;
  font-weight: 700;
  cursor: pointer;
}
button.secondary { background: #134e5a; }
button.danger { background: #b45309; }
button:disabled { opacity: 0.5; }
textarea {
  border: 1px solid #c9d7db;
  border-radius: 0.75rem;
  padding: 0.75rem;
  font: inherit;
  width: 100%;
}
.hint { margin: 0; color: #5d7a84; font-size: 0.9rem; }
</style>
