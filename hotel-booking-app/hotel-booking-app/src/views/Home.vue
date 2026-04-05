<template>
  <div>
    <!-- Hero -->
    <section class="hero">
      <div class="hero__bg" style="background-image: url('https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1800&auto=format&fit=crop')"></div>
      <div class="hero__overlay"></div>
      <div class="hero__content">
        <p class="hero__eyebrow">A private concierge experience</p>
        <h1 class="hero__title">Grand Azure</h1>
        <p class="hero__subtitle">Find your unhurried escape in our refined sanctuaries above the sea and among the peaks.</p>
        <RouterLink to="/rooms" class="btn-hero">Explore Accommodations</RouterLink>
      </div>
    </section>

    <!-- Featured Rooms -->
    <section class="section">
      <div class="container">
        <div class="text-center mb-5">
          <span class="section__eyebrow">Curated Selection</span>
          <h2 class="section__title">Featured Sanctuaries</h2>
          <div class="divider-gold divider-gold--center"></div>
        </div>
        <div class="row g-4">
          <div class="col-md-6 col-lg-4" v-for="room in featuredRooms" :key="room.id">
            <RoomCard :room="room" />
          </div>
        </div>
        <div class="text-center mt-5">
          <RouterLink to="/rooms" class="btn-hero" style="background:var(--color-accent);border-color:var(--color-accent);color:#fff;padding:.75rem 2rem;">View All Suites</RouterLink>
        </div>
      </div>
    </section>

    <!-- Promise Section -->
    <section class="section section--alt">
      <div class="container">
        <div class="row align-items-center g-5">
          <div class="col-lg-5">
            <span class="section__eyebrow">The Grand Azure Promise</span>
            <h2 class="section__title">Elevating the art of hospitality.</h2>
            <div class="divider-gold"></div>
            <p class="section__lead mb-4">Every detail at Grand Azure is meticulously curated to anticipate your desires before they arise.</p>
            <div class="promise-feature" v-for="item in promises" :key="item">
              <div class="promise-feature__icon"></div>
              <p class="promise-feature__text">{{ item }}</p>
            </div>
          </div>
          <div class="col-lg-7">
            <img
              src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=900&auto=format&fit=crop"
              alt="Grand Azure Estate"
              class="w-100 rounded"
              style="height:500px;object-fit:cover;"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- Stats -->
    <section class="section" style="padding:4rem 0;background:var(--color-text);color:#fff;">
      <div class="container">
        <div class="row text-center g-4">
          <div class="col-6 col-md-3" v-for="stat in stats" :key="stat.label">
            <div class="stat-value" style="color:#c9a878;">{{ stat.value }}</div>
            <div class="stat-label" style="color:rgba(255,255,255,.5);">{{ stat.label }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Journal Teaser -->
    <section class="section">
      <div class="container">
        <div class="row align-items-end mb-4">
          <div class="col">
            <span class="section__eyebrow">From The Journal</span>
            <h2 class="section__title" style="margin-bottom:0;">Curated guides, dispatches<br>on the art of living well.</h2>
          </div>
          <div class="col-auto">
            <RouterLink to="/news" class="btn-reset">Read All Articles</RouterLink>
          </div>
        </div>
        <div class="divider-gold mb-5"></div>
        <div class="row g-4">
          <div class="col-md-4" v-for="article in latestArticles" :key="article.id">
            <div class="news-card h-100">
              <img :src="article.image" :alt="article.title" class="news-card__img" />
              <div class="news-card__body">
                <div class="news-card__category">{{ article.category }}</div>
                <h3 class="news-card__title">{{ article.title }}</h3>
                <p class="news-card__summary">{{ article.summary }}</p>
                <div class="news-card__meta">
                  <span>{{ formatDate(article.date) }}</span>
                  <span>{{ article.author }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useRoomsStore } from '../stores/rooms.js'
import { useNewsStore } from '../stores/news.js'
import RoomCard from '../components/RoomCard.vue'

const roomsStore = useRoomsStore()
const newsStore = useNewsStore()

onMounted(() => newsStore.loadArticles())

const featuredRooms = computed(() => roomsStore.rooms.slice(0, 3))
const latestArticles = computed(() => newsStore.articles.slice(0, 3))

const promises = [
  'Dedicated private concierge for every suite',
  'Bespoke dining tailored to your preferences',
  'Complimentary access to the Azure Spa & Thermal Baths',
  'Unhurried late checkout — no 11am scramble'
]

const stats = [
  { value: '8', label: 'Unique Sanctuaries' },
  { value: '24/7', label: 'Private Concierge' },
  { value: '14', label: 'Years of Excellence' },
  { value: '98%', label: 'Guest Satisfaction' }
]

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}
</script>
