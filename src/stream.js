export const STREAM_BASE_URL = window.MixplaWidget?.streamBase || 'https://mixpla.online'

export const getStreamUrl = (slug) => `${STREAM_BASE_URL}/aivox/${slug}/master.m3u8`
