<script setup lang="ts">
import { computed, ref } from 'vue'
import { toast } from 'vue3-toastify'
import { useCfStore } from '../stores/cfStore'
import { formatMoney, printHtml } from '../utils/helpers'
import type { CfInvoice } from '../types'

const store = useCfStore()
const query = ref('')
const selectedId = ref('')

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()
  return store.unpaidInvoices.filter(
    (i) =>
      !q ||
      i.number.toLowerCase().includes(q) ||
      i.clientName?.toLowerCase().includes(q) ||
      i.clientPhone?.includes(q),
  )
})

const selected = computed(() => store.db.invoices.find((i) => i.id === selectedId.value))

function printReceipt(inv: CfInvoice) {
  const rows = inv.lines
    .map(
      (l) =>
        `<tr><td>${l.productName}</td><td>${l.quantity}</td><td>${formatMoney(l.amount)}</td></tr>`,
    )
    .join('')
  printHtml(
    `Reçu ${inv.receiptNumber}`,
    `<h1>Reçu de paiement</h1>
     <div class="meta">
       N° reçu: ${inv.receiptNumber}<br/>
       Facture: ${inv.number}<br/>
       Date paiement: ${new Date(inv.paidAt!).toLocaleString('fr-FR')}<br/>
       Caissier: ${inv.caissierName}<br/>
       Client: ${inv.clientName || '—'}
     </div>
     <table>
       <thead><tr><th>Produit</th><th>Qté</th><th>Montant</th></tr></thead>
       <tbody>${rows}</tbody>
     </table>
     <p class="total">Montant payé: ${formatMoney(inv.total)}</p>`,
  )
}

function pay() {
  if (!selectedId.value) {
    toast('Sélectionnez une facture')
    return
  }
  try {
    const inv = store.payInvoice(selectedId.value)
    toast(`Paiement validé — ${inv.receiptNumber}`)
    printReceipt(inv)
    selectedId.value = ''
  } catch (e: any) {
    toast(e.message || 'Erreur')
  }
}

function cancel() {
  if (!selectedId.value) return
  const reason = prompt('Motif d’annulation ?') || 'Sans motif'
  try {
    store.cancelInvoice(selectedId.value, reason)
    toast('Facture annulée')
    selectedId.value = ''
  } catch (e: any) {
    toast(e.message || 'Erreur')
  }
}
</script>

<template>
  <div class="caisse">
    <header>
      <h2>Caisse — Étape 3 & 4</h2>
      <p>Retrouvez la facture, validez le paiement, imprimez le reçu. Le stock diminue automatiquement.</p>
    </header>

    <section class="panel">
      <label>
        Rechercher une facture
        <input v-model="query" type="search" placeholder="N° facture, client, téléphone…" />
      </label>
      <div class="list">
        <button
          v-for="inv in filtered"
          :key="inv.id"
          type="button"
          class="item"
          :class="{ active: selectedId === inv.id }"
          @click="selectedId = inv.id"
        >
          <strong>{{ inv.number }}</strong>
          <span>{{ inv.date }} {{ inv.time }} · {{ formatMoney(inv.total) }}</span>
          <small>{{ inv.clientName || 'Client anonyme' }} · {{ inv.facturierName }}</small>
        </button>
        <p v-if="!filtered.length" class="muted">Aucune facture en attente.</p>
      </div>
    </section>

    <section v-if="selected" class="panel detail">
      <h3>{{ selected.number }}</h3>
      <p>{{ selected.date }} {{ selected.time }} — Facturier: {{ selected.facturierName }}</p>
      <table>
        <thead>
          <tr><th>Produit</th><th>Qté</th><th>P.U.</th><th>Montant</th></tr>
        </thead>
        <tbody>
          <tr v-for="(l, idx) in selected.lines" :key="idx">
            <td>{{ l.productName }}</td>
            <td>{{ l.quantity }}</td>
            <td>{{ formatMoney(l.unitPrice) }}</td>
            <td>{{ formatMoney(l.amount) }}</td>
          </tr>
        </tbody>
      </table>
      <p class="total">Total: {{ formatMoney(selected.total) }}</p>
      <div class="actions">
        <button type="button" @click="pay">Recevoir le paiement & imprimer le reçu</button>
        <button type="button" class="danger" @click="cancel">Annuler la facture</button>
      </div>
    </section>
  </div>
</template>

<style scoped>
.caisse { display: grid; gap: 1rem; }
header h2 { margin: 0; font-family: Fraunces, Georgia, serif; color: #0b3d4a; }
header p { margin: 0.35rem 0 0; color: #5d7a84; }
.panel {
  background: white;
  border: 1px solid rgba(18, 48, 58, 0.08);
  border-radius: 1rem;
  padding: 1.1rem;
}
label { display: grid; gap: 0.35rem; font-weight: 600; }
input {
  border: 1px solid #c9d7db;
  border-radius: 0.65rem;
  padding: 0.65rem 0.75rem;
  font: inherit;
}
.list { margin-top: 0.85rem; display: grid; gap: 0.5rem; max-height: 320px; overflow: auto; }
.item {
  text-align: left;
  border: 1px solid #d7e4e7;
  background: #f8fbfb;
  border-radius: 0.75rem;
  padding: 0.75rem;
  cursor: pointer;
  display: grid;
  gap: 0.15rem;
}
.item.active { border-color: #0f7f7a; background: #e8f7f6; }
.item span, .item small { color: #5d7a84; font-size: 0.85rem; }
table { width: 100%; border-collapse: collapse; margin: 0.75rem 0; }
th, td { border-bottom: 1px solid #e5eef0; padding: 0.5rem; text-align: left; }
.total { font-weight: 700; font-size: 1.1rem; }
.actions { display: flex; flex-wrap: wrap; gap: 0.6rem; }
button {
  border: 0;
  background: #0f7f7a;
  color: white;
  border-radius: 0.7rem;
  padding: 0.7rem 1rem;
  font-weight: 700;
  cursor: pointer;
}
button.danger { background: #b45309; }
.muted { color: #7a9098; }
</style>
