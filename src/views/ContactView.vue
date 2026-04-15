<template>
  <PageWrapper>
    <section class="contact-page">
      <header class="contact-header">
        <h1 class="contact-title">{{ t('contact.title') }}</h1>
        <p class="contact-description">
          {{ t('contact.description') }}
        </p>
      </header>

      <form class="contact-form" @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="name" class="form-label">{{ t('contact.name') }}*</label>
          <input
            id="name"
            v-model.trim="form.name"
            type="text"
            class="form-input"
            :class="{ 'input-error': fieldErrors.name }"
            autocomplete="name"
          />
          <p v-if="fieldErrors.name" class="field-error">{{ fieldErrors.name }}</p>
        </div>

        <div class="form-group">
          <label for="email" class="form-label">{{ t('contact.email') }}*</label>
          <input
            id="email"
            v-model.trim="form.email"
            type="email"
            class="form-input"
            :class="{ 'input-error': fieldErrors.email }"
            autocomplete="email"
          />
          <p v-if="fieldErrors.email" class="field-error">{{ fieldErrors.email }}</p>
        </div>

        <div class="form-group">
          <label for="type" class="form-label">{{ t('contact.interestLabel') }}*</label>
          <select
            id="type"
            v-model="form.type"
            class="form-input"
            :class="{ 'input-error': fieldErrors.type }"
          >
            <option value="" disabled>{{ t('contact.selectOption') }}</option>
            <option value="yomartins-low-stool">{{ t('contact.interests.yomartinsLowStool') }}</option>
            <option value="studio-edition">{{ t('contact.interests.studioEdition') }}</option>
            <option value="gallery-edition">{{ t('contact.interests.galleryEdition') }}</option>
            <option value="project-inquiry">{{ t('contact.interests.projectInquiry') }}</option>
            <option value="collaboration">{{ t('contact.interests.collaboration') }}</option>
            <option value="other">{{ t('contact.interests.other') }}</option>
          </select>
          <p v-if="fieldErrors.type" class="field-error">{{ fieldErrors.type }}</p>
        </div>

        <div class="form-group">
          <label for="description" class="form-label">{{ t('contact.messageLabel') }}*</label>
          <textarea
            id="description"
            v-model.trim="form.description"
            class="form-textarea"
            :class="{ 'input-error': fieldErrors.description }"
            rows="7"
          ></textarea>
          <p v-if="fieldErrors.description" class="field-error">{{ fieldErrors.description }}</p>
        </div>

        <button type="submit" class="submit-btn" :disabled="loading">
          {{ loading ? t('contact.sending') : t('contact.send') }}
        </button>

        <p v-if="status === 'ok'" class="form-status success">{{ t('contact.successMessage') }}</p>
        <p v-if="status === 'error'" class="form-status error">{{ t('contact.errorMessage') }}</p>
      </form>
    </section>
  </PageWrapper>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import PageWrapper from '@/components/PageWrapper.vue'

const { t } = useI18n()

type ContactForm = {
  name: string
  email: string
  type: string
  description: string
}

const defaultFormState = (): ContactForm => ({
  name: '',
  email: '',
  type: '',
  description: '',
})

const form = ref<ContactForm>(defaultFormState())
const loading = ref(false)
const status = ref<'idle' | 'ok' | 'error'>('idle')
const fieldErrors = ref({
  name: '',
  email: '',
  type: '',
  description: '',
})

const resetErrors = () => {
  fieldErrors.value = {
    name: '',
    email: '',
    type: '',
    description: '',
  }
}

const handleSubmit = async () => {
  status.value = 'idle'
  resetErrors()

  if (!form.value.name) {
    fieldErrors.value.name = t('contact.errors.nameRequired')
  }

  if (!form.value.email) {
    fieldErrors.value.email = t('contact.errors.emailRequired')
  }

  if (!form.value.type) {
    fieldErrors.value.type = t('contact.errors.projectTypeRequired')
  }

  if (!form.value.description) {
    fieldErrors.value.description = t('contact.errors.descriptionRequired')
  }

  if (!form.value.name || !form.value.email || !form.value.type || !form.value.description) {
    return
  }

  loading.value = true

  try {
    const res = await fetch('/contact.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form.value),
    })

    if (!res.ok) {
      throw new Error('Request failed')
    }

    status.value = 'ok'
    resetErrors()
    form.value = defaultFormState()
  } catch (error) {
    console.error(error)
    status.value = 'error'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.contact-page {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: clamp(2rem, 6vw, 5rem);
  padding-bottom: 3rem;
}

.contact-header {
  width: min(100%, 880px);
  text-align: center;
}

.contact-title {
  font-size: clamp(2.6rem, 6vw, 4.2rem);
  letter-spacing: 0.12em;
  line-height: 1;
}

.contact-description {
  margin-top: 3.2rem;
  font-size: clamp(0.8rem, 1vw, 0.92rem);
  line-height: 1.6;
  max-width: 720px;
  margin-left: auto;
  margin-right: auto;
}

.contact-form {
  width: min(100%, 560px);
  margin-top: clamp(2.2rem, 7vw, 5rem);
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-label {
  font-size: 0.82rem;
  margin-bottom: 0.35rem;
}

.form-input,
.form-textarea {
  width: 100%;
  border: 1px solid #d9d9d9;
  background: #fff;
  color: var(--color-text);
  font-family: var(--font-body);
  font-size: 0.92rem;
  padding: 0.62rem 0.72rem;
  border-radius: 2px;
  transition: border-color 0.2s ease;
}

.form-textarea {
  resize: vertical;
  min-height: 180px;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: #6b6b6b;
}

.input-error {
  border-color: #b3261e;
}

.field-error {
  color: #b3261e;
  font-size: 0.72rem;
  margin-top: 0.2rem;
}

.submit-btn {
  margin: 1.8rem auto 0;
  border: none;
  border-radius: 0;
  background: #6dff14;
  color: #1d1d1d;
  width: 110px;
  height: 38px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  font-family: var(--font-body);
  font-size: 0.88rem;
  cursor: pointer;
  transition: filter 0.2s ease, transform 0.2s ease;
}

.submit-btn:hover:not(:disabled) {
  filter: brightness(0.95);
  transform: translateY(-1px);
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.form-status {
  text-align: center;
  margin-top: 0.65rem;
  font-size: 0.82rem;
}

.form-status.success {
  color: #1f7a36;
}

.form-status.error {
  color: #b3261e;
}

@media (max-width: 768px) {
  .contact-page {
    padding-top: 1rem;
  }

  .contact-description {
    margin-top: 1.6rem;
  }

  .contact-form {
    margin-top: 2rem;
  }
}

@media (max-width: 460px) {
  .contact-title {
    letter-spacing: 0.07em;
    font-size: 2.1rem;
  }

  .form-label {
    font-size: 0.78rem;
  }
}
</style>
