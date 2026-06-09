import { defineCustomElement } from 'vue'
import MixplaPlayer from './MixplaPlayer.ce.vue'

const MixplaPlayerElement = defineCustomElement(MixplaPlayer)

customElements.define('mixpla-player', MixplaPlayerElement)
