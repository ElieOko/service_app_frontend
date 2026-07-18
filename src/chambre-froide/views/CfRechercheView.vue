<script setup lang="ts">
import { computed, ref } from 'vue'
import { useCfStore } from '../stores/cfStore'
import { formatMoney } from '../utils/helpers'

const store = useCfStore()
const q = ref('')
const results = computed(() => store.globalSearch(q.value))
</script>

<template>
  <div class="search">
    <header>
      <h2>Recherche</h2>
      <p>Produits, factures, clients, utilisateurs et ventes.</p>
    </header>

    <input v-model="q" type="search" placeholder="Tapez un mot-clé…" class="q" />

    <section v-if="q.trim()" class="grid">
      <div class="panel">
        <h3>Produits ({{ results.products.length }})</h3>
        <ul>
          <li v-for="p in results.products" :key="p.id">
            {{ p.name }} — stock {{ p.stockCurrent }} · vente {{ formatMoney(p.salePrice) }}
          </li>
        </ul>
      </div>
      <div class="panel">
        <h3>Factures ({{ results.invoices.length }})</h3>
        <ul>
          <li v-for="i in results.invoices" :key="i.id">
            {{ i.number }} — {{ i.status }} · {{ formatMoney(i.total) }}
          </li>
        </ul>
      </div>
      <div class="panel">
        <h3>Clients ({{ results.clients.length }})</h3>
        <ul>
          <li v-for="c in results.clients" :key="c.name">
            {{ c.name }} {{ c.phone ? `· ${c.phone}` : '' }}
          </li>
        </ul>
      </div>
      <div class="panel">
        <h3>Utilisateurs ({{ results.users.length }})</h3>
        <ul>
          <li v-for="u in results.users" :key="u.id">{{ u.fullName }} · {{ u.role }}</li>
        </ul>
      </div>
      <div class="panel wide">
        <h3>Ventes ({{ results.ventes.length }})</h3>
        <ul>
          <li v-for="v in results.ventes" :key="v.id">
            {{ v.number }} / {{ v.receiptNumber }} — {{ formatMoney(v.total) }}
          </li>
        </ul>
      </div>
    </section>
  </div>
</template>

<style scoped>
.search { display: grid; gap: 1rem; }
header h2 { margin: 0; font-family: Fraunces, Georgia, serif; color: #0b3d4a; }
header p { margin: 0.35rem 0 0; color: #5d7a84; }
.q {
  border: 1px solid #c9d7db;
  border-radius: 0.85rem;
  padding: 0.85rem 1rem;
  font: inherit;
  font-size: 1.05rem;
}
.grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.85rem;
}
.panel {
  background: white;
  border: 1px solid rgba(18, 48, 58, 0.08);
  border-radius: 1rem;
  padding: 1rem;
}
.panel.wide { grid-column: 1 / -1; }
h3 { margin: 0 0 0.6rem; font-size: 1rem; }
ul { margin: 0; padding-left: 1.1rem; display: grid; gap: 0.35rem; }
@media (max-width: 800px) {
  .grid { grid-template-columns: 1fr; }
  .panel.wide { grid-column: auto; }
}
</style>
