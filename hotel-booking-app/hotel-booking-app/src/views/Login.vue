<template>
  <div class="auth-page">
    <div class="auth-card">
      <div class="auth-card__brand">Grand Azure</div>
      <h1 class="auth-card__title">Welcome Back</h1>
      <p class="auth-card__subtitle">Log in to your Grand Azure account</p>

      <div v-if="errorMessage" class="alert alert-danger py-2 px-3 mb-3" style="font-size:.875rem;border-radius:var(--radius-sm);">
        {{ errorMessage }}
      </div>

      <!-- Demo credentials hint -->
      <div class="mb-3 p-3" style="background:var(--color-bg);border:1px solid var(--color-border);border-radius:var(--radius-sm);font-size:.8rem;color:var(--color-muted);">
        <strong style="color:var(--color-accent);">Admin access:</strong> admin@grandazure.com / admin123
      </div>

      <form @submit.prevent="handleLogin" novalidate>
        <div class="mb-3">
          <label for="login-email" class="form-label">Email</label>
          <input
            id="login-email"
            v-model.trim="form.email"
            v-focus
            type="email"
            class="form-control"
            :class="{ 'is-invalid': errors.email }"
            placeholder="your@email.com"
            autocomplete="email"
          />
          <div class="invalid-feedback">{{ errors.email }}</div>
        </div>

        <div class="mb-4">
          <label for="login-password" class="form-label">Password</label>
          <div style="position:relative;">
            <input
              id="login-password"
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              class="form-control"
              :class="{ 'is-invalid': errors.password }"
              placeholder="Your password"
              autocomplete="current-password"
            />
            <button type="button" @click="showPassword = !showPassword" style="position:absolute;right:.75rem;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;color:var(--color-muted);font-size:.8rem;padding:0;">
              {{ showPassword ? 'Hide' : 'Show' }}
            </button>
            <div class="invalid-feedback">{{ errors.password }}</div>
          </div>
        </div>

        <button type="submit" class="btn-auth-submit" :disabled="isLoading">
          <span v-if="isLoading">Logging in...</span>
          <span v-else>Log In</span>
        </button>
      </form>

      <p class="auth-card__link">
        Don't have an account? <RouterLink to="/register">Create an account</RouterLink>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter, useRoute, RouterLink } from 'vue-router'
import { useAuthStore } from '../stores/auth.js'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const form = reactive({ email: '', password: '' })
const errors = reactive({ email: '', password: '' })
const errorMessage = ref('')
const isLoading = ref(false)
const showPassword = ref(false)

async function handleLogin() {
  errors.email = ''
  errors.password = ''
  errorMessage.value = ''

  if (!form.email) { errors.email = 'Email is required.'; return }
  if (!form.password) { errors.password = 'Password is required.'; return }

  isLoading.value = true
  await new Promise(r => setTimeout(r, 600))

  const result = authStore.login({ email: form.email, password: form.password })
  isLoading.value = false

  if (result.success) {
    const redirect = route.query.redirect || '/'
    router.push(redirect)
  } else {
    errorMessage.value = result.error
  }
}
</script>
