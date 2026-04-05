<template>
  <div class="page-content">
    <!-- Header -->
    <div class="news-header">
      <div class="container">
        <span class="section__eyebrow" style="color:var(--color-gold-lt);">The Journal</span>
        <h1 class="section__title" style="color:#fff;font-size:clamp(2.5rem,5vw,4rem);">Tales from Grand Azure.</h1>
        <div class="divider-gold"></div>
        <p style="color:rgba(255,255,255,.75);max-width:560px;">Curated guides to the locale, dispatches on the art of living well, and stories from within our walls.</p>
      </div>
    </div>

    <section class="section">
      <div class="container">
        <!-- Search + Filter Bar -->
        <div class="row g-3 align-items-center mb-4">
          <div class="col-md-6">
            <div style="position:relative;">
              <input
                v-model="searchQuery"
                type="text"
                class="form-control"
                placeholder="Search by title, content, author, or date…"
                style="padding-left:2.5rem;"
              />
              <span style="position:absolute;left:.85rem;top:50%;transform:translateY(-50%);color:var(--color-muted);font-size:.9rem;">⌕</span>
            </div>
          </div>
          <div class="col-md-6 d-flex gap-2 flex-wrap">
            <button
              v-for="cat in categories"
              :key="cat"
              class="category-pill"
              :class="{ active: activeCategory === cat }"
              @click="activeCategory = cat"
            >{{ cat }}</button>
          </div>
        </div>

        <!-- Results count -->
        <div class="mb-4 d-flex align-items-center justify-content-between">
          <p style="color:var(--color-muted);font-size:.875rem;margin:0;">
            Showing <strong>{{ filteredArticles.length }}</strong> of <strong>{{ newsStore.articles.length }}</strong> articles
          </p>
          <button v-if="searchQuery || activeCategory !== 'All'" class="btn-reset" @click="resetFilters">Reset Filters</button>
        </div>

        <!-- Articles Grid -->
        <div v-if="paginatedArticles.length" class="row g-4">
          <div class="col-md-6 col-lg-4" v-for="article in paginatedArticles" :key="article.id">
            <div class="news-card h-100">
              <img :src="article.image" :alt="article.title" class="news-card__img" loading="lazy" />
              <div class="news-card__body d-flex flex-column">
                <div class="news-card__category">{{ article.category }}</div>
                <h3 class="news-card__title">{{ article.title }}</h3>
                <p class="news-card__summary flex-grow-1">{{ article.summary }}</p>
                <div class="news-card__meta mt-auto">
                  <span>{{ formatDate(article.date) }}</span>
                  <span>{{ article.author }}</span>
                </div>

                <!-- Expand / Read more -->
                <button class="btn-reset mt-3 text-start" style="font-size:.8rem;letter-spacing:.1em;" @click="expandedId = expandedId === article.id ? null : article.id">
                  {{ expandedId === article.id ? '↑ Close' : '↓ Read More' }}
                </button>
                <Transition name="expand">
                  <div v-if="expandedId === article.id" class="news-full-content mt-3">
                    <p style="font-size:.9rem;color:var(--color-text);line-height:1.8;">{{ article.content }}</p>
                  </div>
                </Transition>
              </div>
            </div>
          </div>
        </div>

        <!-- No results -->
        <div v-else class="no-results">
          <h3 class="no-results__title">No articles found</h3>
          <p>Try adjusting your search or category filters.</p>
          <button class="btn-reset" @click="resetFilters">Reset Filters</button>
        </div>

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="d-flex justify-content-center align-items-center gap-2 mt-5">
          <button class="page-btn" :disabled="currentPage === 1" @click="currentPage--">← Prev</button>
          <button
            v-for="page in totalPages"
            :key="page"
            class="page-btn"
            :class="{ 'page-btn--active': currentPage === page }"
            @click="currentPage = page"
          >{{ page }}</button>
          <button class="page-btn" :disabled="currentPage === totalPages" @click="currentPage++">Next →</button>
        </div>

        <p v-if="totalPages > 1" class="text-center mt-2" style="color:var(--color-muted);font-size:.8rem;">
          Page {{ currentPage }} of {{ totalPages }}
        </p>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useNewsStore } from '../stores/news.js'

const newsStore = useNewsStore()
onMounted(() => newsStore.loadArticles())

const searchQuery = ref('')
const activeCategory = ref('All')
const currentPage = ref(1)
const expandedId = ref(null)
const PER_PAGE = 6

const categories = computed(() => {
  const cats = ['All', ...new Set(newsStore.articles.map(a => a.category))]
  return cats
})

const filteredArticles = computed(() => {
  let list = newsStore.articles
  if (activeCategory.value !== 'All') {
    list = list.filter(a => a.category === activeCategory.value)
  }
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(a =>
      a.title.toLowerCase().includes(q) ||
      a.content?.toLowerCase().includes(q) ||
      a.summary.toLowerCase().includes(q) ||
      a.author.toLowerCase().includes(q) ||
      a.date.includes(q) ||
      a.category.toLowerCase().includes(q)
    )
  }
  return list
})

const totalPages = computed(() => Math.ceil(filteredArticles.value.length / PER_PAGE))

const paginatedArticles = computed(() => {
  const start = (currentPage.value - 1) * PER_PAGE
  return filteredArticles.value.slice(start, start + PER_PAGE)
})

watch([searchQuery, activeCategory], () => { currentPage.value = 1 })

function resetFilters() {
  searchQuery.value = ''
  activeCategory.value = 'All'
  currentPage.value = 1
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}
</script>
