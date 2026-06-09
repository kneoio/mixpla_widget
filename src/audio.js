import Hls from 'hls.js'
import { reactive } from 'vue'
import { getStreamUrl } from './stream.js'

function parseM3U8(text) {
  const lines = text.split('\n')
  let customSong = null
  let latest = null

  for (const raw of lines) {
    const line = raw.trim()

    if (line.startsWith('#EXT-X-CUSTOM-SONG:')) {
      try {
        const p = JSON.parse(line.slice('#EXT-X-CUSTOM-SONG:'.length))
        const title = p.title?.trim() || ''
        const artist = p.artist?.trim() || ''
        customSong = {
          title,
          artist,
          display: title && artist ? `${title} - ${artist}` : title || artist || ''
        }
      } catch { customSong = null }
      continue
    }

    if (line.startsWith('#EXTINF:')) {
      if (customSong) { latest = customSong; continue }
      const m = line.match(/#EXTINF:[^,]+,(.+)/)
      if (m) {
        const parts = m[1].trim().split(' - ')
        latest = parts.length >= 2
          ? { title: parts[0].trim(), artist: parts.slice(1).join(' - ').trim(), display: m[1].trim() }
          : { title: m[1].trim(), artist: '', display: m[1].trim() }
      }
    }
  }

  return latest
}

// Returns a per-instance audio controller — fixes the singleton bug where
// multiple widgets on the same page would share state and stomp each other.
export function createAudioController() {
  const state = reactive({
    isPlaying: false,
    isLoading: false,
    hasError: false,
    song: { title: '', artist: '', display: '' }
  })

  let hls = null
  let audio = null
  let metaInterval = null

  async function pollMeta(slug) {
    try {
      const level = hls?.levels?.[hls?.currentLevel ?? 0]
      const streamUrl = getStreamUrl(slug)
      const url = level?.url?.[0] ?? streamUrl.replace('/master.m3u8', '/stream.m3u8')
      const res = await fetch(url)
      const text = await res.text()
      const song = parseM3U8(text)
      if (song && song.display && song.display !== state.song.display) {
        state.song = song
      }
    } catch { /* silent */ }
  }

  function initAudio(el) {
    audio = el
    audio.addEventListener('play', () => { state.isPlaying = true })
    audio.addEventListener('pause', () => { state.isPlaying = false })
    audio.addEventListener('playing', () => { state.isLoading = false })
    audio.addEventListener('waiting', () => { state.isLoading = true })
    audio.addEventListener('error', () => { state.hasError = true; state.isLoading = false })
  }

  function stop() {
    clearInterval(metaInterval)
    metaInterval = null
    if (hls) { hls.destroy(); hls = null }
    if (audio) { audio.pause(); audio.src = '' }
    state.isPlaying = false
    state.isLoading = false
    state.song = { title: '', artist: '', display: '' }
  }

  async function play(slug) {
    if (!audio) return
    stop()

    state.isLoading = true
    state.hasError = false
    const url = getStreamUrl(slug)
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)

    if (!isSafari && Hls.isSupported()) {
      hls = new Hls()
      hls.loadSource(url)
      hls.attachMedia(audio)
      hls.on(Hls.Events.MANIFEST_PARSED, () => audio.play().catch(() => {}))
      hls.on(Hls.Events.ERROR, (_, data) => {
        if (data.fatal) { state.hasError = true; state.isLoading = false }
      })
    } else if (audio.canPlayType('application/vnd.apple.mpegurl')) {
      audio.src = url
      await audio.play().catch(() => {})
    } else {
      state.hasError = true
      state.isLoading = false
      return
    }

    metaInterval = setInterval(() => pollMeta(slug), 5000)
    pollMeta(slug)
  }

  // Guard against double-play while buffering (isLoading=true, isPlaying=false)
  function toggle(slug) {
    if (state.isPlaying || state.isLoading) stop()
    else play(slug)
  }

  return { state, initAudio, play, stop, toggle }
}
