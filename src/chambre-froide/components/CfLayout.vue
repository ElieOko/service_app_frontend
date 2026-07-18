<script setup lang="ts">
import { provide, ref } from 'vue'
import CfSidebar from './CfSidebar.vue'
import CfHeader from './CfHeader.vue'

const sidebarOpen = ref(false)
provide('cfSidebarOpen', sidebarOpen)
</script>

<template>
  <div class="cf-shell">
    <div
      v-if="sidebarOpen"
      class="cf-shell__backdrop"
      @click="sidebarOpen = false"
    />
    <CfSidebar />
    <div class="cf-shell__main">
      <CfHeader @toggle-sidebar="sidebarOpen = !sidebarOpen" />
      <main class="cf-shell__content">
        <slot />
      </main>
    </div>
  </div>
</template>

<style scoped>
.cf-shell {
  --cf-bg: #eef5f6;
  --cf-ink: #12303a;
  --cf-accent: #0f7f7a;
  display: flex;
  min-height: 100vh;
  background:
    radial-gradient(circle at 0% 0%, rgba(15, 127, 122, 0.08), transparent 40%),
    linear-gradient(180deg, #f4fafb 0%, var(--cf-bg) 100%);
  color: var(--cf-ink);
  font-family: 'Source Sans 3', system-ui, sans-serif;
}

.cf-shell__backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 30;
}

.cf-shell__main {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.cf-shell__content {
  flex: 1;
  overflow: auto;
  padding: 1.25rem;
}

@media (min-width: 1024px) {
  .cf-shell__backdrop { display: none; }
  .cf-shell__content {
    padding: 1.75rem 2rem;
  }
}
</style>
