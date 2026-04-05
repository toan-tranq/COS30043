<template>
  <div class="page-content">
    <!-- Header -->
    <div class="about-header">
      <div class="container">
        <span class="section__eyebrow" style="color:var(--color-gold-lt);">Est. 2012</span>
        <h1 class="section__title" style="color:#fff;font-size:clamp(2.5rem,5vw,4rem);">Our Story</h1>
        <div class="divider-gold"></div>
        <p style="color:rgba(255,255,255,.75);max-width:600px;font-size:1.05rem;">
          Grand Azure Hotel represents the pinnacle of luxury hospitality, offering an unhurried, refined, and deeply personal escape for the discerning traveler.
        </p>
      </div>
    </div>

    <!-- Personalization Section -->
    <section class="section section--alt">
      <div class="container">
        <div class="row g-5 align-items-center">
          <div class="col-lg-5">
            <span class="section__eyebrow">Personalize Your Experience</span>
            <h2 class="section__title">Tell us who you are.</h2>
            <div class="divider-gold"></div>

            <div v-if="!hasGreeted">
              <p class="mb-4" style="color:var(--color-muted);">Share your name and choose your preferred view to personalize your Grand Azure welcome.</p>
              <form @submit.prevent="submitGreeting" class="row g-3">
                <div class="col-6">
                  <label class="form-label">First Name</label>
                  <input v-focus v-model="guestForm.firstName" type="text" class="form-control" :class="{'is-invalid': errors.firstName}" placeholder="First name" />
                  <div class="invalid-feedback">{{ errors.firstName }}</div>
                </div>
                <div class="col-6">
                  <label class="form-label">Last Name</label>
                  <input v-model="guestForm.lastName" type="text" class="form-control" :class="{'is-invalid': errors.lastName}" placeholder="Last name" />
                  <div class="invalid-feedback">{{ errors.lastName }}</div>
                </div>
                <div class="col-12">
                  <label class="form-label d-block mb-3">Choose Your View</label>
                  <div class="d-flex gap-3 flex-wrap">
                    <label class="view-option" :class="{ selected: guestForm.view === 'mountain' }">
                      <input v-model="guestForm.view" type="radio" value="mountain" class="view-radio" />
                      <img src="/images/landscape-mountain.png" alt="Mountain View" />
                      <span class="view-option__label">Mountain View</span>
                    </label>
                    <label class="view-option" :class="{ selected: guestForm.view === 'ocean' }">
                      <input v-model="guestForm.view" type="radio" value="ocean" class="view-radio" />
                      <img src="/images/landscape-ocean.png" alt="Ocean View" />
                      <span class="view-option__label">Ocean View</span>
                    </label>
                  </div>
                </div>
                <div class="col-12">
                  <button type="submit" class="btn-booking-submit">Personalize My Stay</button>
                </div>
              </form>
            </div>

            <!-- Welcome message -->
            <div v-else class="welcome-greeting">
              <div class="welcome-greeting__badge">Welcome, {{ guestName }}</div>
              <h3 class="section__title" style="font-size:1.8rem;margin-top:1rem;">
                Your <span style="color:var(--color-gold);">{{ guestForm.view === 'mountain' ? 'Mountain' : 'Ocean' }} View</span> sanctuary awaits.
              </h3>
              <p style="color:var(--color-muted);margin-bottom:1.5rem;">
                We have noted your preference for {{ guestForm.view === 'mountain' ? 'the alpine serenity of our mountain-facing rooms' : 'the calming rhythm of the ocean' }}.
                Your personal concierge will ensure your room is perfectly prepared.
              </p>
              <RouterLink :to="`/rooms`" class="btn-booking-submit" style="display:inline-block;text-decoration:none;">Browse {{ guestForm.view === 'mountain' ? 'Mountain' : 'Ocean' }} Rooms</RouterLink>
              <button class="btn-reset ms-3" @click="resetGreeting">Start over</button>
            </div>
          </div>

          <div class="col-lg-7">
            <Transition name="view-fade" mode="out-in">
              <img
                v-if="guestForm.view === 'mountain'"
                key="mountain"
                src="/images/landscape-mountain.png"
                alt="Mountain View"
                class="about-image"
              />
              <img
                v-else
                key="ocean"
                src="/images/landscape-ocean.png"
                alt="Ocean View"
                class="about-image"
              />
            </Transition>
          </div>
        </div>
      </div>
    </section>

    <!-- Our Values -->
    <section class="section">
      <div class="container">
        <div class="text-center mb-5">
          <span class="section__eyebrow">Our Philosophy</span>
          <h2 class="section__title">The principles that guide us.</h2>
          <div class="divider-gold divider-gold--center"></div>
        </div>
        <div class="row g-4">
          <div class="col-md-6 col-lg-3" v-for="value in values" :key="value.title">
            <div class="value-card">
              <div class="value-card__icon">{{ value.icon }}</div>
              <h3 class="value-card__title">{{ value.title }}</h3>
              <p class="value-card__text">{{ value.text }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Image Banner -->
    <div style="height:400px;overflow:hidden;position:relative;">
      <img
        src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1800&auto=format&fit=crop"
        alt="Grand Azure Hotel"
        style="width:100%;height:100%;object-fit:cover;filter:brightness(.6);"
      />
      <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;text-align:center;">
        <div>
          <p style="color:rgba(255,255,255,.7);font-size:.8rem;letter-spacing:.2em;text-transform:uppercase;margin-bottom:.75rem;">Est. 2012 — Established with a vision</p>
          <h2 style="font-family:var(--font-serif);font-size:clamp(2rem,5vw,3.5rem);color:#fff;font-weight:300;">Redefining what it means<br>to feel truly at home.</h2>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'

const guestForm = ref({ firstName: '', lastName: '', view: 'ocean' })
const errors = ref({ firstName: '', lastName: '' })
const hasGreeted = ref(false)

const guestName = computed(() => `${guestForm.value.firstName} ${guestForm.value.lastName}`.trim())

function submitGreeting() {
  errors.value = { firstName: '', lastName: '' }
  let valid = true
  if (!guestForm.value.firstName.trim()) { errors.value.firstName = 'Please enter your first name.'; valid = false }
  if (!guestForm.value.lastName.trim()) { errors.value.lastName = 'Please enter your last name.'; valid = false }
  if (valid) hasGreeted.value = true
}

function resetGreeting() {
  hasGreeted.value = false
  guestForm.value = { firstName: '', lastName: '', view: 'ocean' }
}

const values = [
  { icon: '◇', title: 'Presence', text: 'Every member of our team is trained to be fully present with each guest — not managing a queue, but genuinely attending to a person.' },
  { icon: '◇', title: 'Anticipation', text: 'The highest form of service is meeting a need before it becomes a request. We study our guests, remember everything, and act accordingly.' },
  { icon: '◇', title: 'Restraint', text: 'We believe luxury lives in quality, not abundance. Each suite contains exactly what is needed — nothing more, nothing less.' },
  { icon: '◇', title: 'Continuity', text: 'When you return, you are remembered. The relationship between Grand Azure and its guests deepens with each visit.' }
]
</script>
