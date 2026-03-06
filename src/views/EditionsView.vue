<template>
  <PageWrapper>
    <div class="editions-placeholder">
      <h1>Editions</h1>
      <p>Content coming soon.</p>
    </div>
  </PageWrapper>
</template>

<script setup lang="ts">
import PageWrapper from '@/components/PageWrapper.vue'
</script>

<style scoped>
.editions-placeholder {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  gap: 0.75rem;
}

.editions-placeholder h1 {
  text-transform: uppercase;
  font-size: 2rem;
}

.editions-placeholder p {
  opacity: 0.8;
}
</style>
