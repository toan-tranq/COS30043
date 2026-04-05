import { defineStore } from 'pinia'
import { ref } from 'vue'

const STORAGE_KEY = 'ga_holds'
const HOLD_DURATION_MS = 5 * 60 * 1000 // 5 minutes

function loadHolds() {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : {}
  } catch { return {} }
}

function saveHolds(holds) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(holds))
}

export const useHoldsStore = defineStore('holds', () => {
  const holds = ref(loadHolds())

  function getHold(roomId) {
    const hold = holds.value[roomId]
    if (!hold) return null
    // Server-side timestamp check (simulated with localStorage)
    if (Date.now() > hold.expiresAt) {
      delete holds.value[roomId]
      saveHolds(holds.value)
      return null
    }
    return hold
  }

  function placeHold(roomId, user) {
    // Check if already held by someone else
    const existing = getHold(roomId)
    if (existing && existing.userId !== user.id) {
      return { success: false, error: 'This room is currently held by another guest.' }
    }

    const hold = {
      holdId: `hold-${Date.now()}`,
      roomId,
      userId: user.id,
      userName: `${user.firstName} ${user.lastName}`,
      placedAt: Date.now(),
      expiresAt: Date.now() + HOLD_DURATION_MS
    }
    holds.value[roomId] = hold
    saveHolds(holds.value)
    return { success: true, hold }
  }

  function releaseHold(roomId, userId) {
    const hold = holds.value[roomId]
    if (hold && hold.userId === userId) {
      delete holds.value[roomId]
      saveHolds(holds.value)
      return true
    }
    return false
  }

  function isHeldByMe(roomId, userId) {
    const hold = getHold(roomId)
    return hold ? hold.userId === userId : false
  }

  function isHeldByOther(roomId, userId) {
    const hold = getHold(roomId)
    return hold ? hold.userId !== userId : false
  }

  function getRemainingMs(roomId) {
    const hold = getHold(roomId)
    if (!hold) return 0
    return Math.max(0, hold.expiresAt - Date.now())
  }

  return { holds, getHold, placeHold, releaseHold, isHeldByMe, isHeldByOther, getRemainingMs }
})
