<template>
  <nav class="navbar navbar-expand-lg site-navbar" :class="{ 'navbar-scrolled': isScrolled }">
    <div class="container">
      <RouterLink class="navbar-brand" to="/">Grand Azure</RouterLink>

      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarMain"
        aria-controls="navbarMain"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarMain">
        <ul class="navbar-nav ms-auto mb-2 mb-lg-0 align-items-lg-center gap-lg-1">
          <li class="nav-item">
            <RouterLink class="nav-link" :class="{ active: $route.name === 'home' }" to="/">Home</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" :class="{ active: $route.name === 'rooms' || $route.name === 'room-detail' }" to="/rooms">Rooms</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" :class="{ active: $route.name === 'news' }" to="/news">Journal</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" :class="{ active: $route.name === 'about' }" to="/about">About</RouterLink>
          </li>
          <!-- Admin link -->
          <li class="nav-item" v-if="authStore.isAdmin">
            <RouterLink class="nav-link" :class="{ active: $route.name === 'admin' }" to="/admin" style="color:var(--color-gold);">Admin</RouterLink>
          </li>
          <!-- Guest links -->
          <template v-if="!authStore.isLoggedIn">
            <li class="nav-item ms-lg-2">
              <RouterLink class="nav-link btn-nav-outline" to="/login">Log In</RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink class="nav-link btn-nav-solid" to="/register">Join</RouterLink>
            </li>
          </template>
          <!-- Logged in user -->
          <template v-else>
            <li class="nav-item ms-lg-2">
              <div class="nav-user-menu" @click.stop="menuOpen = !menuOpen" ref="menuRef">
                <div class="nav-user-avatar">{{ initials }}</div>
                <span class="nav-user-name d-none d-lg-inline">{{ authStore.user?.firstName }}</span>
                <Transition name="dropdown">
                  <div v-if="menuOpen" class="nav-dropdown">
                    <div class="nav-dropdown__header">
                      <strong>{{ authStore.user?.firstName }} {{ authStore.user?.lastName }}</strong>
                      <small>{{ authStore.user?.email }}</small>
                    </div>
                    <RouterLink v-if="authStore.isAdmin" to="/admin" class="nav-dropdown__item" @click="menuOpen = false">Admin Panel</RouterLink>
                    <button class="nav-dropdown__item nav-dropdown__item--danger" @click="logout">Log Out</button>
                  </div>
                </Transition>
              </div>
            </li>
          </template>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth.js'

const $route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const isScrolled = ref(false)
const menuOpen = ref(false)
const menuRef = ref(null)

const initials = computed(() => {
  const u = authStore.user
  if (!u) return ''
  return `${u.firstName?.[0] || ''}${u.lastName?.[0] || ''}`.toUpperCase()
})

function handleScroll() { isScrolled.value = window.scrollY > 40 }

function handleOutsideClick(e) {
  if (menuRef.value && !menuRef.value.contains(e.target)) menuOpen.value = false
}

function logout() {
  menuOpen.value = false
  authStore.logout()
  router.push('/')
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  document.addEventListener('click', handleOutsideClick)
})
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  document.removeEventListener('click', handleOutsideClick)
})
</script>
