<script setup lang="ts">
import { useCfStore } from '../stores/cfStore'
import { formatMoney, printHtml } from '../utils/helpers'

const store = useCfStore()

function printStock() {
  const rows = store.db.products
    .map((p) => {
      const s = store.productStats(p)
      return `<tr>
        <td>${p.name}</td>
        <td>${s.stockInitial}</td>
        <td>${s.quantiteEntree}</td>
        <td>${s.quantiteVendue}</td>
        <td>${s.quantiteSortie}</td>
        <td>${s.stockRestant}</td>
        <td>${formatMoney(s.valeurStock)}</td>
      </tr>`
    })
    .join('')
  printHtml(
    'État de stock',
    `<h1>État de stock — Chambre froide</h1>
     <table>
       <thead>
         <tr>
           <th>Produit</th><th>Initial</th><th>Entrées</th><th>Vendues</th>
           <th>Sorties</th><th>Restant</th><th>Valeur</th>
         </tr>
       </thead>
       <tbody>${rows}</tbody>
     </table>`,
  )
}
</script>

<template>
  <div class="stock">
    <header>
      <div>
        <h2>Gestion des stocks</h2>
        <p>Calcul automatique : initial, entrées, ventes, sorties, restant, valeur.</p>
      </div>
      <button type="button" @click="printStock">Imprimer l’état de stock</button>
    </header>

    <section class="panel">
      <table>
        <thead>
          <tr>
            <th>Produit</th>
            <th>Unité</th>
            <th>Stock initial</th>
            <th>Qté entrée</th>
            <th>Qté vendue</th>
            <th>Qté sortie</th>
            <th>Stock restant</th>
            <th>Valeur</th>
            <th>Seuil</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="p in store.db.products"
            :key="p.id"
            :class="{
              rupture: p.stockCurrent <= 0,
              faible: p.stockCurrent > 0 && p.stockCurrent <= p.stockMin,
            }"
          >
            <td>{{ p.name }}</td>
            <td>{{ p.unit }}</td>
            <td>{{ store.productStats(p).stockInitial }}</td>
            <td>{{ store.productStats(p).quantiteEntree }}</td>
            <td>{{ store.productStats(p).quantiteVendue }}</td>
            <td>{{ store.productStats(p).quantiteSortie }}</td>
            <td><strong>{{ store.productStats(p).stockRestant }}</strong></td>
            <td>{{ formatMoney(store.productStats(p).valeurStock) }}</td>
            <td>{{ p.stockMin }}</td>
          </tr>
        </tbody>
      </table>
    </section>

    <section class="panel">
      <h3>Historique des mouvements</h3>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Type</th>
            <th>Produit</th>
            <th>Qté</th>
            <th>Valeur</th>
            <th>Utilisateur</th>
            <th>Motif</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="m in store.db.movements.slice(0, 50)" :key="m.id">
            <td>{{ m.date }} {{ m.time }}</td>
            <td>{{ m.type }}</td>
            <td>{{ m.productName }}</td>
            <td>{{ m.quantity }}</td>
            <td>{{ m.totalValue != null ? formatMoney(m.totalValue) : '—' }}</td>
            <td>{{ m.userName }}</td>
            <td>{{ m.reason || '—' }}</td>
          </tr>
        </tbody>
      </table>
    </section>
  </div>
</template>

<style scoped>
.stock { display: grid; gap: 1rem; }
header {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: start;
  flex-wrap: wrap;
}
header h2 { margin: 0; font-family: Fraunces, Georgia, serif; color: #0b3d4a; }
header p { margin: 0.35rem 0 0; color: #5d7a84; }
.panel {
  background: white;
  border: 1px solid rgba(18, 48, 58, 0.08);
  border-radius: 1rem;
  padding: 1rem;
  overflow: auto;
}
table { width: 100%; border-collapse: collapse; min-width: 900px; }
th, td { border-bottom: 1px solid #e5eef0; padding: 0.55rem 0.4rem; text-align: left; font-size: 0.88rem; }
tr.rupture { background: #fef2f2; }
tr.faible { background: #fffbeb; }
button {
  border: 0;
  background: #0f7f7a;
  color: white;
  border-radius: 0.7rem;
  padding: 0.7rem 1rem;
  font-weight: 700;
  cursor: pointer;
}
h3 { margin: 0 0 0.75rem; }
</style>
