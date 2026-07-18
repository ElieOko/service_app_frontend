<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue3-toastify'
import { useCfStore } from '../stores/cfStore'
import { normalizeOrgCode } from '../db'

const store = useCfStore()
const router = useRouter()
const loading = ref(false)

const form = ref({
  name: '',
  code: '',
  phone: '',
  email: '',
  address: '',
  adminFullName: '',
  adminUsername: 'admin',
  adminPassword: '',
  withDemoData: false,
})

function onNameBlur() {
  if (!form.value.code && form.value.name) {
    form.value.code = normalizeOrgCode(form.value.name).slice(0, 16)
  }
}

function submit() {
  loading.value = true
  try {
    const res = store.registerOrganization({ ...form.value })
    toast(res.message, { autoClose: 5000 })
    if (res.ok) router.push('/cf')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="reg">
    <form class="reg__card" @submit.prevent="submit">
      <p class="reg__brand">Nouvelle organisation</p>
      <h1>Créer votre espace Chambre froide</h1>
      <p class="reg__hint">
        Vos stocks, factures, utilisateurs et rapports seront totalement isolés des autres organisations.
      </p>

      <h2>Organisation</h2>
      <label>
        Nom de l’organisation
        <input v-model="form.name" required @blur="onNameBlur" placeholder="ex: Froid Express" />
      </label>
      <label>
        Code d’accès (unique)
        <input v-model="form.code" required placeholder="ex: FROID-EXPRESS" />
      </label>
      <div class="row">
        <label>Téléphone <input v-model="form.phone" /></label>
        <label>Email <input v-model="form.email" type="email" /></label>
      </div>
      <label>Adresse <input v-model="form.address" /></label>

      <h2>Administrateur</h2>
      <label>Nom complet <input v-model="form.adminFullName" required /></label>
      <div class="row">
        <label>Identifiant <input v-model="form.adminUsername" required /></label>
        <label>Mot de passe <input v-model="form.adminPassword" type="password" required minlength="4" /></label>
      </div>

      <label class="check">
        <input v-model="form.withDemoData" type="checkbox" />
        Précharger des données de démonstration (produits / fournisseurs)
      </label>

      <button type="submit" :disabled="loading">
        {{ loading ? 'Création…' : 'Créer l’organisation' }}
      </button>
      <router-link class="link" to="/cf/login">Déjà une organisation ? Se connecter</router-link>
    </form>
  </div>
</template>

<style scoped>
.reg {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 1.5rem;
  font-family: 'Source Sans 3', sans-serif;
  background:
    radial-gradient(circle at 80% 10%, rgba(15, 127, 122, 0.16), transparent 40%),
    linear-gradient(160deg, #eaf6f5, #f7f3ea);
}
.reg__card {
  width: min(560px, 100%);
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid rgba(11, 61, 74, 0.08);
  border-radius: 1.25rem;
  padding: 1.75rem;
  box-shadow: 0 20px 50px rgba(11, 61, 74, 0.12);
  display: grid;
  gap: 0.75rem;
}
.reg__brand {
  margin: 0;
  font-family: Fraunces, Georgia, serif;
  font-size: 1.85rem;
  color: #0b3d4a;
}
h1 { margin: 0; font-size: 1.15rem; color: #254550; }
h2 { margin: 0.6rem 0 0; font-size: 0.95rem; color: #0f7f7a; }
.reg__hint { margin: 0; color: #5d7a84; font-size: 0.9rem; line-height: 1.4; }
label { display: grid; gap: 0.3rem; font-weight: 600; font-size: 0.9rem; }
label.check { display: flex; align-items: center; gap: 0.5rem; font-weight: 500; }
.row { display: grid; grid-template-columns: 1fr 1fr; gap: 0.65rem; }
input {
  border: 1px solid #c9d7db;
  border-radius: 0.65rem;
  padding: 0.65rem 0.75rem;
  font: inherit;
}
button {
  border: 0;
  border-radius: 0.75rem;
  padding: 0.85rem;
  background: #0f7f7a;
  color: white;
  font-weight: 700;
  cursor: pointer;
}
.link {
  text-align: center;
  color: #0f7f7a;
  font-weight: 700;
  text-decoration: none;
}
@media (max-width: 600px) {
  .row { grid-template-columns: 1fr; }
}
</style>
