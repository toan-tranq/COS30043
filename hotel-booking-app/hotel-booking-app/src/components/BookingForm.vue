<template>
  <div class="booking-form-wrap mt-4">
    <div class="divider-gold mb-3"></div>
    <h3 class="booking-form__title">Complete Your Reservation</h3>
    <p class="booking-form__subtitle">Fill in your details to confirm this 5-minute hold.</p>

    <form @submit.prevent="submitBooking" novalidate class="row g-3">
      <div class="col-6">
        <label class="form-label">First Name <span class="required">*</span></label>
        <input v-model.trim="form.firstName" type="text" class="form-control" :class="{'is-invalid': errors.firstName}" v-focus />
        <div class="invalid-feedback">{{ errors.firstName }}</div>
      </div>
      <div class="col-6">
        <label class="form-label">Last Name <span class="required">*</span></label>
        <input v-model.trim="form.lastName" type="text" class="form-control" :class="{'is-invalid': errors.lastName}" />
        <div class="invalid-feedback">{{ errors.lastName }}</div>
      </div>
      <div class="col-12">
        <label class="form-label">Email <span class="required">*</span></label>
        <input v-model.trim="form.email" type="email" class="form-control" :class="{'is-invalid': errors.email}" />
        <div class="invalid-feedback">{{ errors.email }}</div>
      </div>
      <div class="col-6">
        <label class="form-label">Check-In <span class="required">*</span></label>
        <input v-model="form.checkIn" type="date" class="form-control" :class="{'is-invalid': errors.checkIn}" :min="today" />
        <div class="invalid-feedback">{{ errors.checkIn }}</div>
      </div>
      <div class="col-6">
        <label class="form-label">Check-Out <span class="required">*</span></label>
        <input v-model="form.checkOut" type="date" class="form-control" :class="{'is-invalid': errors.checkOut}" :min="form.checkIn || today" />
        <div class="invalid-feedback">{{ errors.checkOut }}</div>
      </div>
      <div class="col-6">
        <label class="form-label">Guests <span class="required">*</span></label>
        <select v-model="form.guests" class="form-select" :class="{'is-invalid': errors.guests}">
          <option value="">Select</option>
          <option v-for="n in maxGuests" :key="n" :value="n">{{ n }}</option>
        </select>
        <div class="invalid-feedback">{{ errors.guests }}</div>
      </div>
      <div class="col-6">
        <label class="form-label">Total Estimate</label>
        <div class="form-control" style="background:var(--color-bg);cursor:default;">
          <span v-if="nightCount > 0" style="font-family:var(--font-serif);font-size:1rem;">${{ totalEstimate.toLocaleString() }}</span>
          <span v-else style="color:var(--color-muted);">Select dates</span>
        </div>
      </div>
      <div class="col-12">
        <label class="form-label">Special Requests</label>
        <textarea v-model="form.specialRequests" class="form-control" rows="2" placeholder="Dietary needs, accessibility, preferences…"></textarea>
      </div>
      <div class="col-12">
        <button type="submit" class="btn-booking-submit w-100" :disabled="isSubmitting">
          {{ isSubmitting ? 'Confirming…' : 'Confirm Reservation' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useAuthStore } from '../stores/auth.js'

const props = defineProps({
  roomId: { type: Number, default: null },
  roomName: { type: String, default: '' },
  price: { type: Number, default: 0 },
  maxGuests: { type: Number, default: 6 }
})
const emit = defineEmits(['booked'])

const authStore = useAuthStore()
const today = computed(() => new Date().toISOString().split('T')[0])
const isSubmitting = ref(false)

const form = reactive({
  firstName: authStore.user?.firstName || '',
  lastName: authStore.user?.lastName || '',
  email: authStore.user?.email || '',
  checkIn: '',
  checkOut: '',
  guests: '',
  specialRequests: ''
})

const errors = reactive({
  firstName: '', lastName: '', email: '', checkIn: '', checkOut: '', guests: ''
})

const nightCount = computed(() => {
  if (!form.checkIn || !form.checkOut) return 0
  const diff = new Date(form.checkOut) - new Date(form.checkIn)
  return Math.max(0, Math.floor(diff / 86400000))
})

const totalEstimate = computed(() => nightCount.value * props.price)

function validate() {
  let valid = true
  Object.keys(errors).forEach(k => { errors[k] = '' })
  if (!form.firstName) { errors.firstName = 'Required.'; valid = false }
  if (!form.lastName) { errors.lastName = 'Required.'; valid = false }
  if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) { errors.email = 'Valid email required.'; valid = false }
  if (!form.checkIn) { errors.checkIn = 'Required.'; valid = false }
  if (!form.checkOut) { errors.checkOut = 'Required.'; valid = false }
  else if (form.checkIn && form.checkOut <= form.checkIn) { errors.checkOut = 'Must be after check-in.'; valid = false }
  if (!form.guests) { errors.guests = 'Required.'; valid = false }
  return valid
}

async function submitBooking() {
  if (!validate()) return
  isSubmitting.value = true
  await new Promise(r => setTimeout(r, 1000))
  isSubmitting.value = false
  emit('booked', { ...form, roomId: props.roomId, roomName: props.roomName })
}
</script>
