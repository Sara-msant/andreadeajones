<template>
  <footer class="site-footer" aria-label="Site footer">
    <v-divider class="site-footer-divider" :thickness="2" />
    <div class="site-footer-content">
      <div class="site-socials">
        <a
          href="https://www.instagram.com/andrea_dea_jones"
          target="_blank"
          rel="noopener noreferrer"
        >
          {{ t('common.social.instagram') }}
        </a>
        <a
          href="https://www.tiktok.com/@andrea.dea.jones"
          target="_blank"
          rel="noopener noreferrer"
        >
          {{ t('common.social.tiktok') }}
        </a>
      </div>

      <p class="site-copyright">{{ t('home.copyright') }}</p>

      <form class="site-subscribe" @submit.prevent="handleSubscribe">
        <label class="site-subscribe-title" for="site-footer-email">{{
          t('home.subscribe')
        }}</label>
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
        <p v-if="status === 'ok'" class="subscribe-status success">
          {{ t('contact.successMessage') }}
        </p>
        <p v-if="status === 'error'" class="subscribe-status error">
          {{ t('contact.errorMessage') }}
        </p>
      </form>
    </div>
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
  margin: 0 clamp(1.5rem, 4vw, 5rem) 2.5rem;
}

.site-footer-divider {
  border-color: var(--color-border) !important;
  opacity: 1;
}

.site-footer-content {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
  grid-template-areas: 'social copyright subscribe';
  align-items: end;
  column-gap: 2rem;
  margin-top: 2rem;
}

.site-socials {
  grid-area: social;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.15rem;
}

.site-socials a {
  display: inline-block;
  width: fit-content;
  text-decoration: underline;
  text-decoration-color: transparent;
  text-underline-offset: 0.12em;
  text-decoration-thickness: 2px;
  color: var(--color-text);
  text-transform: uppercase;
  font-size: clamp(2.3rem, 3.2vw, 3.9rem);
  line-height: 0.9;
  font-weight: 700;
  transition:
    color 0.2s ease,
    transform 0.2s ease,
    text-decoration-color 0.2s ease;
}

.site-socials a:hover {
  color: var(--color-accent);
  background: transparent;
  text-decoration-color: var(--color-accent);
  transform: translateX(4px);
}

.site-copyright {
  grid-area: copyright;
  margin: 0;
  justify-self: center;
  align-self: end;
  text-align: center;
  font-size: 0.82rem;
  line-height: 1.2;
  white-space: nowrap;
}

.site-subscribe {
  grid-area: subscribe;
  justify-self: end;
  width: 430px;
  box-sizing: border-box;
  padding: 0.85rem 1rem;
  background: var(--color-accent);

}

.site-subscribe-title {
  display: block;
  text-transform: uppercase;
  font-size: 2.05rem;
  line-height: 1;
  font-weight: 700;
}

.site-subscribe-row {
  margin-top: 0.65rem;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  width: 100%;
  min-width: 0;
}

.site-subscribe-row input::placeholder {
  color: rgb(87, 87, 87);
  opacity: 1;
}

.site-subscribe-row input {
  flex: 1 1 auto;
  min-width: 0;
  width: 100%;
  border: none;
  border-bottom: 2px solid var(--color-text);
  background: transparent;
  padding: 0.2rem 0;
  font-family: var(--font-body);
  font-size: 1rem;
  color: var(--color-text);
}

.site-subscribe-row input:focus {
  outline: none;
}

.site-subscribe-row button {
  flex: 0 0 auto;
  white-space: nowrap;
  border: 2px solid var(--color-text);
  border-radius: 10px;
  background: transparent;
  color: var(--color-text);
  cursor: pointer;
  text-transform: uppercase;
  font-family: var(--font-body);
  font-size: 1rem;
  padding: 0.22rem 0.75rem;
  transition:
    background 0.2s ease,
    color 0.2s ease;
}

.site-subscribe-row button:hover {
  background: var(--color-text);
  color: var(--color-accent);
}

.site-subscribe-row button:disabled,
.site-subscribe-row input:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

.subscribe-status {
  margin-top: 0.55rem;
  font-size: 0.78rem;
}

.subscribe-status.success {
  color: var(--color-accent);
}

.subscribe-status.error {
  color: #b3261e;
}

/* Tablet / smaller desktop */
@media (max-width: 1200px) {
  .site-footer {
    margin: 0 2.5rem 1.75rem;
  }

  .site-footer-content {
    grid-template-columns: 1fr;
    grid-template-areas:
      'social'
      'subscribe'
      'copyright';
    gap: 1.4rem;
    align-items: start;
  }

  .site-socials {
    align-items: flex-start;
  }

  .site-subscribe {
    justify-self: start;
    width: min(100%, 430px);
  }

  .site-copyright {
    justify-self: center;
    white-space: normal;
  }
}

/* Mobile */
@media (max-width: 768px) {
  .site-footer {
    margin: 0.5rem 1.5rem 1.5rem;
  }

  .site-footer-content {
    margin-top: 1.4rem;
    grid-template-columns: 1fr;
    grid-template-areas:
      'social'
      'subscribe'
      'copyright';
    gap: 1.4rem;
  }

  .site-socials {
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 2rem;
    width: 100%;
  }

  .site-socials a {
    font-size: clamp(1.3rem, 6vw, 1.7rem);
    line-height: 1;
    text-align: center;
  }

  .site-socials a:hover {
    transform: none;
  }

  .site-subscribe {
    justify-self: center;
    width: 100%;
    max-width: 520px;
    padding: 0.9rem 1rem;
  }

  .site-subscribe-title {
    font-size: 1.25rem;
  }

  .site-subscribe-row {
    margin-top: 0.7rem;
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 0.75rem;
    align-items: end;
  }

  .site-subscribe-row input {
    font-size: 0.9rem;
  }

  .site-subscribe-row button {
    font-size: 0.8rem;
    padding: 0.25rem 0.65rem;
  }

  .site-copyright {
    font-size: 0.72rem;
  }
}

@media (max-width: 480px) {
  .site-footer {
    margin: 0.5rem 1.25rem 1.25rem;
  }

  .site-socials {
    gap: 1.5rem;
  }

  .site-subscribe-row {
    grid-template-columns: 1fr;
    gap: 0.6rem;
  }

  .site-subscribe-row button {
    justify-self: start;
  }
}
</style>
