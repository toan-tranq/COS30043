import { defineStore } from 'pinia'
import { ref } from 'vue'

const STORAGE_KEY = 'ga_news'

export const useNewsStore = defineStore('news', () => {
  const articles = ref([])
  const loaded = ref(false)

  async function loadArticles() {
    if (loaded.value) return
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        articles.value = JSON.parse(saved)
        loaded.value = true
        return
      } catch { /* fall through to fetch */ }
    }
    try {
      const res = await fetch('/data/news.json')
      const data = await res.json()
      articles.value = data
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
      loaded.value = true
    } catch (e) {
      console.error('Failed to load news:', e)
    }
  }

  function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(articles.value))
  }

  function createArticle(data) {
    const article = {
      ...data,
      id: Date.now(),
      date: data.date || new Date().toISOString().split('T')[0]
    }
    articles.value.unshift(article)
    save()
    return article
  }

  function updateArticle(id, data) {
    const idx = articles.value.findIndex(a => a.id === Number(id))
    if (idx === -1) return false
    articles.value[idx] = { ...articles.value[idx], ...data }
    save()
    return true
  }

  function deleteArticle(id) {
    const idx = articles.value.findIndex(a => a.id === Number(id))
    if (idx === -1) return false
    articles.value.splice(idx, 1)
    save()
    return true
  }

  function getArticle(id) {
    return articles.value.find(a => a.id === Number(id))
  }

  return { articles, loaded, loadArticles, createArticle, updateArticle, deleteArticle, getArticle }
})
