<template>
  <div class="page-content">
    <!-- Loading -->
    <div v-if="!room" class="d-flex align-items-center justify-content-center" style="min-height:60vh;">
      <div class="text-center">
        <h2 style="font-family:var(--font-serif);color:var(--color-muted);">Suite not found.</h2>
        <RouterLink to="/rooms" class="btn-reset mt-3" style="display:inline-block;">← Back to Rooms</RouterLink>
      </div>
    </div>

    <template v-else>
      <!-- Hero Image -->
      <div class="room-detail-hero">
        <img :src="room.image" :alt="room.name" class="room-detail-hero__img" />
        <div class="room-detail-hero__overlay"></div>
        <div class="room-detail-hero__info">
          <span style="font-size:.7rem;letter-spacing:.2em;text-transform:uppercase;opacity:.8;">{{ room.type }}</span>
          <h1 style="font-family:var(--font-serif);font-size:clamp(2rem,5vw,3.5rem);font-weight:300;color:#fff;margin:.25rem 0 .5rem;">{{ room.name }}</h1>
          <div class="d-flex flex-wrap gap-2">
            <span v-for="f in room.features" :key="f" class="room-card__feature" style="background:rgba(255,255,255,.15);border-color:rgba(255,255,255,.3);color:#fff;">{{ f }}</span>
          </div>
        </div>
      </div>

      <!-- Breadcrumb -->
      <div style="background:var(--color-surface);border-bottom:1px solid var(--color-border);padding:.75rem 0;">
        <div class="container">
          <nav style="font-size:.8rem;color:var(--color-muted);">
            <RouterLink to="/" style="color:var(--color-muted);">Home</RouterLink>
            <span class="mx-2">›</span>
            <RouterLink to="/rooms" style="color:var(--color-muted);">Rooms</RouterLink>
            <span class="mx-2">›</span>
            <span>{{ room.name }}</span>
          </nav>
        </div>
      </div>

      <div class="room-detail-body">
        <div class="container">
          <div class="row g-5">
            <!-- Left: Details -->
            <div class="col-lg-7">
              <!-- Room meta -->
              <div class="d-flex flex-wrap gap-4 mb-4 pb-4" style="border-bottom:1px solid var(--color-border);">
                <div class="text-center">
                  <div style="font-family:var(--font-serif);font-size:1.5rem;">{{ room.sizeSqm }}m²</div>
                  <div style="font-size:.7rem;letter-spacing:.12em;text-transform:uppercase;color:var(--color-muted);">Size</div>
                </div>
                <div class="text-center">
                  <div style="font-family:var(--font-serif);font-size:1.5rem;">{{ room.maxGuests }}</div>
                  <div style="font-size:.7rem;letter-spacing:.12em;text-transform:uppercase;color:var(--color-muted);">Guests</div>
                </div>
                <div class="text-center">
                  <div style="font-family:var(--font-serif);font-size:1.5rem;">{{ room.floor }}</div>
                  <div style="font-size:.7rem;letter-spacing:.12em;text-transform:uppercase;color:var(--color-muted);">Floor</div>
                </div>
                <div class="text-center">
                  <div style="font-family:var(--font-serif);font-size:1.5rem;">{{ room.view }}</div>
                  <div style="font-size:.7rem;letter-spacing:.12em;text-transform:uppercase;color:var(--color-muted);">View</div>
                </div>
                <div class="ms-auto d-flex align-items-center gap-2">
                  <button @click="handleLike" class="like-btn" :class="{ 'like-btn--active': isLiked }">
                    {{ isLiked ? '♥' : '♡' }} {{ room.likes }}
                  </button>
                </div>
              </div>

              <!-- Description -->
              <h2 class="detail-section-title">About This Suite</h2>
              <p style="color:var(--color-muted);line-height:1.9;margin-bottom:2rem;">{{ room.description }}</p>

              <!-- Gallery -->
              <h2 class="detail-section-title">Gallery</h2>
              <div class="row g-2 mb-4">
                <div class="col-12">
                  <img :src="activeImage" :alt="room.name" style="width:100%;height:320px;object-fit:cover;border-radius:var(--radius-md);" />
                </div>
                <div class="col-4" v-for="(img, i) in room.gallery" :key="i">
                  <img
                    :src="img"
                    :alt="`${room.name} ${i+1}`"
                    @click="activeImage = img"
                    style="width:100%;height:90px;object-fit:cover;border-radius:var(--radius-sm);cursor:pointer;transition:opacity .2s;"
                    :style="{ opacity: activeImage === img ? 1 : 0.65 }"
                  />
                </div>
              </div>

              <!-- Amenities -->
              <h2 class="detail-section-title">Amenities</h2>
              <div class="amenities-grid mb-4">
                <div class="amenity-item" v-for="amenity in room.amenities" :key="amenity">
                  <div class="amenity-dot"></div>
                  {{ amenity }}
                </div>
              </div>
            </div>

            <!-- Right: Booking Panel -->
            <div class="col-lg-5">
              <div class="price-box">
                <div class="price-box__amount">${{ room.pricePerNight.toLocaleString() }}</div>
                <div class="price-box__unit">per night · includes all service</div>

                <!-- HOLD STATES -->

                <!-- State 1: Held by someone else -->
                <div v-if="heldByOther" class="hold-alert hold-alert--blocked">
                  <div class="hold-alert__icon">⏳</div>
                  <h4>Room Currently Held</h4>
                  <p>Another guest is in the process of booking this room. Check back in a few minutes or explore other suites.</p>
                  <RouterLink to="/rooms" class="btn-booking-submit" style="display:block;text-align:center;text-decoration:none;margin-top:1rem;">Browse Other Suites</RouterLink>
                </div>

                <!-- State 2: Held by me — show timer + form -->
                <div v-else-if="heldByMe">
                  <HoldTimer :room-id="room.id" :size="140" @expired="onHoldExpired" />
                  <BookingForm :room-id="room.id" :room-name="room.name" :price="room.pricePerNight" @booked="onBookingComplete" />
                </div>

                <!-- State 3: Available — show Book Now button -->
                <div v-else>
                  <p style="color:var(--color-muted);font-size:.875rem;margin-bottom:1.5rem;">
                    Click below to place a 5-minute hold on this suite while you complete your booking.
                  </p>
                  <button class="btn-booking-submit w-100" @click="handleBookNow" :disabled="isPlacingHold">
                    {{ isPlacingHold ? 'Reserving…' : 'Book Now' }}
                  </button>
                  <p style="font-size:.75rem;color:var(--color-muted);text-align:center;margin-top:.75rem;">No payment required at this step.</p>
                </div>
              </div>

              <!-- Booking confirmed -->
              <div v-if="bookingConfirmed" class="booking-confirmed mt-3">
                <div style="font-size:2rem;margin-bottom:.5rem;">✓</div>
                <h4>Reservation Submitted</h4>
                <p>Your concierge will confirm within 2 hours.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { useRoomsStore } from '../stores/rooms.js'
import { useHoldsStore } from '../stores/holds.js'
import { useAuthStore } from '../stores/auth.js'
import BookingForm from '../components/BookingForm.vue'
import HoldTimer from '../components/HoldTimer.vue'

const route = useRoute()
const roomsStore = useRoomsStore()
const holdsStore = useHoldsStore()
const authStore = useAuthStore()

const room = computed(() => roomsStore.getRoom(route.params.id))
const activeImage = ref(null)
const isPlacingHold = ref(false)
const bookingConfirmed = ref(false)

onMounted(() => {
  if (room.value) activeImage.value = room.value.image
})

const isLiked = computed(() =>
  room.value && authStore.user ? roomsStore.isLikedBy(room.value.id, authStore.user.id) : false
)

// Poll hold state
const holdPoll = ref(null)
const heldByMe = ref(false)
const heldByOther = ref(false)

function refreshHoldState() {
  if (!room.value || !authStore.user) return
  heldByMe.value = holdsStore.isHeldByMe(room.value.id, authStore.user.id)
  heldByOther.value = holdsStore.isHeldByOther(room.value.id, authStore.user.id)
}

onMounted(() => {
  refreshHoldState()
  holdPoll.value = setInterval(refreshHoldState, 2000)
})
onUnmounted(() => clearInterval(holdPoll.value))

function handleLike() {
  if (!authStore.isLoggedIn || !room.value) return
  roomsStore.toggleLike(room.value.id, authStore.user.id)
}

async function handleBookNow() {
  if (!authStore.isLoggedIn || !room.value) return
  isPlacingHold.value = true
  await new Promise(r => setTimeout(r, 500))
  const result = holdsStore.placeHold(room.value.id, authStore.user)
  isPlacingHold.value = false
  if (!result.success) {
    alert(result.error)
  }
  refreshHoldState()
}

function onHoldExpired() {
  refreshHoldState()
}

function onBookingComplete() {
  if (room.value && authStore.user) {
    holdsStore.releaseHold(room.value.id, authStore.user.id)
  }
  bookingConfirmed.value = true
  refreshHoldState()
}
</script>
