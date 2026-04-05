import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth.js'
import Home from '../views/Home.vue'
import Rooms from '../views/Rooms.vue'
import RoomDetail from '../views/RoomDetail.vue'
import News from '../views/News.vue'
import About from '../views/About.vue'
import Login from '../views/Login.vue'
import Registration from '../views/Registration.vue'
import Admin from '../views/Admin.vue'

const routes = [
  { path: '/', name: 'home', component: Home, meta: { title: 'Grand Azure Hotel' } },
  { path: '/rooms', name: 'rooms', component: Rooms, meta: { title: 'Our Sanctuaries — Grand Azure' } },
  { path: '/rooms/:id', name: 'room-detail', component: RoomDetail, meta: { title: 'Room Detail — Grand Azure', requiresAuth: true } },
  { path: '/news', name: 'news', component: News, meta: { title: 'The Journal — Grand Azure' } },
  { path: '/about', name: 'about', component: About, meta: { title: 'Our Story — Grand Azure' } },
  { path: '/login', name: 'login', component: Login, meta: { title: 'Login — Grand Azure', guestOnly: true } },
  { path: '/register', name: 'register', component: Registration, meta: { title: 'Create Account — Grand Azure', guestOnly: true } },
  { path: '/admin', name: 'admin', component: Admin, meta: { title: 'Admin Panel — Grand Azure', requiresAdmin: true } }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    return { top: 0, behavior: 'smooth' }
  }
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAdmin && !authStore.isAdmin) {
    return next({ name: 'login', query: { redirect: to.fullPath } })
  }
  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    return next({ name: 'login', query: { redirect: to.fullPath } })
  }
  if (to.meta.guestOnly && authStore.isLoggedIn) {
    return next({ name: 'home' })
  }
  next()
})

router.afterEach((to) => {
  document.title = to.meta.title || 'Grand Azure Hotel'
})

export default router
