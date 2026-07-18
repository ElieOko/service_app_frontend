<script setup lang="ts">
import { ref } from 'vue'
import { toast } from 'vue3-toastify'
import { useCfStore } from '../stores/cfStore'
import { formatMoney } from '../utils/helpers'

const store = useCfStore()
const form = ref({
  productId: '',
  priceType: 'vente' as 'achat' | 'vente',
  newPrice: 0,
  reason: '',
})

function submit() {
  try {
    store.updatePrice({ ...form.value })
    toast('Prix mis à jour et historisé')
    form.value = { productId: '', priceType: 'vente', newPrice: 0, reason: '' }
  } catch (e: any) {
    toast(e.message || 'Erreur')
  }
}
</script>

<template>
  <div class="prix">
    <header>
      <h2>Gestion des prix</h2>
      <p>Réservé à l’Administrateur et au Directeur. Chaque modification est journalisée.</p>
    </header>

    <form class="panel" @submit.prevent="submit">
      <label>
        Produit
        <select v-model="form.productId" required>
          <option value="">— Choisir —</option>
          <option v-for="p in store.db.products" :key="p.id" :value="p.id">
            {{ p.name }} (achat {{ formatMoney(p.purchasePrice) }} / vente {{ formatMoney(p.salePrice) }})
          </option>
        </select>
      </label>
      <label>
        Type de prix
        <select v-model="form.priceType">
          <option value="vente">Prix de vente</option>
          <option value="achat">Prix d’achat</option>
        </select>
      </label>
      <label>Nouveau prix <input v-model.number="form.newPrice" type="number" min="0" step="0.01" required /></label>
      <label>Motif <input v-model="form.reason" required /></label>
      <button type="submit">Enregistrer la modification</button>
    </form>

    <section class="panel">
      <h3>Historique des prix</h3>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Produit</th>
            <th>Type</th>
            <th>Ancien</th>
            <th>Nouveau</th>
            <th>Utilisateur</th>
            <th>Motif</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="h in store.db.priceHistory" :key="h.id">
            <td>{{ h.date }} {{ h.time }}</td>
            <td>{{ h.productName }}</td>
            <td>{{ h.priceType }}</td>
            <td>{{ formatMoney(h.oldPrice) }}</td>
            <td>{{ formatMoney(h.newPrice) }}</td>
            <td>{{ h.userName }}</td>
            <td>{{ h.reason }}</td>
          </tr>
        </tbody>
      </table>
    </section>
  </div>
</template>

<style scoped>
.prix { display: grid; gap: 1rem; }
header h2 { margin: 0; font-family: Fraunces, Georgia, serif; color: #0b3d4a; }
header p { margin: 0.35rem 0 0; color: #5d7a84; }
.panel {
  background: white;
  border: 1px solid rgba(18, 48, 58, 0.08);
  border-radius: 1rem;
  padding: 1.1rem;
  display: grid;
  gap: 0.75rem;
  overflow: auto;
}
label { display: grid; gap: 0.3rem; font-weight: 600; }
input, select {
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
table { width: 100%; border-collapse: collapse; min-width: 800px; }
th, td { border-bottom: 1px solid #e5eef0; padding: 0.5rem; text-align: left; font-size: 0.88rem; }
h3 { margin: 0; }
</style>
