<script setup lang="ts">
import { ref, watch } from 'vue'
import { toast } from 'vue3-toastify'
import { useCfStore } from '../stores/cfStore'

const store = useCfStore()
const form = ref({
  name: store.currentOrg?.name || '',
  phone: store.currentOrg?.phone || '',
  email: store.currentOrg?.email || '',
  address: store.currentOrg?.address || '',
})

watch(
  () => store.currentOrg,
  (org) => {
    if (!org) return
    form.value = {
      name: org.name,
      phone: org.phone || '',
      email: org.email || '',
      address: org.address || '',
    }
  },
  { immediate: true },
)

function save() {
  try {
    store.updateOrganization({ ...form.value })
    toast('Organisation mise à jour')
  } catch (e: any) {
    toast(e.message || 'Erreur')
  }
}
</script>

<template>
  <div class="org">
    <header>
      <h2>Mon organisation</h2>
      <p>Informations de l’espace courant — données isolées des autres organisations.</p>
    </header>

    <section class="panel info">
      <div>
        <span>Code d’accès</span>
        <strong>{{ store.currentOrg?.code }}</strong>
      </div>
      <div>
        <span>Utilisateurs</span>
        <strong>{{ store.db.users.length }}</strong>
      </div>
      <div>
        <span>Produits</span>
        <strong>{{ store.db.products.length }}</strong>
      </div>
      <div>
        <span>Factures</span>
        <strong>{{ store.db.invoices.length }}</strong>
      </div>
    </section>

    <form v-if="store.canManageUsers()" class="panel" @submit.prevent="save">
      <h3>Modifier les informations</h3>
      <label>Nom <input v-model="form.name" required /></label>
      <label>Téléphone <input v-model="form.phone" /></label>
      <label>Email <input v-model="form.email" type="email" /></label>
      <label>Adresse <input v-model="form.address" /></label>
      <button type="submit">Enregistrer</button>
    </form>

    <section v-else class="panel">
      <h3>{{ store.currentOrg?.name }}</h3>
      <p>Téléphone : {{ store.currentOrg?.phone || '—' }}</p>
      <p>Email : {{ store.currentOrg?.email || '—' }}</p>
      <p>Adresse : {{ store.currentOrg?.address || '—' }}</p>
    </section>
  </div>
</template>

<style scoped>
.org { display: grid; gap: 1rem; }
header h2 { margin: 0; font-family: Fraunces, Georgia, serif; color: #0b3d4a; }
header p { margin: 0.35rem 0 0; color: #5d7a84; }
.panel {
  background: white;
  border: 1px solid rgba(18, 48, 58, 0.08);
  border-radius: 1rem;
  padding: 1.1rem;
  display: grid;
  gap: 0.7rem;
}
.panel.info {
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
}
.panel.info span { color: #5d7a84; font-size: 0.85rem; }
.panel.info strong { display: block; margin-top: 0.25rem; font-size: 1.2rem; color: #0b3d4a; }
label { display: grid; gap: 0.3rem; font-weight: 600; }
input {
  border: 1px solid #c9d7db;
  border-radius: 0.65rem;
  padding: 0.6rem 0.7rem;
  font: inherit;
}
button {
  border: 0;
  background: #0f7f7a;
  color: white;
  border-radius: 0.7rem;
  padding: 0.7rem 1rem;
  font-weight: 700;
  cursor: pointer;
  width: fit-content;
}
h3 { margin: 0; }
</style>
