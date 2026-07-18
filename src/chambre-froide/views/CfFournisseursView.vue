<script setup lang="ts">
import { computed, ref } from 'vue'
import { toast } from 'vue3-toastify'
import { useCfStore } from '../stores/cfStore'
import { formatMoney } from '../utils/helpers'

const store = useCfStore()

const form = ref({
  id: undefined as string | undefined,
  name: '',
  phone: '',
  address: '',
  notes: '',
  isActive: true,
})

const query = ref('')

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()
  return [...store.db.suppliers]
    .filter((s) =>
      !q ||
      s.name.toLowerCase().includes(q) ||
      s.phone?.includes(q) ||
      s.address?.toLowerCase().includes(q),
    )
    .sort((a, b) => a.name.localeCompare(b.name, 'fr'))
})

function edit(s: (typeof store.db.suppliers)[number]) {
  form.value = {
    id: s.id,
    name: s.name,
    phone: s.phone || '',
    address: s.address || '',
    notes: s.notes || '',
    isActive: s.isActive,
  }
}

function reset() {
  form.value = {
    id: undefined,
    name: '',
    phone: '',
    address: '',
    notes: '',
    isActive: true,
  }
}

function submit() {
  try {
    store.upsertSupplier({
      id: form.value.id,
      name: form.value.name,
      phone: form.value.phone,
      address: form.value.address,
      notes: form.value.notes,
      isActive: form.value.isActive,
    })
    toast(form.value.id ? 'Fournisseur mis à jour' : 'Fournisseur ajouté')
    reset()
  } catch (e: any) {
    toast(e.message || 'Erreur')
  }
}
</script>

<template>
  <div class="fournisseurs">
    <header>
      <div>
        <h2>Fournisseurs</h2>
        <p>Liste des fournisseurs, contacts et volumes d’approvisionnement.</p>
      </div>
    </header>

    <form v-if="store.canSuperviseStock()" class="panel form" @submit.prevent="submit">
      <h3>{{ form.id ? 'Modifier' : 'Nouveau' }} fournisseur</h3>
      <div class="row">
        <label>Nom <input v-model="form.name" required /></label>
        <label>Téléphone <input v-model="form.phone" /></label>
        <label>Adresse <input v-model="form.address" /></label>
        <label>Notes <input v-model="form.notes" /></label>
        <label class="check"><input v-model="form.isActive" type="checkbox" /> Actif</label>
      </div>
      <div class="actions">
        <button type="submit">Enregistrer</button>
        <button type="button" class="ghost" @click="reset">Annuler</button>
      </div>
    </form>

    <section class="panel">
      <div class="list-head">
        <h3>Liste ({{ filtered.length }})</h3>
        <input v-model="query" type="search" placeholder="Rechercher un fournisseur…" />
      </div>
      <table>
        <thead>
          <tr>
            <th>Nom</th>
            <th>Téléphone</th>
            <th>Adresse</th>
            <th>Produits</th>
            <th>Entrées</th>
            <th>Qté livrée</th>
            <th>Valeur</th>
            <th>Statut</th>
            <th v-if="store.canSuperviseStock()"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="s in filtered" :key="s.id">
            <td><strong>{{ s.name }}</strong></td>
            <td>{{ s.phone || '—' }}</td>
            <td>{{ s.address || '—' }}</td>
            <td>{{ store.supplierStats(s).productCount }}</td>
            <td>{{ store.supplierStats(s).entriesCount }}</td>
            <td>{{ store.supplierStats(s).totalQty }}</td>
            <td>{{ formatMoney(store.supplierStats(s).totalValue) }}</td>
            <td>{{ s.isActive ? 'Actif' : 'Inactif' }}</td>
            <td v-if="store.canSuperviseStock()">
              <button type="button" class="link" @click="edit(s)">Modifier</button>
            </td>
          </tr>
          <tr v-if="!filtered.length">
            <td :colspan="store.canSuperviseStock() ? 9 : 8" class="muted">Aucun fournisseur.</td>
          </tr>
        </tbody>
      </table>
    </section>
  </div>
</template>

<style scoped>
.fournisseurs { display: grid; gap: 1rem; }
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
label.check {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  margin-top: 1.4rem;
}
input, select {
  border: 1px solid #c9d7db;
  border-radius: 0.65rem;
  padding: 0.6rem 0.7rem;
  font: inherit;
}
.actions, .list-head {
  display: flex;
  gap: 0.55rem;
  flex-wrap: wrap;
  align-items: center;
  margin-top: 0.85rem;
}
.list-head {
  justify-content: space-between;
  margin-top: 0;
  margin-bottom: 0.75rem;
}
.list-head input { min-width: 220px; }
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
table { width: 100%; border-collapse: collapse; min-width: 900px; }
th, td { border-bottom: 1px solid #e5eef0; padding: 0.55rem; text-align: left; font-size: 0.88rem; }
h3 { margin: 0; }
.muted { color: #7a9098; }
</style>
