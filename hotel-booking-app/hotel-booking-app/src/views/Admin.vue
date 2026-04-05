<template>
  <div class="page-content">
    <div style="background:var(--color-text);padding:5rem 0 2rem;">
      <div class="container">
        <span class="section__eyebrow" style="color:var(--color-gold-lt);">Admin Panel</span>
        <h1 class="section__title" style="color:#fff;">Grand Azure Management</h1>
        <div class="divider-gold"></div>
        <p style="color:rgba(255,255,255,.6);font-size:.875rem;">Logged in as: {{ authStore.user?.firstName }} {{ authStore.user?.lastName }} ({{ authStore.user?.role }})</p>
      </div>
    </div>

    <div class="container" style="padding-top:2rem;padding-bottom:4rem;">
      <!-- Tab Navigation -->
      <div class="admin-tabs mb-4">
        <button class="admin-tab" :class="{ active: activeTab === 'rooms' }" @click="activeTab = 'rooms'">Rooms Management</button>
        <button class="admin-tab" :class="{ active: activeTab === 'news' }" @click="activeTab = 'news'">News Management</button>
        <button class="admin-tab" :class="{ active: activeTab === 'users' }" @click="activeTab = 'users'">Users</button>
      </div>

      <!-- ====== ROOMS TAB ====== -->
      <div v-if="activeTab === 'rooms'">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h2 style="font-family:var(--font-serif);font-size:1.75rem;font-weight:400;">Rooms ({{ roomsStore.rooms.length }})</h2>
          <button class="btn-booking-submit" @click="openRoomForm(null)">+ Add New Room</button>
        </div>

        <!-- Room Form Modal -->
        <div v-if="showRoomForm" class="admin-modal-overlay" @click.self="showRoomForm = false">
          <div class="admin-modal">
            <h3 class="admin-modal__title">{{ editingRoom ? 'Edit Room' : 'Create New Room' }}</h3>
            <form @submit.prevent="saveRoom" class="row g-3">
              <div class="col-md-6">
                <label class="form-label">Room Name *</label>
                <input v-model="roomForm.name" type="text" class="form-control" :class="{'is-invalid':roomErrors.name}" placeholder="e.g. The Ocean Suite" />
                <div class="invalid-feedback">{{ roomErrors.name }}</div>
              </div>
              <div class="col-md-3">
                <label class="form-label">Type *</label>
                <select v-model="roomForm.type" class="form-select" :class="{'is-invalid':roomErrors.type}">
                  <option value="">Select type</option>
                  <option>Suite</option><option>Penthouse</option><option>Villa</option>
                  <option>Studio</option><option>Presidential</option><option>Cottage</option>
                </select>
                <div class="invalid-feedback">{{ roomErrors.type }}</div>
              </div>
              <div class="col-md-3">
                <label class="form-label">Status</label>
                <select v-model="roomForm.status" class="form-select">
                  <option>Available</option><option>Unavailable</option>
                </select>
              </div>
              <div class="col-12">
                <label class="form-label">Short Description *</label>
                <input v-model="roomForm.shortDescription" type="text" class="form-control" :class="{'is-invalid':roomErrors.shortDescription}" placeholder="Brief description" />
                <div class="invalid-feedback">{{ roomErrors.shortDescription }}</div>
              </div>
              <div class="col-12">
                <label class="form-label">Full Description</label>
                <textarea v-model="roomForm.description" class="form-control" rows="4" placeholder="Detailed description"></textarea>
              </div>
              <div class="col-md-6">
                <label class="form-label">Image URL *</label>
                <input v-model="roomForm.image" type="url" class="form-control" :class="{'is-invalid':roomErrors.image}" placeholder="https://..." />
                <div class="invalid-feedback">{{ roomErrors.image }}</div>
              </div>
              <div class="col-md-3">
                <label class="form-label">Price/Night ($) *</label>
                <input v-model.number="roomForm.pricePerNight" type="number" min="0" class="form-control" :class="{'is-invalid':roomErrors.pricePerNight}" />
                <div class="invalid-feedback">{{ roomErrors.pricePerNight }}</div>
              </div>
              <div class="col-md-3">
                <label class="form-label">Max Guests</label>
                <input v-model.number="roomForm.maxGuests" type="number" min="1" max="20" class="form-control" />
              </div>
              <div class="col-md-3">
                <label class="form-label">Size (m²)</label>
                <input v-model.number="roomForm.sizeSqm" type="number" min="0" class="form-control" />
              </div>
              <div class="col-md-3">
                <label class="form-label">Floor</label>
                <input v-model.number="roomForm.floor" type="number" min="1" class="form-control" />
              </div>
              <div class="col-md-3">
                <label class="form-label">View</label>
                <select v-model="roomForm.view" class="form-select">
                  <option>Ocean</option><option>Mountain</option><option>Garden</option>
                  <option>Forest</option><option>Panoramic</option><option>City</option>
                </select>
              </div>
              <div class="col-md-3">
                <!-- placeholder -->
              </div>
              <div class="col-md-6">
                <label class="form-label">Features (comma-separated)</label>
                <input v-model="roomForm.featuresRaw" type="text" class="form-control" placeholder="Ocean View, Terrace, Pool" />
              </div>
              <div class="col-12">
                <label class="form-label">Amenities (comma-separated)</label>
                <textarea v-model="roomForm.amenitiesRaw" class="form-control" rows="2" placeholder="King Bed, Rainfall Shower, Minibar…"></textarea>
              </div>
              <div class="col-12 d-flex gap-3 pt-2">
                <button type="submit" class="btn-booking-submit">{{ editingRoom ? 'Save Changes' : 'Create Room' }}</button>
                <button type="button" class="btn-reset" @click="showRoomForm = false">Cancel</button>
              </div>
            </form>
          </div>
        </div>

        <!-- Room Table -->
        <div class="admin-table-wrap">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Name</th><th>Type</th><th>Status</th><th>Price</th><th>Likes</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="room in roomsStore.rooms" :key="room.id">
                <td>
                  <div class="d-flex align-items-center gap-2">
                    <img :src="room.image" :alt="room.name" style="width:48px;height:36px;object-fit:cover;border-radius:4px;" />
                    <span>{{ room.name }}</span>
                  </div>
                </td>
                <td><span class="admin-badge">{{ room.type }}</span></td>
                <td>
                  <span class="admin-status" :class="room.status === 'Available' ? 'admin-status--ok' : 'admin-status--off'">
                    {{ room.status }}
                  </span>
                </td>
                <td>${{ room.pricePerNight.toLocaleString() }}</td>
                <td>♥ {{ room.likes }}</td>
                <td>
                  <div class="d-flex gap-2">
                    <button class="admin-action-btn admin-action-btn--edit" @click="openRoomForm(room)">Edit</button>
                    <button class="admin-action-btn admin-action-btn--delete" @click="deleteRoom(room.id)">Delete</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- ====== NEWS TAB ====== -->
      <div v-if="activeTab === 'news'">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h2 style="font-family:var(--font-serif);font-size:1.75rem;font-weight:400;">News Articles ({{ newsStore.articles.length }})</h2>
          <button class="btn-booking-submit" @click="openNewsForm(null)">+ Add New Article</button>
        </div>

        <!-- News Form Modal -->
        <div v-if="showNewsForm" class="admin-modal-overlay" @click.self="showNewsForm = false">
          <div class="admin-modal">
            <h3 class="admin-modal__title">{{ editingNews ? 'Edit Article' : 'Create New Article' }}</h3>
            <form @submit.prevent="saveNews" class="row g-3">
              <div class="col-md-8">
                <label class="form-label">Title *</label>
                <input v-model="newsForm.title" type="text" class="form-control" :class="{'is-invalid':newsErrors.title}" />
                <div class="invalid-feedback">{{ newsErrors.title }}</div>
              </div>
              <div class="col-md-4">
                <label class="form-label">Category *</label>
                <select v-model="newsForm.category" class="form-select" :class="{'is-invalid':newsErrors.category}">
                  <option value="">Select</option>
                  <option>Lifestyle</option><option>Dining</option><option>Wellness</option>
                  <option>Experiences</option><option>Culture</option>
                </select>
                <div class="invalid-feedback">{{ newsErrors.category }}</div>
              </div>
              <div class="col-md-6">
                <label class="form-label">Author</label>
                <input v-model="newsForm.author" type="text" class="form-control" placeholder="Author name" />
              </div>
              <div class="col-md-3">
                <label class="form-label">Date</label>
                <input v-model="newsForm.date" type="date" class="form-control" />
              </div>
              <div class="col-md-3">
                <label class="form-label">Image URL</label>
                <input v-model="newsForm.image" type="url" class="form-control" placeholder="https://…" />
              </div>
              <div class="col-12">
                <label class="form-label">Summary *</label>
                <textarea v-model="newsForm.summary" class="form-control" rows="2" :class="{'is-invalid':newsErrors.summary}"></textarea>
                <div class="invalid-feedback">{{ newsErrors.summary }}</div>
              </div>
              <div class="col-12">
                <label class="form-label">Full Content</label>
                <textarea v-model="newsForm.content" class="form-control" rows="5"></textarea>
              </div>
              <div class="col-12 d-flex gap-3 pt-2">
                <button type="submit" class="btn-booking-submit">{{ editingNews ? 'Save Changes' : 'Create Article' }}</button>
                <button type="button" class="btn-reset" @click="showNewsForm = false">Cancel</button>
              </div>
            </form>
          </div>
        </div>

        <!-- News Table -->
        <div class="admin-table-wrap">
          <table class="admin-table">
            <thead>
              <tr><th>Title</th><th>Category</th><th>Author</th><th>Date</th><th>Actions</th></tr>
            </thead>
            <tbody>
              <tr v-for="article in newsStore.articles" :key="article.id">
                <td style="max-width:300px;">{{ article.title }}</td>
                <td><span class="admin-badge">{{ article.category }}</span></td>
                <td>{{ article.author }}</td>
                <td>{{ formatDate(article.date) }}</td>
                <td>
                  <div class="d-flex gap-2">
                    <button class="admin-action-btn admin-action-btn--edit" @click="openNewsForm(article)">Edit</button>
                    <button class="admin-action-btn admin-action-btn--delete" @click="deleteNews(article.id)">Delete</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- ====== USERS TAB ====== -->
      <div v-if="activeTab === 'users'">
        <h2 style="font-family:var(--font-serif);font-size:1.75rem;font-weight:400;margin-bottom:1.5rem;">Registered Users ({{ users.length }})</h2>
        <div class="admin-table-wrap">
          <table class="admin-table">
            <thead>
              <tr><th>Name</th><th>Email</th><th>Role</th><th>Joined</th></tr>
            </thead>
            <tbody>
              <tr v-for="u in users" :key="u.id">
                <td>{{ u.firstName }} {{ u.lastName }}</td>
                <td>{{ u.email }}</td>
                <td><span class="admin-badge" :class="u.role === 'admin' ? 'admin-badge--admin' : ''">{{ u.role }}</span></td>
                <td>{{ u.createdAt ? formatDate(u.createdAt.split('T')[0]) : '—' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth.js'
import { useRoomsStore } from '../stores/rooms.js'
import { useNewsStore } from '../stores/news.js'

const authStore = useAuthStore()
const roomsStore = useRoomsStore()
const newsStore = useNewsStore()

onMounted(() => newsStore.loadArticles())

const activeTab = ref('rooms')
const users = computed(() => authStore.getAllUsers())

// ---- ROOMS ----
const showRoomForm = ref(false)
const editingRoom = ref(null)
const roomErrors = reactive({})
const roomForm = reactive({
  name: '', type: '', status: 'Available', shortDescription: '', description: '',
  image: '', pricePerNight: '', maxGuests: 2, sizeSqm: '', floor: 1,
  view: 'Ocean', featuresRaw: '', amenitiesRaw: ''
})

function openRoomForm(room) {
  editingRoom.value = room
  if (room) {
    Object.assign(roomForm, {
      ...room,
      featuresRaw: room.features?.join(', ') || '',
      amenitiesRaw: room.amenities?.join(', ') || ''
    })
  } else {
    Object.assign(roomForm, {
      name: '', type: '', status: 'Available', shortDescription: '', description: '',
      image: '', pricePerNight: '', maxGuests: 2, sizeSqm: '', floor: 1,
      view: 'Ocean', featuresRaw: '', amenitiesRaw: ''
    })
  }
  Object.keys(roomErrors).forEach(k => { roomErrors[k] = '' })
  showRoomForm.value = true
}

function saveRoom() {
  Object.keys(roomErrors).forEach(k => { roomErrors[k] = '' })
  let valid = true
  if (!roomForm.name) { roomErrors.name = 'Name is required.'; valid = false }
  if (!roomForm.type) { roomErrors.type = 'Type is required.'; valid = false }
  if (!roomForm.shortDescription) { roomErrors.shortDescription = 'Short description is required.'; valid = false }
  if (!roomForm.image) { roomErrors.image = 'Image URL is required.'; valid = false }
  if (!roomForm.pricePerNight || roomForm.pricePerNight <= 0) { roomErrors.pricePerNight = 'Valid price is required.'; valid = false }
  if (!valid) return

  const data = {
    ...roomForm,
    features: roomForm.featuresRaw.split(',').map(s => s.trim()).filter(Boolean),
    amenities: roomForm.amenitiesRaw.split(',').map(s => s.trim()).filter(Boolean)
  }
  delete data.featuresRaw
  delete data.amenitiesRaw

  if (editingRoom.value) {
    roomsStore.updateRoom(editingRoom.value.id, data)
  } else {
    roomsStore.createRoom(data)
  }
  showRoomForm.value = false
}

function deleteRoom(id) {
  if (confirm('Delete this room permanently?')) roomsStore.deleteRoom(id)
}

// ---- NEWS ----
const showNewsForm = ref(false)
const editingNews = ref(null)
const newsErrors = reactive({})
const newsForm = reactive({
  title: '', category: '', author: 'Grand Azure Editorial',
  date: new Date().toISOString().split('T')[0], image: '', summary: '', content: ''
})

function openNewsForm(article) {
  editingNews.value = article
  if (article) {
    Object.assign(newsForm, article)
  } else {
    Object.assign(newsForm, {
      title: '', category: '', author: 'Grand Azure Editorial',
      date: new Date().toISOString().split('T')[0], image: '', summary: '', content: ''
    })
  }
  Object.keys(newsErrors).forEach(k => { newsErrors[k] = '' })
  showNewsForm.value = true
}

function saveNews() {
  Object.keys(newsErrors).forEach(k => { newsErrors[k] = '' })
  let valid = true
  if (!newsForm.title) { newsErrors.title = 'Title is required.'; valid = false }
  if (!newsForm.category) { newsErrors.category = 'Category is required.'; valid = false }
  if (!newsForm.summary) { newsErrors.summary = 'Summary is required.'; valid = false }
  if (!valid) return

  if (editingNews.value) {
    newsStore.updateArticle(editingNews.value.id, { ...newsForm })
  } else {
    newsStore.createArticle({ ...newsForm })
  }
  showNewsForm.value = false
}

function deleteNews(id) {
  if (confirm('Delete this article permanently?')) newsStore.deleteArticle(id)
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}
</script>
