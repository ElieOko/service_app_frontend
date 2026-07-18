<script setup lang="ts">
import { computed, ref } from 'vue'
import { useCfStore } from '../stores/cfStore'
import { downloadBlob, formatMoney, printHtml, toCsv } from '../utils/helpers'

const store = useCfStore()
const period = ref<'jour' | 'semaine' | 'mois' | 'annee'>('jour')

const report = computed(() => {
  if (period.value === 'semaine') return store.weeklyReport()
  if (period.value === 'mois') return store.monthlyReport()
  if (period.value === 'annee') return store.yearlyReport()
  return store.dailyReport()
})

function exportExcel() {
  const rows = [
    {
      periode: period.value,
      ventes: report.value.ventes,
      recettes: report.value.recettes,
      benefices: report.value.benefices,
      stock_vendu: report.value.stockVendu,
      stock_restant: report.value.stockRestant,
      valeur_stock: report.value.valeurStock,
    },
    ...report.value.details.map((d) => ({
      facture: d.number,
      date: d.date,
      total: d.total,
      client: d.clientName || '',
      caissier: d.caissierName || '',
    })),
  ]
  downloadBlob(`rapport-${period.value}.csv`, toCsv(rows), 'text/csv;charset=utf-8')
}

function exportPdf() {
  printHtml(
    `Rapport ${period.value}`,
    `<h1>Rapport ${period.value}</h1>
     <div class="meta">
       Ventes: ${report.value.ventes}<br/>
       Recettes: ${formatMoney(report.value.recettes)}<br/>
       Bénéfices: ${formatMoney(report.value.benefices)}<br/>
       Stock vendu: ${report.value.stockVendu}<br/>
       Stock restant: ${report.value.stockRestant}<br/>
       Valeur stock: ${formatMoney(report.value.valeurStock)}
     </div>
     <h2>Détail des ventes</h2>
     <table>
       <thead><tr><th>Facture</th><th>Date</th><th>Total</th><th>Client</th></tr></thead>
       <tbody>
         ${report.value.details
           .map(
             (d) =>
               `<tr><td>${d.number}</td><td>${d.date}</td><td>${formatMoney(d.total)}</td><td>${d.clientName || '—'}</td></tr>`,
           )
           .join('')}
       </tbody>
     </table>`,
  )
}
</script>

<template>
  <div class="rapports">
    <header>
      <div>
        <h2>Rapports</h2>
        <p>Journalier, hebdomadaire, mensuel, annuel — export PDF et Excel.</p>
      </div>
      <div class="tabs">
        <button
          v-for="p in (['jour', 'semaine', 'mois', 'annee'] as const)"
          :key="p"
          type="button"
          :class="{ active: period === p }"
          @click="period = p"
        >
          {{ p }}
        </button>
      </div>
    </header>

    <section class="stats">
      <article><span>Ventes</span><strong>{{ report.ventes }}</strong></article>
      <article><span>Recettes</span><strong>{{ formatMoney(report.recettes) }}</strong></article>
      <article><span>Bénéfices</span><strong>{{ formatMoney(report.benefices) }}</strong></article>
      <article><span>Stock vendu</span><strong>{{ report.stockVendu }}</strong></article>
      <article><span>Stock restant</span><strong>{{ report.stockRestant }}</strong></article>
    </section>

    <div class="actions">
      <button type="button" @click="exportPdf">Exporter PDF (impression)</button>
      <button type="button" class="secondary" @click="exportExcel">Exporter Excel (CSV)</button>
    </div>

    <section class="panel">
      <h3>Détail</h3>
      <table>
        <thead>
          <tr><th>Facture</th><th>Date</th><th>Total</th><th>Client</th><th>Caissier</th></tr>
        </thead>
        <tbody>
          <tr v-for="d in report.details" :key="d.id">
            <td>{{ d.number }}</td>
            <td>{{ d.date }}</td>
            <td>{{ formatMoney(d.total) }}</td>
            <td>{{ d.clientName || '—' }}</td>
            <td>{{ d.caissierName || '—' }}</td>
          </tr>
        </tbody>
      </table>
    </section>
  </div>
</template>

<style scoped>
.rapports { display: grid; gap: 1rem; }
header {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
  align-items: end;
}
header h2 { margin: 0; font-family: Fraunces, Georgia, serif; color: #0b3d4a; }
header p { margin: 0.35rem 0 0; color: #5d7a84; }
.tabs { display: flex; gap: 0.4rem; flex-wrap: wrap; }
.tabs button, .actions button {
  border: 1px solid #c9d7db;
  background: white;
  border-radius: 999px;
  padding: 0.45rem 0.9rem;
  cursor: pointer;
  font-weight: 600;
  text-transform: capitalize;
}
.tabs button.active, .actions button {
  background: #0f7f7a;
  color: white;
  border-color: #0f7f7a;
}
.actions { display: flex; gap: 0.6rem; flex-wrap: wrap; }
.actions .secondary { background: #134e5a; border-color: #134e5a; }
.stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 0.75rem;
}
.stats article {
  background: white;
  border: 1px solid rgba(18, 48, 58, 0.08);
  border-radius: 1rem;
  padding: 0.9rem;
}
.stats span { color: #5d7a84; font-size: 0.85rem; }
.stats strong { display: block; margin-top: 0.3rem; font-size: 1.25rem; color: #0b3d4a; }
.panel {
  background: white;
  border: 1px solid rgba(18, 48, 58, 0.08);
  border-radius: 1rem;
  padding: 1rem;
  overflow: auto;
}
table { width: 100%; border-collapse: collapse; }
th, td { border-bottom: 1px solid #e5eef0; padding: 0.5rem; text-align: left; font-size: 0.9rem; }
</style>
