<template>
  <div class="page-content">
    <!-- Header -->
    <div class="rooms-header">
      <div class="container">
        <span class="section__eyebrow" style="color:var(--color-gold-lt);">Our Sanctuaries</span>
        <h1 class="section__title" style="color:#fff;font-size:clamp(2.5rem,5vw,4rem);">Discover our collection.</h1>
        <div class="divider-gold"></div>
        <p style="color:rgba(255,255,255,.75);max-width:580px;">Meticulously designed spaces, each offering a unique perspective of luxury and comfort.</p>
      </div>
    </div>

    <!-- Stats -->
    <div class="rooms-stats">
      <div class="container">
        <div class="row g-3 text-center">
          <div class="col-4 stat-item">
            <div class="stat-value">{{ availableCount }}</div>
            <div class="stat-label">Available</div>
          </div>
          <div class="col-4 stat-item">
            <div class="stat-value">${{ avgPrice }}</div>
            <div class="stat-label">Avg. Price</div>
          </div>
          <div class="col-4 stat-item">
            <div class="stat-value">{{ roomsStore.rooms.length }}</div>
            <div class="stat-label">Total Suites</div>
          </div>
        </div>
      </div>
    </div>

    <section class="section" style="padding-top:2rem;">
      <div class="container">
        <!-- Filters -->
        <div class="row g-3 align-items-end mb-4">
          <!-- Search -->
          <div class="col-md-4">
            <label class="form-label" style="font-size:.75rem;letter-spacing:.1em;text-transform:uppercase;">Search</label>
            <input v-model="searchQuery" type="text" class="form-control" placeholder="Search suites…" />
          </div>

          <!-- Type filter -->
          <div class="col-md-3">
            <label class="form-label" style="font-size:.75rem;letter-spacing:.1em;text-transform:uppercase;">Type</label>
            <select v-model="typeFilter" class="form-select">
              <option value="">All Types</option>
              <option v-for="t in roomTypes" :key="t" :value="t">{{ t }}</option>
            </select>
          </div>

          <!-- Price range -->
          <div class="col-md-3">
            <label class="form-label" style="font-size:.75rem;letter-spacing:.1em;text-transform:uppercase;">Max Price: ${{ priceMax }}/night</label>
            <input v-model.number="priceMax" type="range" class="form-range" :min="minPrice" :max="maxPrice" :step="50" />
          </div>

          <!-- Sort -->
          <div class="col-md-2">
            <label class="form-label" style="font-size:.75rem;letter-spacing:.1em;text-transform:uppercase;">Sort</label>
            <select v-model="sortBy" class="form-select">
              <option value="default">Default</option>
              <option value="price-asc">Price: Low</option>
              <option value="price-desc">Price: High</option>
              <option value="likes">Most Liked</option>
            </select>
          </div>
        </div>

        <!-- Type buttons -->
        <div class="d-flex gap-2 flex-wrap mb-4">
          <button
            v-for="t in ['All', ...roomTypes]"
            :key="t"
            class="filter-btn"
            :class="{ active: (typeFilter === '' && t === 'All') || typeFilter === t }"
            @click="typeFilter = t === 'All' ? '' : t"
          >{{ t }}</button>
        </div>

        <!-- Results -->
        <div class="d-flex justify-content-between align-items-center mb-3">
          <p style="color:var(--color-muted);font-size:.875rem;margin:0;">{{ filteredRooms.length }} suite{{ filteredRooms.length !== 1 ? 's' : '' }} found</p>
          <button v-if="hasFilters" class="btn-reset" @click="resetFilters">Clear Filters</button>
        </div>

        <div v-if="filteredRooms.length" class="row g-4">
          <div class="col-md-6 col-lg-4" v-for="room in filteredRooms" :key="room.id">
            <RoomCard :room="room" />
          </div>
        </div>

        <div v-else class="no-results">
          <h3 class="no-results__title">No sanctuaries match your criteria.</h3>
          <p>Try adjusting your filters.</p>
          <button class="btn-reset" @click="resetFilters">Clear Filters</button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoomsStore } from '../stores/rooms.js'
import RoomCard from '../components/RoomCard.vue'

const roomsStore = useRoomsStore()

const searchQuery = ref('')
const typeFilter = ref('')
const sortBy = ref('default')

const minPrice = computed(() => Math.min(...roomsStore.rooms.map(r => r.pricePerNight)))
const maxPrice = computed(() => Math.max(...roomsStore.rooms.map(r => r.pricePerNight)))
const priceMax = ref(null)

// init priceMax after computed
if (priceMax.value === null) priceMax.value = maxPrice.value

const roomTypes = computed(() => [...new Set(roomsStore.rooms.map(r => r.type))])
const availableCount = computed(() => roomsStore.rooms.filter(r => r.status === 'Available').length)
const avgPrice = computed(() => Math.round(roomsStore.rooms.reduce((sum, r) => sum + r.pricePerNight, 0) / roomsStore.rooms.length))
const hasFilters = computed(() => searchQuery.value || typeFilter.value || priceMax.value < maxPrice.value || sortBy.value !== 'default')

const filteredRooms = computed(() => {
  let list = [...roomsStore.rooms]

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(r =>
      r.name.toLowerCase().includes(q) ||
      r.type.toLowerCase().includes(q) ||
      r.view.toLowerCase().includes(q) ||
      r.shortDescription.toLowerCase().includes(q)
    )
  }
  if (typeFilter.value) {
    list = list.filter(r => r.type === typeFilter.value)
  }
  if (priceMax.value !== null) {
    list = list.filter(r => r.pricePerNight <= priceMax.value)
  }

  if (sortBy.value === 'price-asc') list.sort((a, b) => a.pricePerNight - b.pricePerNight)
  else if (sortBy.value === 'price-desc') list.sort((a, b) => b.pricePerNight - a.pricePerNight)
  else if (sortBy.value === 'likes') list.sort((a, b) => b.likes - a.likes)

  return list
})

function resetFilters() {
  searchQuery.value = ''
  typeFilter.value = ''
  priceMax.value = maxPrice.value
  sortBy.value = 'default'
}
</script>
