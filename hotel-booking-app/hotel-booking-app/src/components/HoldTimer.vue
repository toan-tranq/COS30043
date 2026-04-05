<template>
  <div class="hold-timer">
    <div class="hold-timer__ring-wrap">
      <svg class="hold-timer__svg" :width="size" :height="size" :viewBox="`0 0 ${size} ${size}`">
        <!-- Track -->
        <circle
          class="hold-timer__track"
          :cx="cx"
          :cy="cy"
          :r="radius"
          fill="none"
          :stroke="trackColor"
          :stroke-width="strokeWidth"
        />
        <!-- Progress arc -->
        <circle
          class="hold-timer__progress"
          :cx="cx"
          :cy="cy"
          :r="radius"
          fill="none"
          :stroke="progressColor"
          :stroke-width="strokeWidth"
          :stroke-dasharray="circumference"
          :stroke-dashoffset="dashOffset"
          stroke-linecap="round"
          transform="rotate(-90)"
          :style="{ transformOrigin: 'center', transition: 'stroke-dashoffset 1s linear, stroke .5s ease' }"
        />
        <!-- Center text -->
        <text
          :x="cx"
          :y="cy - 8"
          text-anchor="middle"
          dominant-baseline="middle"
          class="hold-timer__time-text"
          :fill="textColor"
        >{{ minutesDisplay }}</text>
        <text
          :x="cx"
          :y="cy + 18"
          text-anchor="middle"
          dominant-baseline="middle"
          class="hold-timer__label-text"
          :fill="labelColor"
        >{{ secondsDisplay }}</text>
      </svg>
    </div>
    <div class="hold-timer__info">
      <p class="hold-timer__heading">Room Reserved for You</p>
      <p class="hold-timer__sub">Complete your booking before the hold expires.</p>
      <div class="hold-timer__pulse" :class="{ 'hold-timer__pulse--urgent': isUrgent }">
        <span class="hold-timer__dot"></span>
        <span>{{ isUrgent ? 'Expiring soon' : 'Hold active' }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useHoldsStore } from '../stores/holds.js'

const props = defineProps({
  roomId: { type: Number, required: true },
  size: { type: Number, default: 120 }
})

const emit = defineEmits(['expired'])

const holdsStore = useHoldsStore()
const remainingMs = ref(holdsStore.getRemainingMs(props.roomId))

const HOLD_DURATION_MS = 5 * 60 * 1000

let interval = null

onMounted(() => {
  interval = setInterval(() => {
    remainingMs.value = holdsStore.getRemainingMs(props.roomId)
    if (remainingMs.value <= 0) {
      clearInterval(interval)
      emit('expired')
    }
  }, 1000)
})

onUnmounted(() => clearInterval(interval))

const cx = computed(() => props.size / 2)
const cy = computed(() => props.size / 2)
const strokeWidth = 8
const radius = computed(() => props.size / 2 - strokeWidth - 4)
const circumference = computed(() => 2 * Math.PI * radius.value)

const progress = computed(() => Math.max(0, remainingMs.value / HOLD_DURATION_MS))
const dashOffset = computed(() => circumference.value * (1 - progress.value))

const totalSeconds = computed(() => Math.ceil(remainingMs.value / 1000))
const minutes = computed(() => Math.floor(totalSeconds.value / 60))
const seconds = computed(() => totalSeconds.value % 60)

const minutesDisplay = computed(() => `${minutes.value}:${String(seconds.value).padStart(2, '0')}`)
const secondsDisplay = computed(() => 'remaining')

const isUrgent = computed(() => remainingMs.value < 60000)

const trackColor = '#e8e4de'
const progressColor = computed(() => {
  if (isUrgent.value) return '#c0392b'
  if (progress.value < 0.4) return '#e67e22'
  return '#2b4a6b'
})
const textColor = computed(() => isUrgent.value ? '#c0392b' : '#1c1a17')
const labelColor = '#7a7368'
</script>
