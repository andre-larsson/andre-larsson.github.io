import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ditherFadeUrl } from './render.js'

// Matches --blue-500; the menu's highlight bar fades out through this texture.
document.documentElement.style.setProperty('--dither-fade', `url(${ditherFadeUrl([47, 75, 214])})`)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
