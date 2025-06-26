import './assets/main.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router.js'
import App from './App.vue'
import googleFontsURL from './utils/googleFonts' // ⬅️ Your dynamic font URL

// Dynamically add Google Fonts <link>
const link = document.createElement('link')
link.href = googleFontsURL
link.rel = 'stylesheet'
document.head.appendChild(link)

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')
