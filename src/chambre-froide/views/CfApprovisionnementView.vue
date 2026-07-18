<script setup lang="ts">
import { ref } from 'vue'
import { toast } from 'vue3-toastify'
import { useCfStore } from '../stores/cfStore'

const store = useCfStore()

const newProduct = ref({
  name: '',
  unit: 'kg',
  purchasePrice: 0,
  salePrice: 0,
  stockInitial: 0,
  stockMin: 5,
  supplier: '',
})

const supply = ref({
  productId: '',
  quantity: 0,
  purchasePrice: 0,
  supplier: '',
})

const adjust = ref({
  productId: '',
  type: 'correction' as 'correction' | 'perte' | 'perime',
  quantity: 0,
  reason: '',
})

function createProduct() {
  try {
    store.addProduct({ ...newProduct.value })
    toast('Produit enregistré')
    newProduct.value = {
      name: '',
      unit: 'kg',
      purchasePrice: 0,
      salePrice: 0,
      stockInitial: 0,
      stockMin: 5,
      supplier: '',
    }
  } catch (e: any) {
    toast(e.message || 'Erreur')
  }
}

function doSupply() {
  try {
    store.supplyStock({ ...supply.value })
    toast('Approvisionnement enregistré')
    supply.value = { productId: '', quantity: 0, purchasePrice: 0, supplier: '' }
  } catch (e: any) {
    toast(e.message || 'Erreur')
  }
}

function doAdjust() {
  try {
    store.stockAdjustment({ ...adjust.value })
    toast('Mouvement historisé')
    adjust.value = { productId: '', type: 'correction', quantity: 0, reason: '' }
  } catch (e: any) {
    toast(e.message || 'Erreur')
  }
}
</script>

<template>
  <div class="appro">
    <header>
      <h2>Approvisionnement</h2>
      <p>Nouveaux produits, arrivages, corrections, pertes et produits périmés — tout est historisé.</p>
    </header>

    <section class="grid">
      <form class="panel" @submit.prevent="createProduct">
        <h3>Nouveau produit</h3>
        <label>Nom <input v-model="newProduct.name" required /></label>
        <label>Unité <input v-model="newProduct.unit" required /></label>
        <label>Prix d’achat <input v-model.number="newProduct.purchasePrice" type="number" min="0" step="0.01" /></label>
        <label>Prix de vente <input v-model.number="newProduct.salePrice" type="number" min="0" step="0.01" /></label>
        <label>Stock initial <input v-model.number="newProduct.stockInitial" type="number" min="0" /></label>
        <label>Seuil alerte <input v-model.number="newProduct.stockMin" type="number" min="0" /></label>
        <label>Fournisseur <input v-model="newProduct.supplier" /></label>
        <button type="submit">Enregistrer le produit</button>
      </form>

      <form class="panel" @submit.prevent="doSupply">
        <h3>Nouvel arrivage</h3>
        <label>
          Produit
          <select v-model="supply.productId" required>
            <option value="">— Choisir —</option>
            <option v-for="p in store.db.products" :key="p.id" :value="p.id">{{ p.name }}</option>
          </select>
        </label>
        <label>Quantité <input v-model.number="supply.quantity" type="number" min="1" required /></label>
        <label>Prix d’achat <input v-model.number="supply.purchasePrice" type="number" min="0" step="0.01" required /></label>
        <label>Fournisseur <input v-model="supply.supplier" required /></label>
        <p class="hint">Valeur totale: {{ (supply.quantity * supply.purchasePrice).toFixed(2) }}</p>
        <button type="submit">Enregistrer l’entrée</button>
      </form>

      <form class="panel" @submit.prevent="doAdjust">
        <h3>Correction / Perte / Périmé</h3>
        <label>
          Produit
          <select v-model="adjust.productId" required>
            <option value="">— Choisir —</option>
            <option v-for="p in store.db.products" :key="p.id" :value="p.id">{{ p.name }}</option>
          </select>
        </label>
        <label>
          Type
          <select v-model="adjust.type">
            <option value="correction">Correction (+/-)</option>
            <option value="perte">Perte</option>
            <option value="perime">Produit périmé</option>
          </select>
        </label>
        <label>
          Quantité
          <input v-model.number="adjust.quantity" type="number" required />
          <small v-if="adjust.type === 'correction'">Utilisez un nombre négatif pour diminuer.</small>
        </label>
        <label>Motif <input v-model="adjust.reason" required /></label>
        <button type="submit">Historiser l’opération</button>
      </form>
    </section>
  </div>
</template>

<style scoped>
.appro { display: grid; gap: 1rem; }
header h2 { margin: 0; font-family: Fraunces, Georgia, serif; color: #0b3d4a; }
header p { margin: 0.35rem 0 0; color: #5d7a84; }
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1rem;
}
.panel {
  background: white;
  border: 1px solid rgba(18, 48, 58, 0.08);
  border-radius: 1rem;
  padding: 1.1rem;
  display: grid;
  gap: 0.7rem;
}
h3 { margin: 0; }
label { display: grid; gap: 0.3rem; font-weight: 600; font-size: 0.9rem; }
input, select {
  border: 1px solid #c9d7db;
  border-radius: 0.65rem;
  padding: 0.6rem 0.7rem;
  font: inherit;
}
small, .hint { color: #5d7a84; font-weight: 500; }
button {
  border: 0;
  background: #0f7f7a;
  color: white;
  border-radius: 0.7rem;
  padding: 0.7rem 1rem;
  font-weight: 700;
  cursor: pointer;
}
</style>
