import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const STORAGE_KEY = 'ga_users'
const SESSION_KEY = 'ga_session'

function loadUsers() {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch { return [] }
}

function saveUsers(users) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users))
}

function seedAdmin(users) {
  const adminExists = users.find(u => u.email === 'admin@grandazure.com')
  if (!adminExists) {
    users.push({
      id: 'admin-001',
      firstName: 'Grand Azure',
      lastName: 'Admin',
      email: 'admin@grandazure.com',
      password: 'admin123',
      role: 'admin',
      createdAt: new Date().toISOString()
    })
    saveUsers(users)
  }
  return users
}

export const useAuthStore = defineStore('auth', () => {
  const users = ref(seedAdmin(loadUsers()))
  const currentUser = ref(null)

  // Restore session
  const saved = localStorage.getItem(SESSION_KEY)
  if (saved) {
    try { currentUser.value = JSON.parse(saved) } catch { /* skip */ }
  }

  const isLoggedIn = computed(() => !!currentUser.value)
  const isAdmin = computed(() => currentUser.value?.role === 'admin')
  const user = computed(() => currentUser.value)

  function register({ firstName, lastName, email, password }) {
    const existing = users.value.find(u => u.email.toLowerCase() === email.toLowerCase())
    if (existing) return { success: false, error: 'An account with this email already exists.' }

    const newUser = {
      id: `user-${Date.now()}`,
      firstName,
      lastName,
      email,
      password,
      role: 'user',
      createdAt: new Date().toISOString()
    }
    users.value.push(newUser)
    saveUsers(users.value)

    const sessionUser = { ...newUser }
    delete sessionUser.password
    currentUser.value = sessionUser
    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser))
    return { success: true }
  }

  function login({ email, password }) {
    const found = users.value.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    )
    if (!found) return { success: false, error: 'Incorrect email or password.' }

    const sessionUser = { ...found }
    delete sessionUser.password
    currentUser.value = sessionUser
    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser))
    return { success: true }
  }

  function logout() {
    currentUser.value = null
    localStorage.removeItem(SESSION_KEY)
  }

  function getAllUsers() {
    return users.value.map(u => {
      const safe = { ...u }
      delete safe.password
      return safe
    })
  }

  return { isLoggedIn, isAdmin, user, register, login, logout, getAllUsers }
})
