<template>
  <div class="mp-widget">
    <audio ref="audioEl" />

    <button class="mp-btn" :class="{ loading: audio.isLoading }" @click="ctrl.toggle(slug)">
      <span v-if="audio.isLoading" class="mp-spinner" />
      <span v-else-if="audio.isPlaying" class="mp-icon">&#9646;&#9646;</span>
      <span v-else class="mp-icon">&#9654;</span>
    </button>

    <div class="mp-info">
      <div class="mp-station">{{ label || slug }}</div>
      <div class="mp-song">{{ audio.song.display || ' ' }}</div>
    </div>

    <div v-if="audio.hasError" class="mp-error">Stream unavailable</div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { createAudioController } from './audio.js'

const props = defineProps({
  slug: { type: String, required: true },
  label: { type: String, default: '' }
})

const audioEl = ref(null)
const ctrl = createAudioController()
const audio = ctrl.state

onMounted(() => ctrl.initAudio(audioEl.value))
onUnmounted(() => ctrl.stop())
</script>

<style scoped>
.mp-widget {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  background: #111;
  border-radius: 12px;
  font-family: sans-serif;
  color: #fff;
  min-width: 220px;
}

.mp-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: #e63946;
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.mp-btn.loading { background: #555; cursor: default; }

.mp-icon { font-size: 16px; line-height: 1; }

.mp-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

.mp-info { overflow: hidden; }

.mp-station { font-size: 13px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

.mp-song { font-size: 11px; color: #aaa; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-top: 2px; }

.mp-error { font-size: 11px; color: #e63946; }
</style>
