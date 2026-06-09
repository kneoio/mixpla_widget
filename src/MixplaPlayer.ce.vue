<template>
  <div class="mp-widget">
    <audio ref="audioEl" />

    <button
      class="mp-btn"
      :class="{ loading: audio.isLoading, playing: audio.isPlaying }"
      @click="ctrl.toggle(slug)"
    >
      <span v-if="audio.isLoading" class="mp-spinner" />
      <span v-else-if="audio.isPlaying" class="mp-icon">&#9646;&#9646;</span>
      <span v-else class="mp-icon">&#9654;</span>
    </button>

    <div class="mp-info">
      <div class="mp-station">{{ label || slug }}</div>
      <div class="mp-song">{{ audio.song.display || ' ' }}</div>
    </div>

    <span v-if="!audio.hasError" class="mp-led" :class="{ active: audio.isPlaying, idle: audio.isLoading }" />
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
  background: #101010;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  color: rgba(255, 255, 255, 0.85);
  min-width: 220px;
  transition: border-color 0.2s ease;
}

.mp-widget:hover {
  border-color: rgba(255, 255, 255, 0.26);
}

.mp-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: #FF4757;
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 0 10px color-mix(in srgb, #FF4757 50%, transparent);
  transition: transform 0.25s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.25s ease;
}

.mp-btn:hover {
  transform: scale(1.08);
  box-shadow: 0 0 18px color-mix(in srgb, #FF4757 75%, transparent);
}

.mp-btn:active {
  transform: scale(0.95);
}

.mp-btn.playing {
  animation: btn-pulse 1.5s ease-in-out infinite;
}

.mp-btn.loading {
  background: rgba(255, 255, 255, 0.12);
  box-shadow: none;
  cursor: default;
}

.mp-btn.loading:hover {
  transform: none;
}

@keyframes btn-pulse {
  0%, 100% { box-shadow: 0 0 10px color-mix(in srgb, #FF4757 50%, transparent); }
  50%       { box-shadow: 0 0 22px color-mix(in srgb, #FF4757 80%, transparent); }
}

.mp-icon { font-size: 16px; line-height: 1; }

.mp-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-top-color: rgba(255, 255, 255, 0.85);
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

.mp-info { overflow: hidden; flex: 1; }

.mp-station {
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.18px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.mp-song {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.6);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-top: 2px;
}

.mp-led {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  flex-shrink: 0;
  background: rgba(255, 255, 255, 0.15);
  transition: background 0.3s ease, box-shadow 0.3s ease;
}

.mp-led.active {
  background: #00E676;
  box-shadow: 0 0 6px #00E676, 0 0 12px color-mix(in srgb, #00E676 60%, transparent);
  animation: led-pulse 2s ease-in-out infinite;
}

.mp-led.idle {
  background: #FFB300;
  box-shadow: 0 0 6px #FFB300;
  animation: led-pulse 2.5s ease-in-out infinite;
}

@keyframes led-pulse {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.55; }
}

.mp-error { font-size: 11px; color: #FF4757; }
</style>
