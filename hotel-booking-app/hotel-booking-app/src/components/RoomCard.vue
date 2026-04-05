<template>
  <div class="room-card" @click="goToDetail">
    <div class="room-card__image-wrap">
      <img :src="room.image" :alt="room.name" class="room-card__image" loading="lazy" />
      <span class="room-card__badge" :class="badgeClass">{{ holdStatus || room.status }}</span>

      <!-- Like button -->
      <button
        class="room-card__like"
        :class="{ 'room-card__like--active': isLiked }"
        @click.stop="handleLike"
        :title="authStore.isLoggedIn ? (isLiked ? 'Unlike' : 'Like') : 'Log in to like'"
      >
        {{ isLiked ? '♥' : '♡' }} {{ room.likes }}
      </button>
    </div>
    <div class="room-card__body">
      <div class="room-card__type">{{ room.type }} · {{ room.view }} View</div>
      <h3 class="room-card__name">{{ room.name }}</h3>
      <p class="room-card__desc">{{ room.shortDescription }}</p>
      <div class="room-card__meta">
        <div class="room-card__features">
          <span v-for="feature in room.features.slice(0, 3)" :key="feature" class="room-card__feature">
            {{ feature }}
          </span>
        </div>
        <div class="room-card__price">
          <span class="room-card__price-from">from</span>
          <span class="room-card__price-amount">${{ room.pricePerNight.toLocaleString() }}</span>
          <span class="room-card__price-unit">/night</span>
        </div>
      </div>
      <button
        class="btn-room-view"
        :disabled="room.status === 'Unavailable' || !!heldByOther"
        @click.stop="goToDetail"
      >
        {{ heldByOther ? 'Currently Held' : room.status === 'Unavailable' ? 'Unavailable' : 'View Suite' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useRoomsStore } from '../stores/rooms.js'
import { useHoldsStore } from '../stores/holds.js'
import { useAuthStore } from '../stores/auth.js'

const props = defineProps({ room: { type: Object, required: true } })

const router = useRouter()
const roomsStore = useRoomsStore()
const holdsStore = useHoldsStore()
const authStore = useAuthStore()

const isLiked = computed(() =>
  authStore.user ? roomsStore.isLikedBy(props.room.id, authStore.user.id) : false
)

const hold = computed(() => holdsStore.getHold(props.room.id))
const heldByMe = computed(() => authStore.user && hold.value?.userId === authStore.user.id)
const heldByOther = computed(() => hold.value && (!authStore.user || hold.value.userId !== authStore.user.id))
const holdStatus = computed(() => {
  if (heldByMe.value) return 'On Hold (You)'
  if (heldByOther.value) return 'On Hold'
  return null
})

const badgeClass = computed(() => {
  if (heldByMe.value) return 'room-card__badge--hold-me'
  if (heldByOther.value) return 'room-card__badge--hold-other'
  return props.room.status === 'Available' ? 'room-card__badge--available' : 'room-card__badge--unavailable'
})

function handleLike() {
  if (!authStore.isLoggedIn) {
    router.push('/login')
    return
  }
  roomsStore.toggleLike(props.room.id, authStore.user.id)
}

function goToDetail() {
  if (props.room.status === 'Unavailable') return
  if (!authStore.isLoggedIn) {
    router.push({ name: 'login', query: { redirect: `/rooms/${props.room.id}` } })
    return
  }
  router.push({ name: 'room-detail', params: { id: props.room.id } })
}
</script>
