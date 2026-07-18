<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue3-toastify'
import { useCfStore } from '../stores/cfStore'
import { clearAppMode } from '@/stores/appMode'

const store = useCfStore()
const router = useRouter()
const orgCode = ref('DEMO')
const username = ref('caissier')
const password = ref('caissier')
const loading = ref(false)
const showPassword = ref(false)

function login() {
  loading.value = true
  try {
    const res = store.login(orgCode.value.trim(), username.value.trim(), password.value)
    toast(res.message, { autoClose: 4000 })
    if (res.ok) router.push('/cf')
  } finally {
    loading.value = false
  }
}

function back() {
  clearAppMode()
  router.push('/select')
}
</script>

<template>
  <div class="cf-login">
    <form class="cf-login__card" @submit.prevent="login">
      <p class="cf-login__brand">Chambre Froide</p>
      <h1>Connexion organisation</h1>
      <p class="cf-login__hint">
        Code org <strong>DEMO</strong> — identifiants (mot de passe = identifiant) :<br />
        <strong>caissier</strong> · <strong>superviseur</strong> · <strong>directeur</strong> ·
        facturier · admin<br />
        Autre org : <strong>FROIDPLUS</strong> / admin / admin
      </p>

      <label>
        Code organisation
        <input v-model="orgCode" type="text" autocomplete="organization" required placeholder="ex: DEMO" />
      </label>
      <label>
        Identifiant
        <input v-model="username" type="text" autocomplete="username" required />
      </label>
      <label>
        Mot de passe
        <input
          v-model="password"
          :type="showPassword ? 'text' : 'password'"
          autocomplete="current-password"
          required
        />
      </label>
      <label class="cf-login__check">
        <input v-model="showPassword" type="checkbox" /> Afficher le mot de passe
      </label>

      <button type="submit" :disabled="loading">
        {{ loading ? 'Connexion…' : 'Entrer dans mon organisation' }}
      </button>
      <router-link class="cf-login__link" to="/cf/register-org">
        Créer une nouvelle organisation
      </router-link>
      <button type="button" class="ghost" @click="back">Retour au choix de module</button>
    </form>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,700&family=Source+Sans+3:wght@400;600;700&display=swap');

.cf-login {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 1.5rem;
  font-family: 'Source Sans 3', sans-serif;
  background:
    radial-gradient(circle at 20% 20%, rgba(15, 127, 122, 0.18), transparent 40%),
    linear-gradient(160deg, #eaf6f5, #f7f3ea);
}

.cf-login__card {
  width: min(460px, 100%);
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid rgba(11, 61, 74, 0.08);
  border-radius: 1.25rem;
  padding: 1.75rem;
  box-shadow: 0 20px 50px rgba(11, 61, 74, 0.12);
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.cf-login__brand {
  margin: 0;
  font-family: Fraunces, Georgia, serif;
  font-size: 2rem;
  color: #0b3d4a;
}

h1 {
  margin: 0;
  font-size: 1.25rem;
  color: #254550;
}

.cf-login__hint {
  margin: 0;
  font-size: 0.85rem;
  color: #5d7a84;
  line-height: 1.45;
}

label {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  font-weight: 600;
  font-size: 0.9rem;
}

input[type='text'],
input[type='password'] {
  border: 1px solid #c9d7db;
  border-radius: 0.65rem;
  padding: 0.7rem 0.8rem;
  font: inherit;
}

.cf-login__check {
  flex-direction: row;
  align-items: center;
  font-weight: 500;
}

button {
  border: 0;
  border-radius: 0.75rem;
  padding: 0.8rem;
  background: #0f7f7a;
  color: white;
  font-weight: 700;
  cursor: pointer;
}

button.ghost {
  background: transparent;
  color: #0b3d4a;
  border: 1px solid #c9d7db;
}

.cf-login__link {
  text-align: center;
  color: #0f7f7a;
  font-weight: 700;
  text-decoration: none;
}
</style>
