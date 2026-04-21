<template>
  <v-app>
    <router-view />
  </v-app>
</template>

<script setup lang="ts">
import { watch } from 'vue'
import { useRoute } from 'vue-router'
import { configureScrollLock } from '@/utils/scrollLock'

const route = useRoute()

watch(
  () => route.meta.scrollLockAllowSelectors,
  (selectors) => {
    if (!Array.isArray(selectors) || selectors.some((selector) => typeof selector !== 'string')) {
      return
    }

    configureScrollLock({
      allowTouchMoveSelectors: selectors,
    })
  },
  { immediate: true },
)
</script>
