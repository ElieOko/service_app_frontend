<script setup lang="ts">
import { computed, ref } from 'vue'
import { toast } from 'vue3-toastify'
import { useCfStore } from '../stores/cfStore'
import { formatMoney, printHtml } from '../utils/helpers'
import type { CfInvoice } from '../types'

const store = useCfStore()
const productId = ref('')
const quantity = ref(1)
const clientName = ref('')
const clientPhone = ref('')
const cart = ref<Array<{ productId: string; quantity: number }>>([])
const lastInvoice = ref<CfInvoice | null>(null)

const selectedProduct = computed(() =>
  store.db.products.find((p) => p.id === productId.value),
)

const cartLines = computed(() =>
  cart.value.map((c) => {
    const p = store.db.products.find((x) => x.id === c.productId)!
    return {
      ...c,
      name: p.name,
      unitPrice: p.salePrice,
      amount: c.quantity * p.salePrice,
      unit: p.unit,
      stock: p.stockCurrent,
    }
  }),
)

const total = computed(() => cartLines.value.reduce((s, l) => s + l.amount, 0))

function addLine() {
  if (!productId.value || quantity.value <= 0) {
    toast('Sélectionnez un produit et une quantité valide')
    return
  }
  const product = selectedProduct.value
  if (!product) return
  const existing = cart.value.find((c) => c.productId === productId.value)
  const nextQty = (existing?.quantity ?? 0) + quantity.value
  if (nextQty > product.stockCurrent) {
    toast(`Stock insuffisant (${product.stockCurrent} disponibles)`)
    return
  }
  if (existing) existing.quantity = nextQty
  else cart.value.push({ productId: productId.value, quantity: quantity.value })
  quantity.value = 1
}

function removeLine(id: string) {
  cart.value = cart.value.filter((c) => c.productId !== id)
}

function printInvoice(inv: CfInvoice) {
  const rows = inv.lines
    .map(
      (l) =>
        `<tr><td>${l.productName}</td><td>${l.quantity}</td><td>${formatMoney(l.unitPrice)}</td><td>${formatMoney(l.amount)}</td></tr>`,
    )
    .join('')
  printHtml(
    `Facture ${inv.number}`,
    `<h1>Facture ${inv.number}</h1>
     <div class="meta">
       Date: ${inv.date}<br/>
       Heure: ${inv.time}<br/>
       Client: ${inv.clientName || '—'}<br/>
       Téléphone: ${inv.clientPhone || '—'}<br/>
       Facturier: ${inv.facturierName}
     </div>
     <table>
       <thead><tr><th>Produit</th><th>Qté</th><th>P.U.</th><th>Montant</th></tr></thead>
       <tbody>${rows}</tbody>
     </table>
     <p class="total">Total général: ${formatMoney(inv.total)}</p>`,
  )
}

function submit() {
  try {
    const inv = store.createInvoice({
      lines: cart.value,
      clientName: clientName.value || undefined,
      clientPhone: clientPhone.value || undefined,
    })
    lastInvoice.value = inv
    cart.value = []
    clientName.value = ''
    clientPhone.value = ''
    toast(`Facture ${inv.number} créée`)
    printInvoice(inv)
  } catch (e: any) {
    toast(e.message || 'Erreur')
  }
}
</script>

<template>
  <div class="vente">
    <header>
      <h2>Facturation — Étape 1 & 2</h2>
      <p>Recherchez un produit, saisissez la quantité, générez et imprimez la facture.</p>
    </header>

    <section class="panel form">
      <div class="row">
        <label>
          Produit
          <select v-model="productId">
            <option value="">— Choisir —</option>
            <option v-for="p in store.db.products" :key="p.id" :value="p.id">
              {{ p.name }} (stock {{ p.stockCurrent }})
            </option>
          </select>
        </label>
        <label>
          Quantité
          <input v-model.number="quantity" type="number" min="1" />
        </label>
        <div class="preview" v-if="selectedProduct">
          <span>P.U. {{ formatMoney(selectedProduct.salePrice) }}</span>
          <strong>Montant {{ formatMoney(selectedProduct.salePrice * quantity) }}</strong>
        </div>
      </div>
      <button type="button" class="secondary" @click="addLine">Ajouter au panier</button>

      <div class="row">
        <label>
          Nom du client (facultatif)
          <input v-model="clientName" type="text" />
        </label>
        <label>
          Téléphone (facultatif)
          <input v-model="clientPhone" type="text" />
        </label>
      </div>
    </section>

    <section class="panel">
      <h3>Panier · Total général {{ formatMoney(total) }}</h3>
      <table v-if="cartLines.length">
        <thead>
          <tr>
            <th>Produit</th>
            <th>Qté</th>
            <th>P.U.</th>
            <th>Montant</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="l in cartLines" :key="l.productId">
            <td>{{ l.name }}</td>
            <td>{{ l.quantity }}</td>
            <td>{{ formatMoney(l.unitPrice) }}</td>
            <td>{{ formatMoney(l.amount) }}</td>
            <td><button type="button" class="link" @click="removeLine(l.productId)">Retirer</button></td>
          </tr>
        </tbody>
      </table>
      <p v-else class="muted">Aucun article.</p>
      <button type="button" :disabled="!cartLines.length" @click="submit">
        Générer & imprimer la facture
      </button>
    </section>

    <section v-if="lastInvoice" class="panel success">
      <h3>Dernière facture : {{ lastInvoice.number }}</h3>
      <p>Statut: en attente de paiement à la caisse.</p>
      <button type="button" class="secondary" @click="printInvoice(lastInvoice)">Réimprimer</button>
    </section>
  </div>
</template>

<style scoped>
.vente { display: grid; gap: 1rem; }
header h2 { margin: 0; font-family: Fraunces, Georgia, serif; color: #0b3d4a; }
header p { margin: 0.35rem 0 0; color: #5d7a84; }
.panel {
  background: white;
  border: 1px solid rgba(18, 48, 58, 0.08);
  border-radius: 1rem;
  padding: 1.1rem;
}
.panel.success { background: #ecfdf5; }
.row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 0.85rem;
  margin-bottom: 0.85rem;
}
label { display: grid; gap: 0.35rem; font-weight: 600; font-size: 0.9rem; }
input, select {
  border: 1px solid #c9d7db;
  border-radius: 0.65rem;
  padding: 0.65rem 0.75rem;
  font: inherit;
}
.preview {
  display: flex;
  flex-direction: column;
  justify-content: end;
  gap: 0.2rem;
  color: #0f7f7a;
}
table { width: 100%; border-collapse: collapse; margin: 0.75rem 0; }
th, td { border-bottom: 1px solid #e5eef0; padding: 0.55rem 0.35rem; text-align: left; font-size: 0.92rem; }
button {
  border: 0;
  background: #0f7f7a;
  color: white;
  border-radius: 0.7rem;
  padding: 0.7rem 1rem;
  font-weight: 700;
  cursor: pointer;
}
button:disabled { opacity: 0.5; cursor: not-allowed; }
button.secondary { background: #134e5a; }
button.link { background: transparent; color: #b45309; padding: 0; font-weight: 600; }
.muted { color: #7a9098; }
</style>
