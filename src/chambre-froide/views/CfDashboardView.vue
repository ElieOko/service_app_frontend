<script setup lang="ts">
import { useCfStore } from '../stores/cfStore'
import { formatMoney } from '../utils/helpers'

const store = useCfStore()
</script>

<template>
  <div class="dash">
    <section class="dash__hero">
      <div>
        <h2>Tableau de bord</h2>
        <p>Ventes, recettes et stocks mis à jour en temps réel.</p>
      </div>
    </section>

    <section class="dash__stats">
      <article>
        <span>Ventes du jour</span>
        <strong>{{ store.ventesDuJour }}</strong>
      </article>
      <article>
        <span>Recettes du jour</span>
        <strong>{{ formatMoney(store.recettesDuJour) }}</strong>
      </article>
      <article>
        <span>Factures du jour</span>
        <strong>{{ store.facturesDuJour }}</strong>
      </article>
      <article>
        <span>Valeur du stock</span>
        <strong>{{ formatMoney(store.valeurTotaleStock) }}</strong>
      </article>
    </section>

    <section class="dash__grid">
      <div class="panel">
        <h3>Produits les plus vendus (aujourd’hui)</h3>
        <ul v-if="store.produitsPlusVendus.length">
          <li v-for="p in store.produitsPlusVendus" :key="p.name">
            <span>{{ p.name }}</span>
            <em>{{ p.qty }} · {{ formatMoney(p.amount) }}</em>
          </li>
        </ul>
        <p v-else class="muted">Aucune vente payée aujourd’hui.</p>
      </div>

      <div class="panel">
        <h3>Stock restant</h3>
        <ul class="stock-list">
          <li v-for="p in store.db.products" :key="p.id">
            <div>
              <strong>{{ p.name }}</strong>
              <small>{{ p.stockCurrent }} {{ p.unit }}</small>
            </div>
            <div class="bar">
              <i :style="{ width: `${Math.min(100, (p.stockCurrent / Math.max(p.stockInitial, 1)) * 100)}%` }" />
            </div>
          </li>
        </ul>
      </div>

      <div class="panel warn">
        <h3>Produits en rupture</h3>
        <ul v-if="store.produitsRupture.length">
          <li v-for="p in store.produitsRupture" :key="p.id">{{ p.name }}</li>
        </ul>
        <p v-else class="muted">Aucune rupture.</p>
      </div>

      <div class="panel alert">
        <h3>Bientôt en rupture</h3>
        <ul v-if="store.produitsBientotRupture.length">
          <li v-for="p in store.produitsBientotRupture" :key="p.id">
            {{ p.name }} <em>({{ p.stockCurrent }})</em>
          </li>
        </ul>
        <p v-else class="muted">Tous les stocks sont sains.</p>
      </div>
    </section>
  </div>
</template>

<style scoped>
.dash { display: flex; flex-direction: column; gap: 1.25rem; }
.dash__hero h2 {
  margin: 0;
  font-family: Fraunces, Georgia, serif;
  font-size: 1.8rem;
  color: #0b3d4a;
}
.dash__hero p { margin: 0.35rem 0 0; color: #5d7a84; }
.dash__stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 0.85rem;
}
.dash__stats article {
  background: white;
  border: 1px solid rgba(18, 48, 58, 0.08);
  border-radius: 1rem;
  padding: 1rem;
}
.dash__stats span { color: #5d7a84; font-size: 0.85rem; }
.dash__stats strong {
  display: block;
  margin-top: 0.35rem;
  font-size: 1.45rem;
  color: #0b3d4a;
}
.dash__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}
.panel {
  background: white;
  border: 1px solid rgba(18, 48, 58, 0.08);
  border-radius: 1rem;
  padding: 1rem 1.1rem;
}
.panel.warn { background: #fff7ed; }
.panel.alert { background: #fffbeb; }
.panel h3 { margin: 0 0 0.75rem; font-size: 1rem; }
ul { list-style: none; margin: 0; padding: 0; display: grid; gap: 0.55rem; }
li { display: flex; justify-content: space-between; gap: 0.75rem; font-size: 0.92rem; }
.muted { color: #7a9098; margin: 0; }
.stock-list li { flex-direction: column; }
.stock-list small { color: #5d7a84; }
.bar {
  height: 6px;
  background: #e5eef0;
  border-radius: 999px;
  overflow: hidden;
}
.bar i {
  display: block;
  height: 100%;
  background: linear-gradient(90deg, #0f7f7a, #2bb5ad);
}
@media (max-width: 900px) {
  .dash__grid { grid-template-columns: 1fr; }
}
</style>
