<template>
  <footer class="site-footer" aria-label="Site footer">
    <div class="site-socials">
      <a href="https://www.instagram.com/andrea_dea_jones" target="_blank" rel="noopener noreferrer">
        {{ t('common.social.instagram') }}
      </a>
      <a href="https://www.tiktok.com/@andrea.dea.jones" target="_blank" rel="noopener noreferrer">
        {{ t('common.social.tiktok') }}
      </a>
    </div>

    <p class="site-copyright">{{ t('home.copyright') }}</p>

    <form class="site-subscribe" @submit.prevent="handleSubscribe">
      <label class="site-subscribe-title" for="site-footer-email">{{ t('home.subscribe') }}</label>
      <div class="site-subscribe-row">
        <input
          id="site-footer-email"
          v-model.trim="subscribeEmail"
          type="email"
          name="email"
          autocomplete="email"
          :placeholder="t('home.emailPlaceholder')"
          :disabled="loading"
          required
        />
        <button type="submit" :disabled="loading">
          {{ loading ? t('contact.sending') : t('home.subscribe') }}
        </button>
      </div>
      <p v-if="status === 'ok'" class="subscribe-status success">{{ t('contact.successMessage') }}</p>
      <p v-if="status === 'error'" class="subscribe-status error">{{ t('contact.errorMessage') }}</p>
    </form>
  </footer>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const subscribeEmail = ref('')
const loading = ref(false)
const status = ref<'idle' | 'ok' | 'error'>('idle')

const handleSubscribe = async () => {
  status.value = 'idle'

  if (!subscribeEmail.value) {
    return
  }

  loading.value = true

  try {
    const res = await fetch('/contact.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        mode: 'subscribe',
        email: subscribeEmail.value,
      }),
    })

    if (!res.ok) {
      throw new Error('Request failed')
    }

    status.value = 'ok'
    subscribeEmail.value = ''
  } catch (error) {
    console.error(error)
    status.value = 'error'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.site-footer {
  margin: 10rem 2.5rem 2.5rem;
  padding: 10rem 0 0;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  grid-template-areas:
    'social subscribe'
    'copyright copyright';
  align-items: end;
  row-gap: 1rem;
  gap: 1.8rem;
}

.site-socials {
  grid-area: social;
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
}

.site-socials a {
  text-decoration: none;
  color: var(--color-text);
  text-transform: uppercase;
  font-size: clamp(2.2rem, 4.1vw, 5.3rem);
  line-height: 0.95;
  font-weight: 700;
}

.site-copyright {
  grid-area: copyright;
  margin: 0;
  justify-self: center;
  text-align: center;
  font-size: 0.92rem;
  white-space: normal;
}

.site-subscribe {
  grid-area: subscribe;
  justify-self: end;
  width: 430px;
  padding: 0.75rem 0.95rem;
  background: var(--color-accent);
}

.site-subscribe-title {
  text-transform: uppercase;
  font-size: 2.05rem;
  line-height: 1;
  font-weight: 700;
}

.site-subscribe-row {    /*E-mail*/
  margin-top: 0.55rem;
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.site-subscribe-row input::placeholder {
  color: rgb(87, 87, 87); /* mets la couleur que tu veux */
  opacity: 1; /* important pour certains navigateurs */
}

.site-subscribe-row input {
  flex: 1;
  border: none;
  border-bottom: 2px solid var(--color-text);
  background: transparent;
  padding: 0.2rem 0;
  font-family: var(--font-body);
  font-size: 1rem;
}

.site-subscribe-row input:focus {
  outline: none;
}

.site-subscribe-row button {
  border: 2px solid var(--color-text);
  border-radius: 10px;
  background: transparent;
  color: var(--color-text);
  cursor: pointer;
  text-transform: uppercase;
  font-family: var(--font-body);
  font-size: 1.1rem;
  padding: 0.2rem 0.75rem;
}

.site-subscribe-row button:disabled,
.site-subscribe-row input:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

.site-socials a:hover,
.site-subscribe-row button:hover {
  background: var(--color-text);
  color: var(--color-accent);
}

.subscribe-status {
  margin-top: 0.55rem;
  font-size: 0.78rem;
}

.subscribe-status.success {
  color: #1f7a36;
}

.subscribe-status.error {
  color: #b3261e;
}

@media (max-width: 1200px) {
  .site-footer {
    margin: 0 2.5rem 2rem 2.5rem;
    grid-template-columns: 1fr;
    grid-template-areas:
      'social'
      'subscribe'
      'copyright';
    gap: 1.3rem;
  }

  .site-subscribe {
    justify-self: start;
    width: min(100%, 430px);
  }
}

@media (max-width: 768px) {
  .site-footer {
    margin: 0.5rem 1.5rem 1.5rem 1.5rem;
    padding-top: 1.6rem;
  }

  .site-socials a {
    font-size: 3.8rem;
  }

  .site-subscribe {
    width: 100%;
  }

  .site-subscribe-title {
    font-size: 1.2rem;
  }
}
</style>