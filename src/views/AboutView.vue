<template>
  <PageWrapper>
    <div class="about-placeholder">
      <h1>About</h1>
      <p>Content coming soon.</p>
    </div>
  </PageWrapper>
</template>

<script setup lang="ts">
import PageWrapper from '@/components/PageWrapper.vue'
</script>

<style scoped>
.about-placeholder {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  gap: 0.75rem;
}

.about-placeholder h1 {
  text-transform: uppercase;
  font-size: 2rem;
}

.about-placeholder p {
  opacity: 0.8;
}
</style>
