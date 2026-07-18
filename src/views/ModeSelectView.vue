<script setup lang="ts">
import { setAppMode, type AppMode } from '@/stores/appMode'
import { useRouter } from 'vue-router'

const router = useRouter()

function choose(mode: AppMode) {
  setAppMode(mode)
  if (mode === 'boutique') router.push('/login')
  else router.push('/cf/login')
}
</script>

<template>
  <div class="mode-select">
    <div class="mode-select__glow" aria-hidden="true" />
    <div class="mode-select__inner">
      <p class="mode-select__brand">Service App</p>
      <h1 class="mode-select__title">Choisissez votre espace</h1>
      <p class="mode-select__lead">
        Version 2 — Boutique existante ou gestion complète de la chambre froide.
      </p>

      <div class="mode-select__grid">
        <button type="button" class="mode-card mode-card--boutique" @click="choose('boutique')">
          <span class="mode-card__kicker">Module actuel</span>
          <span class="mode-card__name">Boutique</span>
          <span class="mode-card__desc">
            Facturation, stocks, dettes, marketeurs et versements — la version déjà en place.
          </span>
          <span class="mode-card__cta">Entrer en boutique</span>
        </button>

        <button type="button" class="mode-card mode-card--cold" @click="choose('chambre_froide')">
          <span class="mode-card__kicker">Nouveau · V2</span>
          <span class="mode-card__name">Chambre froide</span>
          <span class="mode-card__desc">
            Multi-organisations isolées · vente facturier → caisse · stocks · prix · rapports · sauvegarde.
          </span>
          <span class="mode-card__cta">Ouvrir la chambre froide</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,700&family=Source+Sans+3:wght@400;500;600;700&display=swap');

.mode-select {
  --ice: #0b3d4a;
  --mint: #1fa6a0;
  --fog: #e8f4f3;
  --sand: #f7f3ea;
  --ink: #102a33;
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 2rem 1.25rem;
  font-family: 'Source Sans 3', sans-serif;
  color: var(--ink);
  background:
    radial-gradient(ellipse 80% 60% at 10% 20%, rgba(31, 166, 160, 0.22), transparent 55%),
    radial-gradient(ellipse 70% 50% at 90% 80%, rgba(11, 61, 74, 0.18), transparent 50%),
    linear-gradient(160deg, #f3faf9 0%, #e7eef1 45%, #f7f3ea 100%);
  position: relative;
  overflow: hidden;
}

.mode-select__glow {
  position: absolute;
  inset: auto auto 10% -10%;
  width: 50vw;
  height: 50vw;
  background: radial-gradient(circle, rgba(31, 166, 160, 0.15), transparent 65%);
  animation: drift 10s ease-in-out infinite alternate;
  pointer-events: none;
}

.mode-select__inner {
  width: min(920px, 100%);
  position: relative;
  z-index: 1;
  animation: rise 0.7s ease-out both;
}

.mode-select__brand {
  font-family: 'Fraunces', serif;
  font-size: clamp(2.4rem, 6vw, 3.6rem);
  font-weight: 700;
  letter-spacing: -0.03em;
  margin: 0;
  color: var(--ice);
  line-height: 1.05;
}

.mode-select__title {
  margin: 0.75rem 0 0;
  font-size: clamp(1.15rem, 2.5vw, 1.45rem);
  font-weight: 600;
  color: #254550;
}

.mode-select__lead {
  margin: 0.6rem 0 0;
  max-width: 36rem;
  color: #4a6670;
  font-size: 1.05rem;
}

.mode-select__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1.25rem;
  margin-top: 2.25rem;
}

.mode-card {
  text-align: left;
  border: 1px solid rgba(16, 42, 51, 0.08);
  border-radius: 1.25rem;
  padding: 1.5rem 1.4rem 1.35rem;
  cursor: pointer;
  transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
  min-height: 240px;
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
}

.mode-card--boutique {
  background: linear-gradient(165deg, #fffdf8 0%, #f3ebe0 100%);
  box-shadow: 0 18px 40px rgba(72, 52, 28, 0.08);
}

.mode-card--cold {
  background: linear-gradient(165deg, #f2fbfb 0%, #d9eef0 100%);
  box-shadow: 0 18px 40px rgba(11, 61, 74, 0.1);
}

.mode-card:hover {
  transform: translateY(-4px);
  border-color: rgba(31, 166, 160, 0.35);
}

.mode-card__kicker {
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #5f7a84;
}

.mode-card__name {
  font-family: 'Fraunces', serif;
  font-size: 1.85rem;
  font-weight: 700;
  color: var(--ice);
}

.mode-card__desc {
  color: #425860;
  line-height: 1.45;
  flex: 1;
}

.mode-card__cta {
  margin-top: 0.5rem;
  font-weight: 700;
  color: var(--mint);
}

@keyframes rise {
  from { opacity: 0; transform: translateY(18px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes drift {
  from { transform: translate(0, 0); }
  to { transform: translate(12%, -8%); }
}

@media (max-width: 720px) {
  .mode-select__grid {
    grid-template-columns: 1fr;
  }
}
</style>
