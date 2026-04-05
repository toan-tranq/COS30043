<template>
  <div class="auth-page">
    <div class="auth-card" style="max-width:500px;">
      <div class="auth-card__brand">Grand Azure</div>
      <h1 class="auth-card__title">Create Account</h1>
      <p class="auth-card__subtitle">Join the exclusive Grand Azure community</p>

      <div v-if="successMessage" class="alert alert-success py-2 px-3 mb-3" style="font-size:.875rem;border-radius:var(--radius-sm);">
        {{ successMessage }}
      </div>
      <div v-if="errorMessage" class="alert alert-danger py-2 px-3 mb-3" style="font-size:.875rem;border-radius:var(--radius-sm);">
        {{ errorMessage }}
      </div>

      <form @submit.prevent="handleRegister" novalidate>
        <div class="row g-3 mb-3">
          <div class="col-6">
            <label for="reg-first" class="form-label">First Name <span class="required">*</span></label>
            <input
              id="reg-first"
              v-model.trim="form.firstName"
              v-focus
              type="text"
              class="form-control"
              :class="{ 'is-invalid': errors.firstName }"
              placeholder="First name"
              autocomplete="given-name"
            />
            <div class="invalid-feedback">{{ errors.firstName }}</div>
          </div>
          <div class="col-6">
            <label for="reg-last" class="form-label">Last Name <span class="required">*</span></label>
            <input
              id="reg-last"
              v-model.trim="form.lastName"
              type="text"
              class="form-control"
              :class="{ 'is-invalid': errors.lastName }"
              placeholder="Last name"
              autocomplete="family-name"
            />
            <div class="invalid-feedback">{{ errors.lastName }}</div>
          </div>
        </div>

        <div class="mb-3">
          <label for="reg-email" class="form-label">Email Address <span class="required">*</span></label>
          <input
            id="reg-email"
            v-model.trim="form.email"
            type="email"
            class="form-control"
            :class="{ 'is-invalid': errors.email }"
            placeholder="your@email.com"
            autocomplete="email"
          />
          <div class="invalid-feedback">{{ errors.email }}</div>
        </div>

        <div class="mb-3">
          <label for="reg-pass" class="form-label">Password <span class="required">*</span></label>
          <div style="position:relative;">
            <input
              id="reg-pass"
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              class="form-control"
              :class="{ 'is-invalid': errors.password }"
              placeholder="Min. 8 characters"
              autocomplete="new-password"
            />
            <button type="button" @click="showPassword = !showPassword" style="position:absolute;right:.75rem;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;color:var(--color-muted);font-size:.8rem;padding:0;">
              {{ showPassword ? 'Hide' : 'Show' }}
            </button>
          </div>
          <div class="invalid-feedback" :class="{ 'd-block': errors.password }">{{ errors.password }}</div>
          <!-- Password strength bar -->
          <div v-if="form.password" class="mt-2">
            <div style="height:3px;background:var(--color-border);border-radius:2px;overflow:hidden;">
              <div :style="{ width: passwordStrength.pct + '%', background: passwordStrength.color, height: '100%', transition: 'width .3s,background .3s' }"></div>
            </div>
            <small :style="{ color: passwordStrength.color }">{{ passwordStrength.label }}</small>
          </div>
        </div>

        <div class="mb-4">
          <label for="reg-confirm" class="form-label">Confirm Password <span class="required">*</span></label>
          <input
            id="reg-confirm"
            v-model="form.confirmPassword"
            type="password"
            class="form-control"
            :class="{ 'is-invalid': errors.confirmPassword }"
            placeholder="Repeat your password"
          />
          <div class="invalid-feedback">{{ errors.confirmPassword }}</div>
        </div>

        <button type="submit" class="btn-auth-submit" :disabled="isLoading">
          <span v-if="isLoading">Creating your account...</span>
          <span v-else>Register</span>
        </button>
      </form>

      <p class="auth-card__link">
        Already have an account? <RouterLink to="/login">Log in</RouterLink>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useAuthStore } from '../stores/auth.js'

const router = useRouter()
const authStore = useAuthStore()

const form = reactive({ firstName: '', lastName: '', email: '', password: '', confirmPassword: '' })
const errors = reactive({ firstName: '', lastName: '', email: '', password: '', confirmPassword: '' })
const errorMessage = ref('')
const successMessage = ref('')
const isLoading = ref(false)
const showPassword = ref(false)

const passwordStrength = computed(() => {
  const p = form.password
  if (!p) return { pct: 0, color: '', label: '' }
  let score = 0
  if (p.length >= 8) score++
  if (p.length >= 12) score++
  if (/[A-Z]/.test(p)) score++
  if (/[0-9]/.test(p)) score++
  if (/[^A-Za-z0-9]/.test(p)) score++
  const levels = [
    { pct: 20, color: '#c0392b', label: 'Weak' },
    { pct: 40, color: '#e67e22', label: 'Fair' },
    { pct: 60, color: '#f1c40f', label: 'Moderate' },
    { pct: 80, color: '#27ae60', label: 'Strong' },
    { pct: 100, color: '#2ecc71', label: 'Very Strong' }
  ]
  return levels[Math.min(score - 1, 4)] || levels[0]
})

async function handleRegister() {
  Object.keys(errors).forEach(k => { errors[k] = '' })
  errorMessage.value = ''
  let valid = true

  if (!form.firstName) { errors.firstName = 'First name is required.'; valid = false }
  if (!form.lastName) { errors.lastName = 'Last name is required.'; valid = false }
  if (!form.email) { errors.email = 'Email is required.'; valid = false }
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) { errors.email = 'Please enter a valid email.'; valid = false }
  if (!form.password) { errors.password = 'Password is required.'; valid = false }
  else if (form.password.length < 8) { errors.password = 'Password must be at least 8 characters.'; valid = false }
  if (!form.confirmPassword) { errors.confirmPassword = 'Please confirm your password.'; valid = false }
  else if (form.password !== form.confirmPassword) { errors.confirmPassword = 'Passwords do not match.'; valid = false }

  if (!valid) return

  isLoading.value = true
  await new Promise(r => setTimeout(r, 700))

  const result = authStore.register({
    firstName: form.firstName,
    lastName: form.lastName,
    email: form.email,
    password: form.password
  })
  isLoading.value = false

  if (result.success) {
    router.push('/')
  } else {
    errorMessage.value = result.error
  }
}
</script>
