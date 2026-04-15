<template>
  <div class="andrea page-wrapper">
    <Header :is-white="headerIsWhite" />
    <main class="content">
      <slot />
    </main>
    <SiteFooter />
  </div>
</template>

<script setup lang="ts">
import Header from '@/components/Header.vue'
import SiteFooter from '@/components/SiteFooter.vue'

defineProps<{
  headerIsWhite?: boolean
}>()
</script>

<style scoped>
.page-wrapper {
  min-height: 100vh;
  background: var(--color-background);
  display: flex;
  flex-direction: column;
}

.content {
  box-sizing: border-box;
  display: flex;
  flex: 1;
  margin: 0 2.5rem;
}

@media (max-width: 768px) {
  .content {
    margin: 0.5rem 1.5rem 0;
  }
}
</style>

