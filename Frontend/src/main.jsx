import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { getFirebaseApp } from './utils/firebase.js'
import { applyTheme, THEME_C } from './utils/theme.js'

// E-25: Theme C is on only where the build sets VITE_THEME_C (QA). No-op otherwise.
applyTheme()

// Initialize the default Firebase app once at startup so features that rely on
// it (e.g. the checkout/payment modal) work on every page — including standalone
// landing pages that hide the navbar (which used to be what triggered init).
getFirebaseApp()

const start = () => createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// E-25: the Theme C stylesheet is large (it restyles every page) and is loaded
// ONLY where the switch is on. The live build never requests it — the branch
// below is removed at build time when VITE_THEME_C is not "true". Where it is
// on, the app waits for it so the old design never flashes first.
if (THEME_C) import('./theme/index.css').then(start, start)
else start()
