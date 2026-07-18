<script setup lang="ts">
import { computed, ref } from 'vue'
import { useCfStore } from '../stores/cfStore'
import { formatMoney, nowParts, printHtml } from '../utils/helpers'

const store = useCfStore()
const tab = ref<'stock' | 'sorties'>('sorties')
const showSortiePreview = ref(false)

const totalSortiesQty = computed(() =>
  store.etatSorties.reduce((s, m) => s + m.quantity, 0),
)
const totalSortiesValeur = computed(() =>
  store.etatSorties.reduce((s, m) => s + (m.totalValue ?? m.quantity * (m.unitPrice ?? 0)), 0),
)

function typeLabel(type: string) {
  if (type === 'sortie_vente') return 'Vente'
  if (type === 'perte') return 'Perte'
  if (type === 'perime') return 'Périmé'
  return type
}

function buildSortieHtml() {
  const { date, time } = nowParts()
  const detailRows = store.etatSorties
    .map(
      (m) => `<tr>
        <td>${m.date} ${m.time}</td>
        <td>${typeLabel(m.type)}</td>
        <td>${m.productName}</td>
        <td>${m.quantity}</td>
        <td>${formatMoney(m.totalValue ?? m.quantity * (m.unitPrice ?? 0))}</td>
        <td>${m.userName}</td>
        <td>${m.reason || '—'}</td>
      </tr>`,
    )
    .join('')
  const resumeRows = store.etatSortiesResume
    .map(
      (r) => `<tr>
        <td>${r.productName}</td>
        <td>${r.quantite}</td>
        <td>${formatMoney(r.valeur)}</td>
      </tr>`,
    )
    .join('')

  return `<h1>État des sorties — Chambre froide</h1>
    <div class="meta">Émis le ${date} à ${time}<br/>
      Total sorties: ${totalSortiesQty.value} · Valeur: ${formatMoney(totalSortiesValeur.value)}
    </div>
    <h2>Résumé par produit</h2>
    <table>
      <thead><tr><th>Produit</th><th>Quantité sortie</th><th>Valeur</th></tr></thead>
      <tbody>${resumeRows || '<tr><td colspan="3">Aucune sortie</td></tr>'}</tbody>
    </table>
    <h2>Détail des mouvements</h2>
    <table>
      <thead>
        <tr>
          <th>Date</th><th>Type</th><th>Produit</th><th>Qté</th>
          <th>Valeur</th><th>Utilisateur</th><th>Motif</th>
        </tr>
      </thead>
      <tbody>${detailRows || '<tr><td colspan="7">Aucune sortie</td></tr>'}</tbody>
    </table>`
}

function openSortiePreview() {
  tab.value = 'sorties'
  showSortiePreview.value = true
}

function printFromPreview() {
  printHtml('État des sorties', buildSortieHtml())
}

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
        <p>Consultez l’état des sorties à l’écran avant de l’imprimer.</p>
      </div>
      <div class="header-actions">
        <button type="button" class="secondary" @click="printStock">Imprimer l’état de stock</button>
        <button type="button" @click="openSortiePreview">Voir l’état des sorties</button>
      </div>
    </header>

    <div class="tabs">
      <button type="button" :class="{ active: tab === 'sorties' }" @click="tab = 'sorties'">
        État des sorties
      </button>
      <button type="button" :class="{ active: tab === 'stock' }" @click="tab = 'stock'">
        Stock actuel
      </button>
    </div>

    <section v-if="tab === 'sorties'" class="panel sortie-panel">
      <div class="sortie-head">
        <div>
          <h3>État des sorties</h3>
          <p class="muted">
            {{ store.etatSorties.length }} mouvement(s) · Qté {{ totalSortiesQty }} ·
            Valeur {{ formatMoney(totalSortiesValeur) }}
          </p>
        </div>
        <button type="button" @click="openSortiePreview">Aperçu avant impression</button>
      </div>

      <h4>Résumé par produit</h4>
      <table>
        <thead>
          <tr>
            <th>Produit</th>
            <th>Quantité sortie</th>
            <th>Valeur</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="r in store.etatSortiesResume" :key="r.productId">
            <td>{{ r.productName }}</td>
            <td><strong>{{ r.quantite }}</strong></td>
            <td>{{ formatMoney(r.valeur) }}</td>
          </tr>
          <tr v-if="!store.etatSortiesResume.length">
            <td colspan="3" class="muted">Aucune sortie enregistrée pour le moment.</td>
          </tr>
        </tbody>
      </table>

      <h4>Détail</h4>
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
          <tr v-for="m in store.etatSorties" :key="m.id">
            <td>{{ m.date }} {{ m.time }}</td>
            <td>{{ typeLabel(m.type) }}</td>
            <td>{{ m.productName }}</td>
            <td>{{ m.quantity }}</td>
            <td>{{ formatMoney(m.totalValue ?? m.quantity * (m.unitPrice ?? 0)) }}</td>
            <td>{{ m.userName }}</td>
            <td>{{ m.reason || '—' }}</td>
          </tr>
          <tr v-if="!store.etatSorties.length">
            <td colspan="7" class="muted">Aucune sortie à afficher.</td>
          </tr>
        </tbody>
      </table>
    </section>

    <section v-else class="panel">
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

    <div v-if="showSortiePreview" class="modal" @click.self="showSortiePreview = false">
      <div class="modal__card">
        <div class="modal__toolbar">
          <strong>Aperçu — État des sorties</strong>
          <div class="header-actions">
            <button type="button" @click="printFromPreview">Imprimer</button>
            <button type="button" class="secondary" @click="showSortiePreview = false">Fermer</button>
          </div>
        </div>
        <div class="modal__body">
          <h3>État des sorties — Chambre froide</h3>
          <p class="muted">
            Total: {{ totalSortiesQty }} · Valeur {{ formatMoney(totalSortiesValeur) }}
          </p>
          <table>
            <thead>
              <tr><th>Produit</th><th>Qté sortie</th><th>Valeur</th></tr>
            </thead>
            <tbody>
              <tr v-for="r in store.etatSortiesResume" :key="'p-' + r.productId">
                <td>{{ r.productName }}</td>
                <td>{{ r.quantite }}</td>
                <td>{{ formatMoney(r.valeur) }}</td>
              </tr>
              <tr v-if="!store.etatSortiesResume.length">
                <td colspan="3">Aucune sortie</td>
              </tr>
            </tbody>
          </table>
          <h4>Détail</h4>
          <table>
            <thead>
              <tr>
                <th>Date</th><th>Type</th><th>Produit</th><th>Qté</th><th>Valeur</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="m in store.etatSorties" :key="'d-' + m.id">
                <td>{{ m.date }} {{ m.time }}</td>
                <td>{{ typeLabel(m.type) }}</td>
                <td>{{ m.productName }}</td>
                <td>{{ m.quantity }}</td>
                <td>{{ formatMoney(m.totalValue ?? m.quantity * (m.unitPrice ?? 0)) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.stock { display: grid; gap: 1rem; }
header {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: flex-start;
  flex-wrap: wrap;
}
header h2 { margin: 0; font-family: Fraunces, Georgia, serif; color: #0b3d4a; }
header p { margin: 0.35rem 0 0; color: #5d7a84; }
.header-actions, .sortie-head, .modal__toolbar {
  display: flex;
  gap: 0.55rem;
  flex-wrap: wrap;
  align-items: center;
}
.sortie-head { justify-content: space-between; margin-bottom: 0.75rem; }
.tabs { display: flex; gap: 0.4rem; flex-wrap: wrap; }
.tabs button {
  background: white;
  color: #0b3d4a;
  border: 1px solid #c9d7db;
  border-radius: 999px;
  padding: 0.45rem 0.95rem;
}
.tabs button.active {
  background: #0f7f7a;
  color: white;
  border-color: #0f7f7a;
}
.panel {
  background: white;
  border: 1px solid rgba(18, 48, 58, 0.08);
  border-radius: 1rem;
  padding: 1rem;
  overflow: auto;
}
.sortie-panel { border-color: rgba(15, 127, 122, 0.25); }
table { width: 100%; border-collapse: collapse; min-width: 720px; }
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
button.secondary { background: #134e5a; }
h3, h4 { margin: 0 0 0.75rem; color: #0b3d4a; }
h4 { margin-top: 1.1rem; font-size: 0.95rem; }
.muted { color: #7a9098; margin: 0.25rem 0 0; }
.modal {
  position: fixed;
  inset: 0;
  background: rgba(10, 30, 36, 0.45);
  z-index: 50;
  display: grid;
  place-items: center;
  padding: 1rem;
}
.modal__card {
  width: min(920px, 100%);
  max-height: 90vh;
  background: white;
  border-radius: 1rem;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 24px 60px rgba(11, 61, 74, 0.25);
}
.modal__toolbar {
  justify-content: space-between;
  padding: 0.85rem 1rem;
  background: #0b3d4a;
  color: white;
}
.modal__toolbar button.secondary { background: rgba(255,255,255,0.15); }
.modal__body { padding: 1rem; overflow: auto; }
</style>
