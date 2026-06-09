<template>
  <div class="mp-widget">
    <button class="mp-btn" :class="{ playing: audio.isPlaying, loading: audio.isLoading }" @click="ctrl.toggle(slug)">
      <Transition name="icon" mode="out-in">
        <svg v-if="audio.isPlaying" key="pause" class="mp-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
        <svg v-else key="play" class="mp-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
      </Transition>
    </button>

    <span class="mp-led" :class="ledClass"></span>

    <div class="mp-info">
      <div class="mp-name">{{ label || slug }}</div>
      <div class="mp-song" v-if="audio.song.title">{{ audio.song.title }}<span v-if="audio.song.artist" class="mp-artist"> · {{ audio.song.artist }}</span></div>
      <div class="mp-song muted" v-else>—</div>
    </div>

    <audio ref="audioEl" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { createAudioController } from './audio.js'

const props = defineProps({
  slug: { type: String, required: true },
  label: { type: String, default: '' }
})

const audioEl = ref(null)
const ctrl = createAudioController()
const audio = ctrl.state

const ledClass = computed(() => {
  if (audio.hasError) return 'offline'
  if (audio.isLoading) return 'idle'
  if (audio.isPlaying) return 'online'
  return 'off'
})

onMounted(() => ctrl.initAudio(audioEl.value))
onUnmounted(() => ctrl.stop())
</script>

<style scoped>
.mp-widget {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  height: 56px;
  padding: 0 1.25rem;
  background: rgba(15, 15, 20, 0.95);
  border-radius: 14px;
  font-family: system-ui, -apple-system, sans-serif;
  min-width: 260px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.4);
}

.mp-btn {
  width: 32px;
  height: 32px;
  flex-shrink: 0;
  border-radius: 50%;
  border: 1.5px solid rgba(255,255,255,0.35);
  background: rgba(0,0,0,0.85);
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s, border-color 0.2s;
  box-shadow: 0 2px 8px rgba(0,0,0,0.5);
}

.mp-icon { width: 13px; height: 13px; }

.icon-enter-active { animation: icon-spin-in 0.3s cubic-bezier(0.34,1.56,0.64,1); }
.icon-leave-active { animation: icon-spin-out 0.2s ease-in; }

@keyframes icon-spin-in  { from { transform: rotate(-90deg); opacity: 0; } to { transform: rotate(0deg); opacity: 1; } }
@keyframes icon-spin-out { from { transform: rotate(0deg);   opacity: 1; } to { transform: rotate(90deg);  opacity: 0; } }

.mp-btn:hover { background: rgba(0,0,0,1); border-color: rgba(255,255,255,0.8); }
.mp-btn:active { opacity: 0.8; }

.mp-btn.playing {
  background: #ff4757;
  border-color: #ff4757;
  animation: pulse-play 1.5s ease-in-out infinite;
}

.mp-btn.loading {
  background: rgba(0,0,0,0.5);
  border-color: rgba(255,255,255,0.2);
  cursor: default;
}

.mp-led {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  flex-shrink: 0;
}

.mp-led.online  { background: #00e676; animation: blink 1.4s ease-in-out infinite; }
.mp-led.idle    { background: #ffb300; animation: blink 0.7s ease-in-out infinite; }
.mp-led.offline { background: #ff4757; opacity: 0.55; }
.mp-led.off     { background: rgba(255,255,255,0.15); }

.mp-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
  overflow: hidden;
}

.mp-name {
  font-size: 0.88rem;
  font-weight: 700;
  color: #fff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.mp-song {
  font-size: 0.75rem;
  color: rgba(255,255,255,0.5);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.mp-song.muted { color: rgba(255,255,255,0.2); }

.mp-artist { color: rgba(255,255,255,0.35); }

@keyframes pulse-play {
  0%, 100% { box-shadow: 0 0 12px rgba(255,71,87,0.8), 0 0 24px rgba(255,71,87,0.5); }
  50%       { box-shadow: 0 0 20px rgba(255,71,87,1),   0 0 40px rgba(255,71,87,0.7); }
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.3; }
}
</style>
