<script setup lang="ts">
import { ref } from 'vue'
import { toast } from 'vue3-toastify'
import { useCfStore } from '../stores/cfStore'
import type { CfRole } from '../types'

const store = useCfStore()
const roles: CfRole[] = ['Administrateur', 'Directeur', 'Superviseur', 'Facturier', 'Caissier']

const form = ref({
  id: '' as string | undefined,
  username: '',
  password: '',
  fullName: '',
  role: 'Facturier' as CfRole,
  isActive: true,
})

function edit(u: typeof store.db.users[number]) {
  form.value = {
    id: u.id,
    username: u.username,
    password: u.password,
    fullName: u.fullName,
    role: u.role,
    isActive: u.isActive,
  }
}

function reset() {
  form.value = {
    id: undefined,
    username: '',
    password: '',
    fullName: '',
    role: 'Facturier',
    isActive: true,
  }
}

function submit() {
  try {
    store.upsertUser({
      id: form.value.id,
      username: form.value.username,
      password: form.value.password,
      fullName: form.value.fullName,
      role: form.value.role,
      isActive: form.value.isActive,
    })
    toast('Utilisateur enregistré')
    reset()
  } catch (e: any) {
    toast(e.message || 'Erreur')
  }
}
</script>

<template>
  <div class="users">
    <header>
      <h2>Utilisateurs & sécurité</h2>
      <p>Identifiant, mot de passe et droits selon le rôle.</p>
    </header>

    <form class="panel" @submit.prevent="submit">
      <h3>{{ form.id ? 'Modifier' : 'Nouveau' }} utilisateur</h3>
      <div class="row">
        <label>Nom complet <input v-model="form.fullName" required /></label>
        <label>Identifiant <input v-model="form.username" required /></label>
        <label>Mot de passe <input v-model="form.password" required /></label>
        <label>
          Rôle
          <select v-model="form.role">
            <option v-for="r in roles" :key="r" :value="r">{{ r }}</option>
          </select>
        </label>
        <label class="check"><input v-model="form.isActive" type="checkbox" /> Actif</label>
      </div>
      <div class="actions">
        <button type="submit">Enregistrer</button>
        <button type="button" class="ghost" @click="reset">Annuler</button>
      </div>
    </form>

    <section class="panel">
      <table>
        <thead>
          <tr><th>Nom</th><th>Identifiant</th><th>Rôle</th><th>Statut</th><th></th></tr>
        </thead>
        <tbody>
          <tr v-for="u in store.db.users" :key="u.id">
            <td>{{ u.fullName }}</td>
            <td>{{ u.username }}</td>
            <td>{{ u.role }}</td>
            <td>{{ u.isActive ? 'Actif' : 'Inactif' }}</td>
            <td><button type="button" class="link" @click="edit(u)">Modifier</button></td>
          </tr>
        </tbody>
      </table>
    </section>
  </div>
</template>

<style scoped>
.users { display: grid; gap: 1rem; }
header h2 { margin: 0; font-family: Fraunces, Georgia, serif; color: #0b3d4a; }
header p { margin: 0.35rem 0 0; color: #5d7a84; }
.panel {
  background: white;
  border: 1px solid rgba(18, 48, 58, 0.08);
  border-radius: 1rem;
  padding: 1.1rem;
  overflow: auto;
}
.row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 0.75rem;
}
label { display: grid; gap: 0.3rem; font-weight: 600; font-size: 0.9rem; }
label.check { flex-direction: row; align-items: center; display: flex; gap: 0.45rem; margin-top: 1.5rem; }
input, select {
  border: 1px solid #c9d7db;
  border-radius: 0.65rem;
  padding: 0.6rem 0.7rem;
  font: inherit;
}
.actions { display: flex; gap: 0.5rem; margin-top: 0.85rem; }
button {
  border: 0;
  background: #0f7f7a;
  color: white;
  border-radius: 0.7rem;
  padding: 0.65rem 0.95rem;
  font-weight: 700;
  cursor: pointer;
}
button.ghost { background: transparent; color: #0b3d4a; border: 1px solid #c9d7db; }
button.link { background: transparent; color: #0f7f7a; padding: 0; }
table { width: 100%; border-collapse: collapse; }
th, td { border-bottom: 1px solid #e5eef0; padding: 0.55rem; text-align: left; font-size: 0.9rem; }
</style>
