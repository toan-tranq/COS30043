<template>
  <div id="app-wrapper">
    <Navigation />
    <main>
      <RouterView v-slot="{ Component }">
        <Transition name="page" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </main>
    <footer class="site-footer">
      <div class="container">
        <div class="row align-items-center py-4">
          <div class="col-md-4 text-center text-md-start mb-3 mb-md-0">
            <span class="footer-brand">Grand Azure</span>
          </div>
          <div class="col-md-4 text-center mb-3 mb-md-0">
            <nav class="footer-nav d-flex justify-content-center gap-4">
              <RouterLink to="/">Home</RouterLink>
              <RouterLink to="/rooms">Rooms</RouterLink>
              <RouterLink to="/news">Journal</RouterLink>
              <RouterLink to="/about">About</RouterLink>
            </nav>
          </div>
          <div class="col-md-4 text-center text-md-end">
            <span class="footer-copy">&copy; {{ new Date().getFullYear() }} Grand Azure Hotel. All rights reserved.</span>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { RouterView, RouterLink } from 'vue-router'
import Navigation from './components/Navigation.vue'
</script>

<style>
/* Page transition */
.page-enter-active,
.page-leave-active {
  transition: opacity .25s ease, transform .25s ease;
}
.page-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
.page-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
